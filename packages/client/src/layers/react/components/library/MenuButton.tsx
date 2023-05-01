import React from 'react';
import styled from 'styled-components';

import clickSoundUrl from 'assets/sound/fx/mouseclick.wav';
import { dataStore, VisibleModals } from 'layers/react/store/createStore';
import 'layers/react/styles/font.css';

// MenuButton renders a button that toggles a target modal. It supports a generic
// input of children, though this will usually just be text.
export const MenuButton = (props: Props) => {
  const {
    visibleModals,
    setVisibleModals,
    sound: { volume },
  } = dataStore();

  // toggles the target modal open and closed
  const handleToggle = () => {
    const clickSound = new Audio(clickSoundUrl);
    clickSound.volume = volume * 0.6;
    clickSound.play();
    setVisibleModals({ ...visibleModals, [props.targetDiv]: !visibleModals[props.targetDiv] });
  };

  return (
    <div id={props.id}>
        <Button style={{ pointerEvents: 'auto' }} onClick={handleToggle}>
          {props.children}
        </Button>
    </div>
  );
}

interface Props {
  id: string;
  targetDiv: keyof VisibleModals;
  children: React.ReactNode;
}

const Button = styled.button`
  cursor: pointer;

  &:active {
    background-color: #c4c4c4;
  }
`;
