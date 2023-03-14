/* eslint-disable prefer-const */
import { createNetworkLayer as createNetworkLayerImport } from './layers/network/createNetworkLayer';
import { createPhaserLayer as createPhaserLayerImport } from './layers/phaser/createPhaserLayer';
import { Layers } from './types';
import {
  getComponentValue,
  removeComponent,
  setComponent,
} from '@latticexyz/recs';
import { Time } from './utils/time';
import { Wallet } from 'ethers';
import { GameConfig } from './layers/network/config';
import { mountReact, setLayers, boot as bootReact } from './layers/react/boot';

let createNetworkLayer = createNetworkLayerImport;
let createPhaserLayer = createPhaserLayerImport;

// boot the whole thing
export async function boot() {
  bootReact();
  const game = await bootGame();
  setLayers.current(game.layers as Layers);
}

// boot the game (phaser and network layers)
async function bootGame() {
  const layers: Partial<Layers> = {};
  let initialBoot = true;

  async function rebootGame(): Promise<Layers> {
    mountReact.current(false);

    const params = new URLSearchParams(window.location.search);
    let worldAddress,
      wallet,
      chainIdString,
      jsonRpc,
      wsRpc,
      checkpointUrl,
      initialBlockNumber;
    let relayServiceUrl = '',
      faucetServiceUrl = '',
      snapshotUrl = '';

    const devMode = params.get('dev') === 'true';

    // LOCAL
    worldAddress = params.get('worldAddress');
    chainIdString = params.get('chainId');
    jsonRpc = params.get('rpc') || undefined;
    wsRpc = params.get('wsRpc') || undefined; // || (jsonRpc && jsonRpc.replace("http", "ws"));
    checkpointUrl = params.get('checkpoint') || undefined;
    snapshotUrl = params.get('snapshotUrl') || '';
    let initialBlockNumberString = params.get('initialBlockNumber');
    initialBlockNumber = initialBlockNumberString
      ? parseInt(initialBlockNumberString)
      : 0;

    wallet = new Wallet(
      '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
    );
    localStorage.setItem('burnerPrivateKey', wallet.privateKey);
    localStorage.setItem('burnerAddress', wallet.publicKey);

    let networkLayerConfig;
    if (worldAddress && wallet && chainIdString && jsonRpc) {
      networkLayerConfig = {
        worldAddress,
        privateKey: wallet.privateKey,
        chainId: parseInt(chainIdString),
        jsonRpc,
        wsRpc,
        checkpointUrl,
        devMode,
        initialBlockNumber,
        faucetServiceUrl,
        relayServiceUrl,
        snapshotUrl,
      };
    }


    if (!networkLayerConfig) throw new Error('Invalid config');

    if (!layers.network)
      layers.network = await createNetworkLayer(networkLayerConfig);
    if (!layers.phaser) layers.phaser = await createPhaserLayer(layers.network);

    Time.time.setPacemaker((setTimestamp) => {
      layers.phaser?.game.events.on('poststep', (time: number) => {
        setTimestamp(time);
      });
    });

    if (document.querySelectorAll('#phaser-game canvas').length > 1) {
      console.log('Detected two canvas elements, full reload');
    }

    if (initialBoot) {
      initialBoot = false;
      layers.network.startSync();
    }

    mountReact.current(true);

    return layers as Layers;
  }

  await rebootGame();

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