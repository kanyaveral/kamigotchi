import React, { useState, useRef } from 'react';
import { of } from 'rxjs';
import styled from 'styled-components';
import { ModalWrapperFull } from 'layers/react/components/library/ModalWrapper';
import { registerUIComponent } from 'layers/react/engine/store';
import 'layers/react/styles/font.css';
import homeImage from '../../../../assets/images/home_native.png';

export enum HelpComponentState {
  HOME_PAGE,
  KAMI_STATS,
  KAMI_INFO,
  OVERALL_HELP,
}

export function registerHelpModal() {
  registerUIComponent(
    'Help',
    {
      colStart: 69,
      colEnd: 100,
      rowStart: 10,
      rowEnd: 62,
    },

    (layers) => of(layers),

    () => {
      let helpContent = null;
      const [helpState, setHelpState] = useState<HelpComponentState>(HelpComponentState.HOME_PAGE);
      function handleLinkClick(state: HelpComponentState) {
        setHelpState(state);
      }

      const scrollableRef = useRef<HTMLDivElement>(null);

      switch (helpState) {
        case HelpComponentState.HOME_PAGE:
          helpContent = (
            <div>
              <Header>Help/Docs</Header>
              <div style={{ display: 'flex', flexDirection: 'column', marginTop: '5px' }}>
                <Link onClick={() => handleLinkClick(HelpComponentState.KAMI_STATS)}>
                  Kami Stats
                </Link>
                <Link onClick={() => handleLinkClick(HelpComponentState.KAMI_INFO)}>Kami Info</Link>
                <Link onClick={() => handleLinkClick(HelpComponentState.OVERALL_HELP)}>
                  Overall Help
                </Link>
                <Description>
                Welcome to Kamigotchi World.
                <br />
                You can move using the map.
                <br />
                <br />
                Look for a vending machine and for Nodes scattered throughout the world.
                </Description>
              </div>
            </div>
          );
          break;
        case HelpComponentState.KAMI_STATS:
          helpContent = (
            <div>
              <Button onClick={() => handleLinkClick(HelpComponentState.HOME_PAGE)}>
                <img style={{ height: '100%', width: 'auto' }} src={homeImage} alt='home_icon' />
              </Button>
              <Header>Stats</Header>
              {/* Kami Stats specific content */}
            </div>
          );
          break;
        case HelpComponentState.KAMI_INFO:
          helpContent = (
            <div>
            <Button onClick={() => handleLinkClick(HelpComponentState.HOME_PAGE)}>
              <img style={{ height: '100%', width: 'auto' }} src={homeImage} alt='home_icon' />
            </Button>
              <Header>Kami</Header>
              {/* Kami Info specific content */}
            </div>
          );
          break;
        case HelpComponentState.OVERALL_HELP:
          helpContent = (
            <div>
            <Button onClick={() => handleLinkClick(HelpComponentState.HOME_PAGE)}>
              <img style={{ height: '100%', width: 'auto' }} src={homeImage} alt='home_icon' />
            </Button>
              <Header>World</Header>
              {/* Overall Help specific content */}
            </div>
          );
          break;
        default:
          helpContent = (
            <div>
            <Button onClick={() => handleLinkClick(HelpComponentState.HOME_PAGE)}>
              <img style={{ height: '100%', width: 'auto' }} src={homeImage} alt='home_icon' />
            </Button>
              <Header>Help/Docs</Header>
              {/* Default content */}
            </div>
          );
          break;
      }

      return (
        <ModalWrapperFull divName='help' id='help_modal'>
          <Scrollable ref={scrollableRef}>
            {helpContent}
          </Scrollable>
        </ModalWrapperFull>
      );
    }
  );
}

const Button = styled.button`
  background-color: #ffffff;
  border-style: solid;
  border-width: 2px;
  border-color: black;
  color: black;
  font-size: 14px;
  cursor: pointer;
  pointer-events: auto;
  border-radius: 5px;
  font-family: Pixel;
  &:active {
    background-color: #c4c4c4;
  }
  margin-bottom: 5px;
`;

// Styled link component
const Link = styled.a`
  color: #222;
  text-decoration: underline;
  cursor: pointer;
  font-family: Pixel;
  padding: 2px;
  margin: 5px;
`;

const rangeInputStyle = {
  width: '55px',
  height: '15px',
  borderRadius: '10px',
  background: '#d3d3d3',
  outline: 'none',
  opacity: 0.7,
  transition: 'opacity 0.2s',
};

const Header = styled.p`
  font-size: 24px;
  color: #333;
  text-align: left;
  padding: 2px;
  font-family: Pixel;
`;

const SubHeader = styled.p`
  font-size: 14px;
  color: #333;
  text-align: left;
  padding: 2px;
  font-family: Pixel;
`;

const Description = styled.p`
  font-size: 15px;
  color: #333;
  text-align: left;
  font-family: Pixel;
  margin: 5px;
`;

const Scrollable = styled.div`
  overflow-y: scroll;
  height: 100%;
  max-height: 100%;
`;
