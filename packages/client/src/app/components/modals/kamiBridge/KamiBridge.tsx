import { EntityIndex } from '@mud-classic/recs';
import { useEffect, useState } from 'react';
import { interval, map } from 'rxjs';
import { useReadContracts, useWatchBlockNumber } from 'wagmi';

import { getAccount, getAccountKamis } from 'app/cache/account';
import { getConfigAddress } from 'app/cache/config';
import { getKami, isDead, isHarvesting, onCooldown } from 'app/cache/kami';
import { ModalHeader, ModalWrapper } from 'app/components/library';
import { registerUIComponent } from 'app/root';
import { useNetwork, useVisibility } from 'app/stores';
import { MenuIcons } from 'assets/images/icons/menu';
import { erc721ABI } from 'network/chain/ERC721';
import { queryAccountFromEmbedded } from 'network/shapes/Account';
import { Kami, queryKamiByIndex } from 'network/shapes/Kami';
import styled from 'styled-components';
import { Controls } from './Controls';
import { WildKamis } from './WildKamis';
import { WorldKamis } from './WorldKamis';

export function registerKamiBridge() {
  registerUIComponent(
    'KamiBridge',
    {
      colStart: 31,
      colEnd: 71,
      rowStart: 15,
      rowEnd: 99,
    },
    (layers) => {
      return interval(1000).pipe(
        map(() => {
          const { network } = layers;
          const { world, components } = network;
          const accountEntity = queryAccountFromEmbedded(network);
          const kamiRefreshOptions = {
            live: 2,
            progress: 3600,
          };

          return {
            network,
            data: {
              account: getAccount(world, components, accountEntity),
              kamiNFTAddress: getConfigAddress(world, components, 'KAMI721_ADDRESS'),
            },
            utils: {
              queryKamiByIndex: (index: number) => queryKamiByIndex(world, components, index),
              getKami: (entity: EntityIndex) =>
                getKami(world, components, entity, kamiRefreshOptions),
              getAccountKamis: (accountEntity: EntityIndex) =>
                getAccountKamis(world, components, accountEntity, kamiRefreshOptions),
            },
          };
        })
      );
    },
    ({ data, network, utils }) => {
      const { actions } = network;
      const { kamiNFTAddress, account } = data;
      const { getAccountKamis, getKami, queryKamiByIndex } = utils;
      const { selectedAddress, apis } = useNetwork();
      const { modals } = useVisibility();

      const [worldKamis, setWorldKamis] = useState<Kami[]>([]);
      const [wildKamis, setWildKamis] = useState<Kami[]>([]);
      const [selectedWild, setSelectedWild] = useState<Kami[]>([]);
      const [selectedWorld, setSelectedWorld] = useState<Kami[]>([]);
      const [tick, setTick] = useState(Date.now());

      /////////////////
      // BLOCK WATCHERS

      useWatchBlockNumber({
        onBlockNumber: () => refetchNFTs(),
      });

      const { refetch: refetchNFTs, data: nftData } = useReadContracts({
        contracts: [
          {
            address: kamiNFTAddress,
            abi: erc721ABI,
            functionName: 'getAllTokens',
            args: [account.ownerAddress],
          },
        ],
      });

      /////////////////
      // SUBSCRIPTIONS

      // ticking
      useEffect(() => {
        refetchNFTs();
        const tick = () => setTick(Math.floor(Date.now() / 1000));
        const timerID = setInterval(tick, 1000);
        return () => clearInterval(timerID);
      }, []);

      // clear out the selected kamis whenever the mode changes or the modal is opened
      useEffect(() => {
        if (!modals.bridgeERC721) return;
        setSelectedWild([]);
        setSelectedWorld([]);
      }, [modals.bridgeERC721]);

      // refresh world kamis every tick
      useEffect(() => {
        if (!modals.bridgeERC721) return;
        const accountKamis = getAccountKamis(account.entity);
        const filteredKamis = accountKamis.filter(
          (kami) => !onCooldown(kami) && !isHarvesting(kami) && !isDead(kami)
        );
        setWorldKamis(filteredKamis);
      }, [modals.bridgeERC721, tick]);

      // update list of wild kamis
      // TOTO: properly typecast the result of the abi call
      useEffect(() => {
        const result = (nftData?.[0]?.result ?? []) as number[];
        const entities = result.map((index: number) => queryKamiByIndex(index));
        const filtered = entities.filter((entity) => !!entity) as EntityIndex[];
        const externalKamis = filtered.map((entity: EntityIndex) => getKami(entity));
        setWildKamis(externalKamis);
      }, [nftData]);

      /////////////////
      // TRANSACTIONS

      // import a kami from the wild to the world
      // TODO: pets without accounts are linked to EOA, no account. link EOA
      const depositTx = (kamis: Kami[]) => {
        const api = apis.get(selectedAddress);
        if (!api) return console.error(`API not established for ${selectedAddress}`);

        const numKamis = kamis.length;
        const indices = kamis.map((kami) => kami.index);

        // determine the description based on number of kamis
        let description = '';
        if (numKamis == 1) description = `Staking ${kamis[0].name}`;
        else description = `Staking ${numKamis} Kami`;

        // add the transaction to the queue
        actions.add({
          action: 'KamiDeposit',
          params: indices,
          description,
          execute: async () => {
            return api.bridge.ERC721.kami.batch.stake(indices);
          },
        });
      };

      // export a kami from the world to the wild
      const withdrawTx = (kamis: Kami[]) => {
        const api = apis.get(selectedAddress);
        if (!api) return console.error(`API not established for ${selectedAddress}`);

        const numKamis = kamis.length;
        const indices = kamis.map((kami) => kami.index);

        // determine the description based on number of kamis
        let description = '';
        if (numKamis == 1) description = `Unstaking ${kamis[0].name}`;
        else description = `Unstaking ${numKamis} Kami`;

        // add the transaction to the queue
        actions.add({
          action: 'KamiWithdraw',
          params: indices,
          description,
          execute: async () => {
            return api.bridge.ERC721.kami.batch.unstake(indices);
          },
        });
      };

      /////////////////
      // RENDER

      return (
        <ModalWrapper
          id='bridgeERC721'
          header={<ModalHeader title='Kami Bridge' icon={MenuIcons.kami} />}
          canExit
          truncate
          noPadding
        >
          <HorizontalContainer>
            <WorldKamis
              mode={'IMPORT'}
              kamis={{ world: worldKamis, wild: wildKamis }}
              state={{ selectedWorld, setSelectedWorld, selectedWild }}
            />
            <Controls
              actions={{ import: depositTx, export: withdrawTx }}
              state={{ selectedWild, selectedWorld }}
            />
            <WildKamis
              mode={'EXPORT'}
              kamis={{ world: worldKamis, wild: wildKamis }}
              state={{ selectedWild, setSelectedWild, selectedWorld }}
            />
          </HorizontalContainer>
        </ModalWrapper>
      );
    }
  );
}

const HorizontalContainer = styled.div`
  display: flex;
  width: 100%;
  height: 33vw;
  align-items: stretch;
  justify-content: space-between;
`;
