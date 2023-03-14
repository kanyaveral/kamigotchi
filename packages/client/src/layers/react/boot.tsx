/* eslint-disable prefer-const */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerUIComponents as registerUIComponentsImport } from './components';
import { Engine as EngineImport } from './engine/Engine';
import { Layers } from '../../types';

let registerUIComponents = registerUIComponentsImport;
let Engine = EngineImport;


export const mountReact: { current: (mount: boolean) => void } = {
  current: () => void 0,
};

export const setLayers: { current: (layers: Layers) => void } = {
  current: () => void 0,
};

export function boot() {
  const rootElement = document.getElementById('react-root');
  if (!rootElement) return console.warn('React root not found');

  const root = ReactDOM.createRoot(rootElement);

  function renderEngine() {
    root.render(<Engine setLayers={setLayers} mountReact={mountReact} />);
  }

  renderEngine();
  registerUIComponents();
}

