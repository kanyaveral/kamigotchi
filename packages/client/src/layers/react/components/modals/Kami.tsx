/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useState } from 'react';
import { map, merge } from 'rxjs';
import { registerUIComponent } from 'layers/react/engine/store';
import styled from 'styled-components';
import { Has, HasValue, runQuery } from '@latticexyz/recs';
import { dataStore } from 'layers/react/store/createStore';
import { BigNumber, BigNumberish } from 'ethers';

import { ModalWrapperFull } from 'layers/react/components/library/ModalWrapper';
import { Kami, getKami } from 'layers/react/components/shapes/Kami';

export function registerKamiModal() {
  registerUIComponent(
    'KamiDetails',
    {
      colStart: 23,
      colEnd: 80,
      rowStart: 5,
      rowEnd: 90,
    },
    (layers) => {
      const {
        network: {
          components: { Balance, IsPet, MediaURI, PetID },
        },
      } = layers;

      return merge(IsPet.update$, Balance.update$, PetID.update$, MediaURI.update$).pipe(
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
          components: { IsPet, PetIndex },
        },
      } = layers;

      const {
        selectedEntities: {
          kami: { description },
        },
      } = dataStore();

      /////////////////
      // Get values
      const getPetIndex = (tokenID: string) => {
        return Array.from(
          runQuery([
            Has(IsPet),
            HasValue(PetIndex, {
              value: BigNumber.from(tokenID).toHexString(),
            }),
          ])
        )[0];
      };

      const hexToString = (num?: BigNumberish) => {
        return num ? BigNumber.from(num).toString() : '0';
      };

      /////////////////
      // Display values

      const [dets, setDets] = useState<Kami>();

      useEffect(() => {
        if (description && description != '0') {
          setDets(getKami(layers, getPetIndex(description), { traits: true }));
          console.log('KamiDetails: kami', dets);
        }
      }, [description]);

      const traitBox = () => {
        return (
          <KamiBox
            style={{
              maxWidth: '50%',
            }}
          >
            <KamiText>BACKGROUND</KamiText>
            <KamiFacts>{dets?.background?.name}</KamiFacts>
            <KamiText>BODY</KamiText>
            <KamiFacts>{dets?.body?.name}</KamiFacts>
            <KamiText>COLOR</KamiText>
            <KamiFacts>{dets?.color?.name}</KamiFacts>
            <KamiText>FACE</KamiText>
            <KamiFacts>{dets?.face?.name}</KamiFacts>
            <KamiText>HAND</KamiText>
            <KamiFacts>{dets?.hand?.name}</KamiFacts>
          </KamiBox>
        );
      };

      const affinitiesBox = () => {
        const str = dets?.affinities?.reduce((ac, x) => (ac = ac + ' | ' + x));
        return <KamiText>{str}</KamiText>;
      };

      return (
        <ModalWrapperFull divName='kami' id='kamiModal'>
          <TopDiv>
            <KamiImage src={dets?.uri} />
            <div style ={{
              display: 'grid'
            }}>
              <KamiName>{dets?.name} </KamiName>
              <KamiText
              style={{gridRow: 2, gridColumnStart: 1, gridColumnEnd: 5, margin: '10px'}}>
                {affinitiesBox()}
              </KamiText>
              <StatBox style= {{gridRow: 3, gridColumn: 1, marginLeft: '5px'}}>
                <KamiText> Health </KamiText>
                <KamiFacts> {hexToString(dets?.stats.health)} </KamiFacts>
              </StatBox>
              <StatBox style= {{gridRow: 3, gridColumn: 2, marginLeft: '5px'}}>
                <KamiText> Power </KamiText>
                <KamiFacts> {hexToString(dets?.stats.power)} </KamiFacts>
              </StatBox>
              <StatBox style= {{gridRow: 3, gridColumn: 3, marginLeft: '5px'}}>
                <KamiText> Violence </KamiText>
                <KamiFacts> {hexToString(dets?.stats.violence)} </KamiFacts>
              </StatBox>
              <StatBox style= {{gridRow: 3, gridColumn: 4, marginLeft: '5px'}}>
                <KamiText> Harmony </KamiText>
                <KamiFacts> {hexToString(dets?.stats.harmony)} </KamiFacts>
              </StatBox>
              <StatBox style= {{gridRow: 3, gridColumn: 5, marginLeft: '5px'}}>
                <KamiText> Harmony </KamiText>
                <KamiFacts> {hexToString(dets?.stats.slots)} </KamiFacts>
              </StatBox>
            </div>
          </TopDiv>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              padding: '10px',
            }}
          >
            {traitBox()}
          </div>
        </ModalWrapperFull>
      );
    }
  );
}

const KamiBox = styled.div`
  background-color: #ffffff;
  border-style: solid;
  border-width: 0px;
  border-color: black;
  color: black;
  text-decoration: none;
  font-size: 18px;
  margin: 2px 1px;
  padding: 0px 0px;
  border-radius: 5px;
  font-family: Pixel;

  display: grid;
  justify-items: center;
  justify-content: center;
  align-items: center;
  grid-row-gap: 10px;
  grid-column-gap: 10px;
`;

const KamiText = styled.p`
  background-color: #ffffff;
  color: black;
  font-size: 14px;
  font-family: Pixel;
  grid-row: 1
`;

const KamiFacts = styled.div`
  background-color: #ffffff;
  color: black;
  font-size: 20px;
  font-weight: 600;
  font-family: Pixel;
  margin: auto;
  grid-row: 2
`;

const KamiName = styled.div`
  grid-row: 1;
  grid-column-start: 1;
  grid-column-end: 5;
  font-size: 36px;
  color: #333;
  font-weight: bold;
  padding: 10px;
  font-family: Pixel;
`;

const KamiImage = styled.img`
  height: 200px;
  width: 200px;
  margin: 0px;
  padding: 0px;
  grid-row: 1 / span 1;
  border-width: 0px 2px 0px 0px;
  border-color: black;
  border-style: solid;
`;

const Line = styled.div`
  border-style: solid;
  border-width: 1px;
  border-color: black;
  color: black;
  height: 200px;
`;

const TopDiv = styled.div`
  border-style: solid;
  border-width: 2px;
  border-color: black;
  display: flex;
  padding: 0px;
`;

const StatBox = styled.div`
  border-style: solid;
  border-width: 2px;
  border-color: black;
  padding: 5px;
  display: grid;
`;
