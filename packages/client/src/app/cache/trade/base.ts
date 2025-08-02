import { EntityID, EntityIndex, World } from '@mud-classic/recs';

import { Trade as TradeHistory } from 'clients/kamiden/proto';
import { formatEntityID } from 'engine/utils';
import { BigNumber } from 'ethers';
import { Components } from 'network/';
import { getBuyAnchor, getSellAnchor, getTrade, Trade } from 'network/shapes/Trade';
import { getTradeHistory, State, Timestamp } from 'network/shapes/Trade/types';
import {
  getOwnsTradeID,
  getState,
  getTargetID,
  getTradeHistoryState,
} from 'network/shapes/utils/component';
import { getAccount } from '../account';
import { getOrder } from './helpers';

export const TradeCache = new Map<EntityID, Trade>();
export const HistoryUpdated = new Set<EntityID>();

const StateUpdateTs = new Map<EntityIndex, number>();
const TakerUpdateTs = new Map<EntityIndex, number>();

/// process all static data on for a Trade
export const process = (world: World, comps: Components, entity: EntityIndex, id: EntityID) => {
  const trade = getTrade(world, comps, entity);

  //set maker
  const makerID = getOwnsTradeID(comps, entity);
  trade.maker = getAccount(world, comps, world.entityToIndex.get(makerID)!);

  // set taker if defined
  const takerID = getTargetID(comps, entity, false);
  if (takerID) trade.taker = getAccount(world, comps, world.entityToIndex.get(takerID)!);

  // set order data
  trade.buyOrder = getOrder(world, comps, getBuyAnchor(world, trade.id));
  trade.sellOrder = getOrder(world, comps, getSellAnchor(world, trade.id));

  TradeCache.set(id, trade);
};

// Non live trades
export const processHistory = (
  world: World,
  comps: Components,
  tradeHistory: TradeHistory,
  id: EntityID
) => {
  let trade: Trade;
  // if the trade is already in the cache, update the state
  if (TradeCache.has(id)) {
    trade = TradeCache.get(id)!;
    trade.state = getTradeHistoryState(comps, tradeHistory) as State;
    trade.timestamps = getTradeHistoryState(comps, tradeHistory, true) as Timestamp;
    // if the trade is not in the cache, create a new one
  } else {
    trade = getTradeHistory(world, comps, tradeHistory, {
      maker: true,
      taker: true,
      buyOrder: true,
      sellOrder: true,
    });
  }

  TradeCache.set(id, trade);
  HistoryUpdated.add(id);
};

export interface RefreshOptions {
  state?: number;
  taker?: number;
}

// get a Trade from the cache and optionally update any changing data
export const get = (
  world: World,
  comps: Components,
  entity: EntityIndex,
  options?: RefreshOptions
): Trade => {
  const id = world.entities[entity];
  if (!TradeCache.has(id)) process(world, comps, entity, id);
  const trade = TradeCache.get(id)!;
  if (!options) return trade;

  const now = Date.now();
  // set participants
  if (options.state != undefined) {
    const updateTs = StateUpdateTs.get(entity) ?? 0;
    const updateDelta = (now - updateTs) / 1000; // convert to seconds
    if (updateDelta > options.state) {
      trade.state = getState(comps, entity) as State;
      StateUpdateTs.set(entity, now);
    }
  }
  if (options.taker != undefined) {
    const updateTs = TakerUpdateTs.get(entity) ?? 0;
    const updateDelta = (now - updateTs) / 1000; // convert to seconds
    if (updateDelta > options.taker) {
      const takerID = getTargetID(comps, entity, false);
      if (takerID) trade.taker = getAccount(world, comps, world.entityToIndex.get(takerID)!);
      TakerUpdateTs.set(entity, now);
    }
  }

  return trade;
};

// manages non live trades
export const getHistory = (world: World, comps: Components, tradeHistory: TradeHistory): Trade => {
  const id: EntityID = formatEntityID(BigNumber.from(tradeHistory.TradeId));
  if (!HistoryUpdated.has(id)) {
    processHistory(world, comps, tradeHistory, id);
  }
  const trade = TradeCache.get(id)!;
  // history trades don’t need to periodically update state and taker
  return trade;
};
