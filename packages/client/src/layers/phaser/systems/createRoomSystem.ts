/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { defineSystem, Has, HasValue, runQuery } from '@latticexyz/recs';

import { roomExits } from 'src/constants';
import { NetworkLayer } from 'layers/network/types';
import { PhaserLayer, PhaserScene } from 'layers/phaser/types';
import { closeModalsOnRoomChange, getCurrentRoom } from 'layers/phaser/utils';
import { dataStore } from 'layers/react/store/createStore';

export function createRoomSystem(network: NetworkLayer, phaser: PhaserLayer) {
  const {
    network: { connectedAddress },
    world,
    components: {
      IsAccount,
      Location,
      OperatorAddress
    },
  } = network;

  const {
    game: {
      scene: {
        keys: { Main },
      },
    },
  } = phaser;

  const myMain = Main as PhaserScene;

  defineSystem(world, [Has(OperatorAddress), Has(Location)], async (update) => {
    const accountIndex = Array.from(runQuery([
      HasValue(OperatorAddress, { value: connectedAddress.get() }),
      Has(IsAccount),
    ]))[0];

    if (accountIndex == update.entity) {
      const currentRoom = getCurrentRoom(Location, update.entity);

      dataStore.setState({ roomExits: roomExits[currentRoom] });

      myMain.interactiveObjects.forEach((object: any) => {
        try {
          object.removeInteractive();
          object.removeFromDisplayList();
        } catch (e) {
          // Ignore objects that have already had their interactivity removed
        }
      });
      myMain.interactiveObjects = [];
      closeModalsOnRoomChange();

      myMain.rooms![currentRoom].create(myMain);
    }
  });
}
