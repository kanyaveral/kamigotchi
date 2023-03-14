/* eslint-disable prefer-const */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerUIComponents as registerUIComponentsImport } from './layers/react/components';
import { Engine as EngineImport } from './layers/react/engine/Engine';
import { createNetworkLayer as createNetworkLayerImport } from './layers/network/createNetworkLayer';
import { createPhaserLayer as createPhaserLayerImport } from './layers/phaser/createPhaserLayer';
import { Layers } from './types';
import {
  getComponentValue,
  removeComponent,
  setComponent,
} from '@latticexyz/recs';
import { Time } from './utils/time';
import { createGameConfig } from './layers/network/createGameConfig';

let createNetworkLayer = createNetworkLayerImport;
let createPhaserLayer = createPhaserLayerImport;
let registerUIComponents = registerUIComponentsImport;
let Engine = EngineImport;


export async function boot() {
  bootReact();
  const game = await bootGame();
  setLayers.current(game.layers as Layers);
}

// Boot the game.
async function bootGame() {
  const layers = await rebootGame(true);

  const ecs = {
    setComponent,
    removeComponent,
    getComponentValue,
  };

  (window as any).layers = layers;
  (window as any).ecs = ecs;
  (window as any).time = Time.time;

  console.log('booted');
  return { layers, ecs };
}

// Reboots the game. Syncs data if initial boot.
// TODO: avoid syncing the data every time. Cache the data and save the most recent block seen.
async function rebootGame(initialBoot: boolean): Promise<Layers> {
  mountReact.current(false);
  const layers: Partial<Layers> = {};

  // create our game config with network details
  const gameConfig = createGameConfig();
  if (!gameConfig) throw new Error('Invalid config');

  // set the layers of the game
  if (!layers.network) layers.network = await createNetworkLayer(gameConfig);
  if (!layers.phaser) layers.phaser = await createPhaserLayer(layers.network);

  // wot is going on here
  Time.time.setPacemaker((setTimestamp) => {
    layers.phaser?.game.events.on('poststep', (time: number) => {
      setTimestamp(time);
    });
  });

  // failsafe for buggy load
  if (document.querySelectorAll('#phaser-game canvas').length > 1) {
    console.log('Detected two canvas elements, full reload');
  }

  // start syncing the network
  if (initialBoot) {
    initialBoot = false;
    layers.network.startSync();
  }

  mountReact.current(true);

  return layers as Layers;
}

// what can we do with this?
const mountReact: { current: (mount: boolean) => void } = {
  current: () => void 0,
};

// what can we do with this?
const setLayers: { current: (layers: Layers) => void } = {
  current: () => void 0,
};

// TODO: wait until the world is indexed before registering our data dependent UI components
function bootReact() {
  const rootElement = document.getElementById('react-root');
  if (!rootElement) return console.warn('React root not found');

  const root = ReactDOM.createRoot(rootElement);

  function renderEngine() {
    root.render(<Engine setLayers={setLayers} mountReact={mountReact} />);
  }

  renderEngine();
  registerUIComponents();
}
