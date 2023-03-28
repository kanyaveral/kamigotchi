import {
  EntityIndex,
  getComponentValue,
} from '@latticexyz/recs';
import { Layers } from 'src/types';

// standardized shape of a Node Entity
export interface Node {
  name: string;
  location: number;
}

// get a Node from its EntityIndex
export const getNode = (layers: Layers, index: EntityIndex): Node => {
  const {
    network: {
      components: {
        Name,
        Location,
      },
    },
  } = layers;

  return {
    name: getComponentValue(Name, index)?.value as string,
    location: getComponentValue(Location, index)?.value as number,
  };
}