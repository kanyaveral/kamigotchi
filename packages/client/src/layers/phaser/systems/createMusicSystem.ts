import { defineSystem, Has, HasValue, runQuery } from "@latticexyz/recs";

import { NetworkLayer } from "layers/network/types";
import { PhaserLayer, PhaserScene } from "layers/phaser/types";
import { getCurrentRoom } from "layers/phaser/utils";
import { dataStore } from "layers/react/store/createStore";

export function createMusicSystem(network: NetworkLayer, phaser: PhaserLayer) {
  const {
    world,
    components: {
      IsAccount,
      Location,
      OperatorAddress,
    },
    network: { connectedAddress }
  } = network;

  const {
    game: {
      scene: {
        keys: { Main },
      },
    },
  }: { game: Phaser.Game } = phaser;

  const myMain = Main as PhaserScene;

  defineSystem(world, [Has(OperatorAddress), Has(Location)], (update) => {
    const accountIndex = Array.from(runQuery([
      HasValue(OperatorAddress, { value: connectedAddress.get() }),
      Has(IsAccount),
    ]))[0];
    const currentRoom = getCurrentRoom(Location, update.entity);

    if (update.entity == accountIndex) {
      if (myMain.gmusic) myMain.gmusic.stop();

      myMain.gmusic = myMain.sound.add(`m_${currentRoom}`);

      const {
        sound: { volume },
      } = dataStore.getState();

      myMain.gmusic.volume = volume;
      myMain.gmusic.loop = true;
      myMain.gmusic.play();
    }
  });
}
