import { EntityID, EntityIndex, getComponentValue, World } from '@mud-classic/recs';

import { Trade as TradeHistory } from 'clients/kamiden/proto';
import { formatEntityID } from 'engine/utils';
import { BigNumber } from 'ethers';
import { Components } from 'network/components';
import { Account, getAccountByID } from '../Account';
import { getItemByIndex, Item } from '../Item';
import { getEntityByHash } from '../utils';
import {
  getEntityType,
  getOwnsTradeID,
  getState,
  getTargetID,
  getTradeHistoryState,
} from '../utils/component';

export interface Trade {
  id: EntityID;
  entity: EntityIndex;
  ObjectType: string;
  state: State;
  timestamps?: Timestamp;
  maker?: Account; // trade creator
  taker?: Account; // optional (only if designated taker defined)
  buyOrder?: TradeOrder; // from the perspective of the maker
  sellOrder?: TradeOrder; // from the perspective of the maker
}

export type State = 'PENDING' | 'EXECUTED' | 'CANCELLED' | 'COMPLETED';
export type Timestamp = Record<State, string>;
export interface TradeOrder {
  items: Item[];
  amounts: number[];
}
interface Options {
  buyOrder: boolean; // from the perspective of the maker
  sellOrder: boolean;
  maker: boolean;
  taker: boolean;
}

// get a Trade Object
export const getTrade = (
  world: World,
  comps: Components,
  entity: EntityIndex,
  options?: Options
): Trade => {
  const id = world.entities[entity];
  const trade: Trade = {
    id,
    entity,
    ObjectType: getEntityType(comps, entity),
    state: getState(comps, entity) as State,
  };

  if (options?.maker) {
    const makerID = getOwnsTradeID(comps, entity);
    trade.maker = getAccountByID(world, comps, makerID);
  }
  if (options?.taker) {
    const takerID = getTargetID(comps, entity);
    trade.taker = getAccountByID(world, comps, takerID);
  }
  if (options?.buyOrder) trade.buyOrder = getBuyOrder(world, comps, id);
  if (options?.sellOrder) trade.sellOrder = getSellOrder(world, comps, id);

  return trade;
};

export const getTradeHistory = (
  world: World,
  comps: Components,
  tradeHistory: TradeHistory,
  options?: Options
): Trade => {
  const id = formatEntityID(BigNumber.from(tradeHistory.TradeId));

  const tradeEntity = world.entityToIndex.get(id)!;
  const trade: Trade = {
    id,
    entity: tradeEntity,
    ObjectType: getEntityType(comps, tradeEntity),
    state: getTradeHistoryState(comps, tradeHistory) as State,
    timestamps: getTradeHistoryState(comps, tradeHistory, true) as Timestamp,
  };

  if (options?.maker) {
    const makerID = formatEntityID(BigNumber.from(tradeHistory.MakerId));
    trade.maker = getAccountByID(world, comps, makerID);
  }

  if (options?.taker) {
    const takerID = formatEntityID(BigNumber.from(tradeHistory.TakerId));
    trade.taker = getAccountByID(world, comps, takerID);
  }

  if (options?.buyOrder)
    trade.buyOrder = {
      items: tradeHistory.BuyOrderIndices.map((key) => getItemByIndex(world, comps, key)),
      amounts: tradeHistory.BuyOrderAmounts.map(Number),
    };

  if (options?.sellOrder)
    trade.sellOrder = {
      items: tradeHistory.SellOrderIndices.map((key) => getItemByIndex(world, comps, key)),
      amounts: tradeHistory.SellOrderAmounts.map(Number),
    };

  return trade;
};

// get a Buy Order Object, identified through the Trade ID
export const getBuyOrder = (world: World, comps: Components, tradeID: EntityID): TradeOrder => {
  return getOrder(world, comps, getBuyAnchor(world, tradeID));
};

// get a Sell Order Object, identified through the Trade ID
export const getSellOrder = (world: World, comps: Components, tradeID: EntityID): TradeOrder => {
  return getOrder(world, comps, getSellAnchor(world, tradeID));
};

// get an Order Object
const getOrder = (world: World, comps: Components, entity: EntityIndex | undefined): TradeOrder => {
  if (!entity) return { items: [], amounts: [] };

  const { Keys, Values } = comps;
  const keys = getComponentValue(Keys, entity)?.value as number[];
  const values = getComponentValue(Values, entity)?.value as number[];

  return {
    items: keys.map((key) => getItemByIndex(world, comps, key)),
    amounts: values,
  };
};

//////////////////
// IDs

export const getBuyAnchor = (world: World, tradeID: string) => {
  return getEntityByHash(world, ['trade.buy', tradeID], ['string', 'uint256']);
};

export const getSellAnchor = (world: World, tradeID: string) => {
  return getEntityByHash(world, ['trade.sell', tradeID], ['string', 'uint256']);
};
