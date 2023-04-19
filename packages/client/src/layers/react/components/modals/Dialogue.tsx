import React, { useEffect } from 'react';
import { of } from 'rxjs';
import { registerUIComponent } from 'layers/react/engine/store';
import { dataStore } from 'layers/react/store/createStore';
import styled from 'styled-components';
import 'layers/react/styles/font.css';
import { ModalWrapperLite } from '../library/ModalWrapper';
import { Stepper } from '../library/Stepper';

// TODO: update this file and component name to be more desctiptive
export function registerDialogueModal() {
  registerUIComponent(
    'DialogueModal',
    {
      colStart: 2,
      colEnd: 60,
      rowStart: 60,
      rowEnd: 82,
    },
    (layers) => of(layers),
    () => {
      const {
        visibleModals,
        setVisibleModals,
        dialogue: { description },
      } = dataStore();

      const hideModal = () => {
        setVisibleModals({
          ...visibleModals,
          dialogue: !visibleModals.dialogue,
        });
      };

      const showShop = () => {
        setVisibleModals({
          ...visibleModals,
          merchant: !visibleModals.merchant,
        });
      };

      useEffect(() => {
        if (visibleModals.dialogue === true)
          document.getElementById('object_modal')!.style.display = 'block';
      }, [visibleModals.dialogue]);

      return (
        <ModalWrapperLite id='object_modal' isOpen={visibleModals.dialogue}>
          <Stepper steps={steps} hideModal={hideModal} description={description} />
        </ModalWrapperLite>
      );
    }
  );
}

const StepOne = () => (
  <ModalContent>
    <Description>
      <Header style={{ color: 'black' }}>Click next to hear more</Header>
      <br />
      This is the second of a series of screens that introduce new players to the game.
    </Description>
  </ModalContent>
);

const StepTwo = (props: any) => {
  const { description, hideModal } = props;

  return (
    <ModalContent>
      <AlignRight>
        <TopButton style={{ pointerEvents: 'auto' }} onClick={hideModal}>
          X
        </TopButton>
      </AlignRight>
      <Description>{description}</Description>
    </ModalContent>
  );
};

const steps = (props: any) => [
  {
    title: 'One',
    content: <StepOne />,
  },
  {
    title: 'Two',
    content: <StepTwo description={props.description} hideModal={props.hideModal} />,
    modalContent: true,
  },
];

const Header = styled.p`
  font-size: 24px;
  color: #333;
  text-align: center;
  font-family: Pixel;
`;

const AlignRight = styled.div`
  text-align: right;
  margin: 0px;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  padding: 5px;
  width: 99%;
  border-style: solid;
  border-width: 2px;
  border-color: black;
  height: 100%;
`;

const Description = styled.p`
  font-size: 20px;
  color: #333;
  text-align: center;
  padding: 20px;
  font-family: Pixel;
`;

const TopButton = styled.button`
  background-color: #ffffff;
  border-style: solid;
  border-width: 2px;
  border-color: black;
  color: black;
  padding: 5px;
  font-size: 14px;
  cursor: pointer;
  pointer-events: auto;
  border-radius: 5px;
  font-family: Pixel;
  width: 30px;
  &:active {
    background-color: #c2c2c2;
  }
  margin: 0px;
`;
