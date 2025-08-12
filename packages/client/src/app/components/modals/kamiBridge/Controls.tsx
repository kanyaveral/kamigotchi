import styled from 'styled-components';

import { IconButton, KamiBlock, Overlay } from 'app/components/library';
import { ArrowIcons } from 'assets/images/icons/arrows';
import { Kami } from 'network/shapes/Kami';

interface Props {
  actions: {
    import: (kamis: Kami[]) => void;
    export: (kamis: Kami[]) => void;
  };

  state: {
    selectedWild: Kami[];
    selectedWorld: Kami[];
  };
}

export const Controls = (props: Props) => {
  const { actions, state } = props;

  const { selectedWild, selectedWorld } = state;

  // this allows importing and exporting at the same time
  const handleAction = () => {
    const kamisToImport = selectedWild.filter((kami) => selectedWild.includes(kami));
    const kamisToExport = selectedWorld.filter((kami) => selectedWorld.includes(kami));
    if (kamisToImport.length > 0) {
      actions.import(kamisToImport);
    }
    if (kamisToExport.length > 0) {
      actions.export(kamisToExport);
    }
  };

  return (
    <Container expand={selectedWild.length > 0 || selectedWorld.length > 0}>
      <Overlay top={0.9} orientation='column' fullWidth>
        <Text size={0.9}>
          {selectedWild.length > 0
            ? `Import (${selectedWild.length})`
            : `Export (${selectedWorld.length})`}
        </Text>
        <IconButton
          img={selectedWild.length > 0 ? ArrowIcons.left : ArrowIcons.right}
          onClick={handleAction}
          text={selectedWild.length > 0 ? 'Import' : 'Export'}
          disabled={selectedWild.length === 0 && selectedWorld.length === 0}
        />
      </Overlay>

      {selectedWild.length > 0 &&
        selectedWild.map((kami) => <KamiBlock key={kami.index} kami={kami} />)}
      {selectedWorld.length > 0 &&
        selectedWorld.map((kami) => <KamiBlock key={kami.index} kami={kami} />)}
    </Container>
  );
};

const Container = styled.div<{ expand: boolean }>`
  position: relative;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  border-left: solid black 0.15vw;
  border-right: solid black 0.15vw;
  overflow: hidden scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }

  ${({ expand }) => (expand ? ' width: 40%; justify-content: flex-start; ' : 'width: 23%;')}
  transition: width 1s ease-in-out;
  padding-top: 6vw;
`;

const Text = styled.div<{ size: number }>`
  font-size: ${(props) => props.size}vw;
  line-height: ${(props) => props.size * 1.5}vw;
  margin-bottom: 1vw;
`;
