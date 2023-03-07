import React, { useMemo } from 'react';
import { of } from 'rxjs';
import { registerUIComponent } from '../engine/store';
import styled from 'styled-components';
import { dataStore } from '../store/createStore';
import './font.css';
import { gridRooms } from '../../../constants';
import clickSound from '../../../public/sound/sound_effects/mouseclick.wav';
import { EntityID, HasValue, runQuery } from '@latticexyz/recs';
import { getCurrentRoom } from '../../phaser/utils';

const objectKeys = Object.keys(gridRooms);

export function registerWorldMap() {
  registerUIComponent(
    'WorldMap',
    {
      colStart: 1,
      colEnd: 27,
      rowStart: 4,
      rowEnd: 44,
    },
    (layers) => of(layers),
    (layers) => {
      const {
        network: {
          api: {
            player: {
              operator: { move },
            },
          },
          network: { connectedAddress },
          components: { Location, PlayerAddress },
          actions,
        },
      } = layers;
      const characterEntityNumber = Array.from(
        runQuery([HasValue(PlayerAddress, { value: connectedAddress.get() })])
      )[0];
      const currentRoom = getCurrentRoom(Location, characterEntityNumber);

      const {
        roomExits: { down, up },
      } = dataStore();

      const changeRoom = (side: number) => {
        const clickFX = new Audio(clickSound);
        clickFX.play();

        const actionID = `Moving...` as EntityID;

        actions.add({
          id: actionID,
          components: {},
          requirement: () => true,
          updates: () => [],
          execute: async () => {
            return move(side);
          },
        });
      };
  
      const rooms = useMemo(() => {
        const result = [];
      
        for (let i = 1; i <= 100; i++) {
          const roomStyle: any = { borderRadius: '0', border: '0' };
          if (objectKeys.includes(i.toString())) {
            if (gridRooms[i].available === false) {
              roomStyle.backgroundColor = 'gray';
            } else if (currentRoom === gridRooms[i].room) {
              roomStyle.backgroundColor = 'green';
            } else {
              roomStyle.backgroundColor = 'yellow';
            }
          }
      
          result.push(
            <Room
              key={`room_${i}`}
              style={roomStyle}
            />
          );
        }
      
        return result;
      }, [objectKeys, currentRoom]);
      

      return (
        <ModalWrapper id="world_map">
          <ModalContent>{rooms}</ModalContent>
          <ButtonWrapper>
            <Button
              style={{
                pointerEvents: 'auto',
                display: up === 0 ? 'none' : 'block',
              }}
              onClick={() => {
                changeRoom(up);
              }}
            >
              ↑
            </Button>
            <Button
              style={{
                pointerEvents: 'auto',
                display: down === 0 ? 'none' : 'block',
              }}
              onClick={() => {
                changeRoom(down);
              }}
            >
              ↓
            </Button>
          </ButtonWrapper>
        </ModalWrapper>
      );
    }
  );
}

const ModalWrapper = styled.div`
  background-color: white;
  height: 100%;
  width: 100%;
  border-style: solid;
  border-width: 2px;
  border-color: black;
  border-radius: 10px;
`;

const ModalContent = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(4, 1fr);
  grid-gap: 4px;
  padding: 8px;
  width: 70%;
  height: 80%;
`;

const Room = styled.div`
  width: 100%;
  height: 100%;
  background-color: white;
  border-radius: 4px;
  border: 2px solid black;
  transition: background-color 0.2s ease-in-out;
`;

const Button = styled.button`
  background-color: #ffffff;
  border-style: solid;
  border-width: 2px;
  border-color: black;
  color: black;
  padding: 5px;
  font-size: 29px;
  cursor: pointer;
  width: 10%;
  border-radius: 5px;
  position: static;
  font-family: Pixel;

  &:active {
    background-color: #c2c2c2;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 5%;
`;
