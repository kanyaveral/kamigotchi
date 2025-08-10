import { observer } from 'mobx-react-lite';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { allComponents } from 'app/components';
import { useLayers } from 'app/root/hooks';
import { useStream } from 'network/utils';
import type { UIComponent } from 'app/root/types';
import { Layers } from 'network/index';

export const MainWindow = observer(() => {
  const layers = useLayers();
  if (!layers) return null;

  return (
    <UIGrid>
      {allComponents.map((uiComponent) => (
        <UIComponentRenderer
          key={uiComponent.id}
          layers={layers}
          uiComponent={uiComponent}
        />
      ))}
    </UIGrid>
  );
});

const UIComponentRenderer = ({
  layers,
  uiComponent,
}: {
  layers: Layers;
  uiComponent: UIComponent;
}) => {
  const req$ = useMemo(() => uiComponent.requirement(layers), [uiComponent, layers]);

  const state = useStream(req$);

  if (!state) return null;

  return (
    <div
      style={{
        gridArea: `${uiComponent.gridConfig.rowStart} / ${uiComponent.gridConfig.colStart} / ${uiComponent.gridConfig.rowEnd} / ${uiComponent.gridConfig.colEnd}`,
      }}
    >
      {<uiComponent.Render {...state} />}
    </div>
  );
};

const UIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(100, 1%);
  grid-template-rows: repeat(100, 1%);
  position: absolute;
  left: 0;
  top: 0;
  height: 100vh;
  width: 100vw;
  pointer-events: none;
  z-index: 10;
  overflow: hidden;
`;
