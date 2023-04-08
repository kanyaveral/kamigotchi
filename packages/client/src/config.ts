import { defineScaleConfig } from '@latticexyz/phaserx';
import { defineMainScene } from './layers/phaser/scenes/MainScene';

export const phaserConfig = {
  parent: 'phaser-game',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: { debug: false, gravity: { y: 0 } },
  },
  scene: [defineMainScene().Main],
  title: 'Kamigotchi',
  scale: defineScaleConfig({
    parent: 'phaser-game',
    width: 544,
    height: 288,
  }),
};