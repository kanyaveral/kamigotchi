import { SvgIconComponent } from '@mui/icons-material';
import { ForwardedRef, forwardRef, useEffect, useState } from 'react';
import styled from 'styled-components';

import { clickFx, hoverFx, pulseFx } from 'app/styles/effects';
import { playClick } from 'utils/sounds';

interface Props {
  img?: string | SvgIconComponent;
  onClick: Function;
  text?: string;
  width?: number;
  color?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  pulse?: boolean;
  balance?: number;
  corner?: boolean;
  cornerAlt?: boolean;
  radius?: number;
  scale?: number;
  scaleOrientation?: 'vw' | 'vh';
  shadow?: boolean;
  flatten?: `left` | `right`; // flattens a side, for use with dropdowns
}

// ActionButton is a text button that triggers an Action when clicked
export const IconButton = forwardRef(function IconButton(
  props: Props,
  ref: ForwardedRef<HTMLButtonElement>
) {
  const { img, onClick, text, disabled } = props;
  const { color, fullWidth, pulse, shadow, width, flatten } = props; // general styling
  const { balance, corner } = props; // IconListButton options
  const { cornerAlt } = props; // open page in new tab indicator
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  const radius = props.radius ?? 0.45;
  const scale = props.scale ? 1 : 1;
  const scaleOrientation = props.scaleOrientation ?? 'vw';

  useEffect(() => {
    const updateViewportSize = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener('resize', updateViewportSize);

    // Cleanup
    return () => window.removeEventListener('resize', updateViewportSize);
  }, []);
  // layer on a sound effect
  const handleClick = async () => {
    playClick();
    await onClick();
  };

  const MyImage = () => {
    if (img) {
      if (typeof img === 'string') {
        return <Image src={img} scale={Math.floor(scale)} />;
      }

      const Icon = img;
      return <Icon />;
    }
  };

  return (
    <Container
      width={width}
      color={color ?? '#fff'}
      onClick={!disabled ? handleClick : () => {}}
      scale={scale}
      orientation={scaleOrientation}
      radius={radius}
      fullWidth={fullWidth}
      disabled={disabled}
      pulse={pulse}
      shadow={shadow}
      ref={ref}
      flatten={flatten}
    >
      {MyImage()}
      {text && (
        <Text scale={scale} orientation={scaleOrientation}>
          {text}
        </Text>
      )}
      {balance && <Balance>{balance}</Balance>}
      {corner && <Corner radius={radius - 0.15} orientation={scaleOrientation} flatten={flatten} />}
      {cornerAlt && <CornerAlt radius={radius - 0.15} orientation={scaleOrientation} />}
    </Container>
  );
});

interface ContainerProps {
  width?: number;
  color: string;
  scale: number;
  orientation: string;
  radius: number;
  fullWidth?: boolean;
  disabled?: boolean;
  pulse?: boolean;
  flatten?: `left` | `right`;
  shadow?: boolean;
}

const Container = styled.button<ContainerProps>`
  position: relative;
  border: solid black 0.15vw;
  border-radius: ${({ radius, orientation }) => `${radius}${orientation}`};

  height: 100%;
  width: ${({ fullWidth, width }) =>
    fullWidth ? '100%' : width ? `${Math.round(width * 0.9)}vw` : 'auto'};
  min-width: fit-content;
  padding: ${({ scale, orientation }) => `${scale * 0.1}${orientation}`};
  padding: ${({ scale, orientation }) => `${Math.round(scale * 0.1 * 100) / 100}${orientation}`};

  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  background-color: ${({ color, disabled }) => (disabled ? '#bbb' : color)};
  box-shadow: ${({ shadow, scale }) => shadow && `0 0 ${scale * 0.1}vw black`};

  cursor: ${({ disabled }) => (disabled ? 'help' : 'pointer')};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  user-select: none;
  ${({ flatten }) =>
    flatten === `right`
      ? ` border-top-right-radius: 0;
      border-bottom-right-radius: 0;
  `
      : flatten === `left` &&
        ` border-top-left-radius: 0;
      border-bottom-left-radius: 0;
  `}
  &:hover {
    animation: ${() => hoverFx()} 0.2s;
    transform: scale(1.05);
  }
  &:active {
    animation: ${() => clickFx()} 0.3s;
  }

  ${({ pulse }) => pulse && `animation: ${pulseFx} 2.5s ease-in-out infinite;`}
`;

const Image = styled.img<{
  scale: number;
}>`
  width: ${({ scale }) => `${24 * scale * 0.5}px`};
  height: ${({ scale }) => `${24 * scale * 0.5}px`};

  user-drag: none;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  image-rendering: -moz-crisp-edges;
  backface-visibility: hidden;
  display: block;
`;

const Text = styled.div<{ scale: number; orientation: string }>`
  font-size: ${({ scale }) => scale * 0.3}${({ orientation }) => orientation};
`;

// TODO: get this scaling correctly with parent hover
const Corner = styled.div<{ radius: number; orientation: string; flatten?: string }>`
  position: absolute;
  border: solid black ${({ radius }) => radius}${({ orientation }) => orientation};
  border-bottom-right-radius: ${({ radius, flatten }) => (flatten === 'right' ? 0 : radius - 0.15)}${({ orientation }) => orientation};
  border-color: transparent black black transparent;
  bottom: 0;
  right: 0;
  width: 0;
  height: 0;
`;

// TODO: get this scaling correctly with parent hover
const CornerAlt = styled.div<{ radius: number; orientation: string }>`
  position: absolute;
  border: solid black ${({ radius }) => radius}${({ orientation }) => orientation};
  border-top-right-radius: ${({ radius }) => radius - 0.15}${({ orientation }) => orientation};
  border-color: black black transparent transparent;
  top: 0;
  right: 0;
  width: 0;
  height: 0;
`;

const Balance = styled.div`
  position: absolute;
  background-color: white;
  border-top: solid black 0.15vw;
  border-left: solid black 0.15vw;
  border-radius: 0.3vw 0 0.3vw 0;
  bottom: 0;
  right: 0;

  font-size: 0.75vw;
  align-items: center;
  justify-content: center;
  padding: 0.2vw;
`;
