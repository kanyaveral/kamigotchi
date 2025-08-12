import styled from 'styled-components';

import { Overlay, TextTooltip } from 'app/components/library';
import { useSelected, useVisibility } from 'app/stores';
import { Kami } from 'network/shapes/Kami';
import { playClick } from 'utils/sounds';

interface Props {
  kami: Kami;
  select?: {
    onClick?: () => void;
    isDisabled?: boolean;
  };
  tooltip?: string[];
}

export const KamiBlock = (props: Props) => {
  const { kami, select, tooltip } = props;
  const { index, progress, name } = kami;
  const { kamiIndex, setKami } = useSelected();
  const { modals, setModals } = useVisibility();

  // toggle the kami modal depending on its current state
  const handleClick = () => {
    const sameKami = kamiIndex === kami.index;
    if (!sameKami) setKami(kami.index);
    if (modals.kami && sameKami) setModals({ kami: false });
    else setModals({ kami: true });
    playClick();
  };

  return (
    <Container>
      <TextTooltip text={tooltip ?? []}>
        <Image src={kami.image} onClick={handleClick} />
        <Overlay top={0.9} left={0.7}>
          <Grouping>
            <Text size={0.6}>Lvl</Text>
            <Text size={0.6}>{progress?.level ?? '???'}</Text>
          </Grouping>
        </Overlay>
        <Overlay top={0.9} right={0.7}>
          <Text size={0.6}>{index}</Text>
        </Overlay>
        <Overlay bottom={0.6} fullWidth>
          <Text size={0.6}>{name}</Text>
        </Overlay>
        {select && (
          <Overlay bottom={0.5} right={0.5}>
            <ClickBox type='checkbox' disabled={!!select.isDisabled} onClick={select.onClick} />
          </Overlay>
        )}
      </TextTooltip>
    </Container>
  );
};

const Container = styled.div`
  background-color: white;
  border-radius: 0.6vw;
  margin: 0.9vw;
  filter: drop-shadow(0.2vw 0.2vw 0.1vw black);
`;

const Image = styled.img<{ onClick?: () => void }>`
  border: solid black 0.15vw;
  border-radius: 0.6vw;
  width: 10vw;
  image-rendering: pixelated;
  user-drag: none;

  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'inherit')};
  pointer-events: ${({ onClick }) => (onClick ? 'auto' : 'none')};
  &:hover {
    opacity: 0.6;
  }
`;

const Grouping = styled.div`
  position: relative;
  height: 100%;

  display: flex;
  flex-flow: row nowrap;
  align-items: flex-end;
`;

const Text = styled.div<{ size: number }>`
  color: white;
  font-size: ${(props) => props.size}vw;
  text-shadow: ${(props) => `0 0 ${props.size * 0.5}vw black`};
`;

const ClickBox = styled.input`
  border: 'solid .15vw #333';
  border-radius: 0.4vw;
  width: 1.8vw;
  height: 1.8vw;

  opacity: 0.9;

  user-select: none;
`;
