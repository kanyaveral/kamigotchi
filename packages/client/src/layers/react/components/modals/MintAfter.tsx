import React from 'react';
import { of } from 'rxjs';
import { registerUIComponent } from 'layers/react/engine/store';
import { dataStore } from 'layers/react/store/createStore';
import styled from 'styled-components';
import 'layers/react/styles/font.css';
import { ModalWrapperFull } from '../library/ModalWrapper';
import { ActionButton } from 'layers/react/components/library/ActionButton';

// TODO: update this file and component name to be more desctiptive
export function registerMintAfterModal() {
  registerUIComponent(
    'PostMint',
    {
      colStart: 35,
      colEnd: 60,
      rowStart: 40,
      rowEnd: 60,
    },
    (layers) => of(layers),
    () => {
      const {
        visibleModals,
        setVisibleModals,
      } = dataStore();

      const OpenPartyModal = () => {
        setVisibleModals({ ...visibleModals, kamiMintPost: false, party: true });
      }

      const PartyButton = (
        <ActionButton
          id='button-mint'
          onClick={OpenPartyModal}
          size='large'
          text='View my party'
        />
      );

      return (
        <ModalWrapperFull divName="kamiMintPost" id="postMintModal">
          <CenterBox>
            <Description>Minted!</Description>
          </CenterBox>
          {PartyButton}
        </ModalWrapperFull>
      );
    }
  );
}

const CenterBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 10px 10px 10px;
`;

const Description = styled.p`
  font-size: 22px;
  color: #333;
  text-align: center;
  padding: 10px;
  font-family: Pixel;
`;

const KamiImage = styled.img`
  border-style: solid;
  border-width: 0px;
  border-color: black;
  height: 90px;
  margin: 0px;
  padding: 0px;
`;
