import React, { useState } from 'react';
import { of } from 'rxjs';
import styled from 'styled-components';
import { ModalWrapperFull } from 'layers/react/components/library/ModalWrapper';
import { registerUIComponent } from 'layers/react/engine/store';
import 'layers/react/styles/font.css';

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
              </div>
            </div>
          );
          break;
        case HelpComponentState.KAMI_STATS:
          helpContent = (
            <div>
              <Button onClick={() => handleLinkClick(HelpComponentState.HOME_PAGE)}>
                Home Page
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
                Home Page
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
                Home Page
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
                Home Page
              </Button>
              <Header>Help/Docs</Header>
              {/* Default content */}
            </div>
          );
          break;
      }

      return (
        <ModalWrapperFull divName='help' id='help_modal'>
          {helpContent}
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
  padding: 5px;
  font-size: 14px;
  cursor: pointer;
  pointer-events: auto;
  border-radius: 5px;
  font-family: Pixel;
  width: 30px;
  &:active {
    background-color: #c4c4c4;
  }
  margin: 0px;
`;

// Styled link component
const Link = styled.a`
  color: #222;
  text-decoration: underline;
  cursor: pointer;
  font-family: Pixel;
  padding: 2px;
  margin-top: 2px;
  margin-bottom: 2px;
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
  font-size: 14px;
  color: #333;
  text-align: center;
  font-family: Pixel;
  margin-top: 5px;
`;
