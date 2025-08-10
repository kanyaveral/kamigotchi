import React from 'react';
import { Observable } from 'rxjs';

import { Layers } from 'network/';

export type GridConfiguration = {
  colStart: number;
  colEnd: number;
  rowStart: number;
  rowEnd: number;
};

export type UIComponent = {
  id: string;
  gridConfig: GridConfiguration;
  requirement: (layers: Layers) => Observable<any>;
  Render: React.FC<any>;
}
