import type { UIComponent } from './types';
import { registerUIComponents } from './store';

export function initializeUIRegistry(descriptors: UIComponent[]) {
  registerUIComponents(descriptors);
}

