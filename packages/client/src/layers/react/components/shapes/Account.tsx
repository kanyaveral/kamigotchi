import {
  EntityIndex,
  EntityID,
  getComponentValue,
} from '@latticexyz/recs';
import { Layers } from 'src/types';

// standardized shape of an Account Entity
export interface Account {
  id: EntityID;
  name?: string;
  operatorEOA?: string;
  ownerEOA?: string;
}

// get an Account from its EnityIndex
export const getAccount = (layers: Layers, index: EntityIndex): Account => {
  const {
    network: {
      world,
      components: {
        Name,
        OperatorAddress,
        OwnerID,
      },
    },
  } = layers;

  return {
    id: world.entities[index],
    name: getComponentValue(Name, index)?.value as string,
    operatorEOA: getComponentValue(OperatorAddress, index)?.value as string,
    ownerEOA: getComponentValue(OwnerID, index)?.value as string,
  };
}
