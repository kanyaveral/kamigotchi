import { observable } from 'mobx';
import { allComponents } from 'app/components';

export const RootStore = observable({
  UIComponents: new Map(
    allComponents.map((component) => [
      component.id,
      component
    ])
  ),
});
