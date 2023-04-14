/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BigNumber, utils } from 'ethers';
import React from 'react';
import { map, merge } from 'rxjs';
import styled from 'styled-components';
import { registerUIComponent } from 'layers/react/engine/store';
import {
  EntityID,
  EntityIndex,
  getComponentValue,
} from '@latticexyz/recs';
import { waitForActionCompletion } from '@latticexyz/std-client';

import mintSound from 'assets/sound/fx/tami_mint_vending_sound.mp3';
import { dataStore } from 'layers/react/store/createStore';
import { ModalWrapperFull } from 'layers/react/components/library/ModalWrapper';
import { ActionButton } from 'layers/react/components/library/ActionButton';

export function registerKamiMintModal() {
  registerUIComponent(
    'KamiMint',
    {
      colStart: 33,
      colEnd: 65,
      rowStart: 37,
      rowEnd: 70,
    },
    (layers) => {
      const {
        network: {
          components: { IsPet, Balance },
          world,
        },
      } = layers;

      return merge(IsPet.update$, Balance.update$).pipe(
        map(() => {
          return {
            layers,
          };
        })
      );
    },

    ({ layers }) => {
      const {
        network: {
          api: { player },
          network: { connectedAddress },
          actions,
          world,
        },
      } = layers;

      const {
        visibleModals,
        setVisibleModals,
        sound: { volume },
      } = dataStore();

      /////////////////
      // ACTIONS

      const mintTx = (address: string) => {
        const actionID = `Minting Kami` as EntityID;
        actions.add({
          id: actionID,
          components: {},
          requirement: () => true,
          updates: () => [],
          execute: async () => {
            return player.ERC721.mint(address);
          },
        });
        return actionID;
      };

      const handleMinting = async () => {
        try {
          const mintActionID = mintTx(connectedAddress.get()!);
          await waitForActionCompletion(
            actions.Action,
            world.entityToIndex.get(mintActionID) as EntityIndex
          );
          setVisibleModals({ ...visibleModals, kamiMint: false, kamiMintPost: true });

          const mintFX = new Audio(mintSound);
          mintFX.volume = volume * .6;
          mintFX.play();
        } catch (e) {
          console.log("KamiMint.tsx: handleMinting() mint failed", e);
        }
      };

      ///////////////
      // DISPLAY

      const MintButton = (
        <ActionButton
          id='button-mint'
          onClick={handleMinting}
          size='large'
          text='Mint'
        />
      );

      return (
        <ModalWrapperFull divName="kamiMint" id='kamiMintModal'>
          <CenterBox>
            <KamiImage src="https://kamigotchi.nyc3.digitaloceanspaces.com/placeholder.gif" />
            <Description>Kamigotchi?</Description>
          </CenterBox>
          {MintButton}
        </ModalWrapperFull>
      );
    }
  );
}

const CenterBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
`;

const Description = styled.p`
  font-size: 22px;
  color: #333;
  text-align: center;
  padding: 10px;
  font-family: Pixel;
`;

const KamiImage = styled.img`
  border-style: solid;
  border-width: 0px;
  border-color: black;
  height: 90px;
  margin: 0px;
  padding: 0px;
`;
