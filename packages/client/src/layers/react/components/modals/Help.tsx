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
  NODES,
  START
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
              <Link onClick={() => handleLinkClick(HelpComponentState.START)}>
                Getting Started
              </Link>
                <Link onClick={() => handleLinkClick(HelpComponentState.KAMI_INFO)}>Kamigotchi</Link>
                <Link onClick={() => handleLinkClick(HelpComponentState.NODES)}>
                  Nodes
                </Link>
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
              <Header>
                Stats
              </Header>
              <Description>
                Kamigotchi have several different statistics that determine their abilities. Base statistics are determined by a Kami's Traits.
              </Description>
            </div>
          );
          break;
        case HelpComponentState.START:
          helpContent = (
            <div>
              <Button onClick={() => handleLinkClick(HelpComponentState.HOME_PAGE)}>
                  <img style={{ height: '100%', width: 'auto' }} src={homeImage} alt='home_icon' />
              </Button>
              <Header>Start</Header>
              <Description>

              Welcome to Kamigotchi World.
              <br />
              You can move using the map.
              <br />
              <br />
              Look for a vending machine and for Nodes scattered throughout the world.
              </Description>
            </div>
          );
          break;
        case HelpComponentState.KAMI_INFO:
          helpContent = (
            <div>
            <Button onClick={() => handleLinkClick(HelpComponentState.HOME_PAGE)}>
              <img style={{ height: '100%', width: 'auto' }} src={homeImage} alt='home_icon' />
            </Button>
              <Header>Kamigotchi</Header>
              <Description>
                Kamigotchi are vibrant individuals who exist to provide you with
                emotional support and value. You can convert their health and
                well-being into $KAMI by sending them to work at Nodes.
                <br/>
                <br/>
                Your Kamigotchi are fiercely
                independent and will gradually regenerate health if left to
                their own devices, but can be fed to speed this process.
              </Description>
              <Link onClick={() => handleLinkClick(HelpComponentState.KAMI_STATS)}>
                Kami Stats
              </Link>
            </div>
          );
          break;
        case HelpComponentState.NODES:
          helpContent = (
            <div>
            <Button onClick={() => handleLinkClick(HelpComponentState.HOME_PAGE)}>
              <img style={{ height: '100%', width: 'auto' }} src={homeImage} alt='home_icon' />
            </Button>
              <Header>Nodes</Header>
              <Description>
                Nodes are sites of spiritual significance within Kamigotchi
                World. Kamigotchi, and only Kamigotchi, can generate $KAMI
                by gathering energy at Nodes. This costs Kamigotchi health,
                and can leave them vulnerable to attack from other Kamigotchi.
              </Description>
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
  font-family: Pixel;
  margin: 5px;
`;

const SubHeader = styled.p`
  font-size: 14px;
  color: #333;
  text-align: left;
  font-family: Pixel;
  margin: 5px;
`;

const Description = styled.p`
  font-size: 16px;
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
