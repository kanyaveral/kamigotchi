import styled from 'styled-components';

import { getHarvestItem } from 'app/cache/harvest';
import {
  calcHealth,
  calcOutput,
  isDead,
  isHarvesting,
  isOffWorld,
  isResting,
  isUnrevealed,
} from 'app/cache/kami';
import { KamiCard } from 'app/components/library';
import { OnyxButton } from 'app/components/library/buttons/actions/OnyxButton';
import { useSelected, useVisibility } from 'app/stores';
import { FeedIcon, ReviveIcon } from 'assets/images/icons/actions';
import { Account } from 'network/shapes/Account';
import { Kami } from 'network/shapes/Kami';
import { Node, NullNode } from 'network/shapes/Node';
import { getRateDisplay } from 'utils/numbers';
import { playClick } from 'utils/sounds';

const ONYX_REVIVE_PRICE = 3;
interface Props {
  actions: {
    onyxApprove: (price: number) => void;
    onyxRevive: (kami: Kami) => void;
  };
  data: {
    account: Account;
    kamis: Kami[];
    node: Node;
    onyx: {
      allowance: number;
      balance: number;
    };
  };
  display: {
    HarvestButton: (account: Account, kami: Kami, node: Node) => JSX.Element;
    UseItemButton: (kami: Kami, account: Account, icon: string) => JSX.Element;
  };
  state: {
    displayedKamis: Kami[];
  };
  utils: { calcExpRequirement: (lvl: number) => number };
  isVisible: boolean;
}

export const Kards = (props: Props) => {
  const { actions, data, display, state, isVisible, utils } = props;
  const { onyxApprove, onyxRevive } = actions;
  const { account, node, onyx } = data;
  const { displayedKamis } = state;
  const { calcExpRequirement } = utils;
  const { HarvestButton, UseItemButton } = display;
  const { modals, setModals } = useVisibility();
  const { nodeIndex, setNode: setSelectedNode } = useSelected(); // node selected by user

  /////////////////
  // INTERPRETATION

  // get the description of the kami as a list of lines
  // TODO: clean this up. might be overeager on harvest rate calcs
  const getDescription = (kami: Kami): string[] => {
    const healthRate = getRateDisplay(kami.stats!.health.rate, 2);

    let description: string[] = [];
    if (isOffWorld(kami)) description = ['kidnapped by slave traders'];
    else if (isUnrevealed(kami)) description = ['Unrevealed!'];
    else if (isResting(kami)) description = ['Resting', `${healthRate} HP/hr`];
    else if (isDead(kami)) description = [`Murdered`];
    else if (isHarvesting(kami) && kami.harvest) {
      const harvest = kami.harvest;
      const harvestRate = getRateDisplay(harvest.rates.total.spot, 2);
      const item = getHarvestItem(harvest);
      const node = harvest.node ?? NullNode;

      if (calcHealth(kami) == 0) {
        description = [`Starving.. `, `on ${node.name}`];
      } else {
        description = [
          `Harvesting`,
          `on ${node.name}`,
          `${harvestRate} ${item.name}/hr`,
          `${healthRate} HP/hr`,
        ];
      }
    }
    return description;
  };

  // get the balance subtext for a kami
  // TODO: update this with iconography
  const getSubtext = (kami: Kami): string => {
    const harvest = kami.harvest;
    if (!harvest || harvest.state != 'ACTIVE') return '';
    const item = getHarvestItem(harvest);
    return `${calcOutput(kami)} ${item.name}`;
  };

  // get the description tooltip on the kami card
  // NOTE: unused atm, rerendering frequency causes issues with orphaned tooltips
  const getTooltip = (kami: Kami): string[] => {
    const tooltip: string[] = [];
    if (isHarvesting(kami) && kami.harvest) {
      const harvest = kami.harvest;
      const avgRate = getRateDisplay(harvest.rates.total.average, 2);
      const item = getHarvestItem(harvest);
      const now = Math.floor(Date.now() / 1000);
      const lastDuration = (now - harvest.time.last) / 3600;
      tooltip.push(`Average: ${avgRate} ${item.name}/hr`);
      tooltip.push(`> over the last ${lastDuration.toFixed(2)}hours`);
    }
    return tooltip;
  };

  /////////////////
  // INTERACTION

  // toggle the node modal to the selected one
  const selectNode = (index: number) => {
    if (nodeIndex !== index) setSelectedNode(index);
    if (!modals.node) setModals({ node: true });
    else if (nodeIndex == index) setModals({ node: false });
    playClick();
  };

  // returns the onClick function for the description
  const getDescriptionOnClick = (kami: Kami) => {
    if (isHarvesting(kami)) return () => selectNode(kami.harvest?.node?.index!);
  };

  const getOnyxTooltip = (kami: Kami) => {
    let tooltip: string[] = [`the Fortunate may resurrect`, 'their kami in other ways..', `\n`];

    if (onyx.balance < ONYX_REVIVE_PRICE) {
      tooltip = tooltip.concat([
        `you only have ${onyx.balance} $ONYX`,
        `you need ${ONYX_REVIVE_PRICE} $ONYX`,
      ]);
    } else if (onyx.allowance < ONYX_REVIVE_PRICE) {
      tooltip = tooltip.concat([`approve spend of ${ONYX_REVIVE_PRICE} $ONYX`]);
    } else {
      tooltip = tooltip.concat([`save ${kami.name} with ${ONYX_REVIVE_PRICE} onyx`]);
    }
    return tooltip;
  };

  /////////////////
  // DISPLAY

  // Choose and return the action button to display
  const DisplayedActions = (account: Account, kami: Kami, node: Node) => {
    let buttons = [];
    let useIcon = isDead(kami) ? ReviveIcon : FeedIcon;

    buttons.push(UseItemButton(kami, account, useIcon));
    if (!isDead(kami)) buttons.push(HarvestButton(account, kami, node));
    else {
      buttons.push(
        <OnyxButton
          key='onyx-revive'
          kami={kami}
          onyx={{ ...onyx, price: ONYX_REVIVE_PRICE }}
          actions={{ onyxApprove, onyxUse: onyxRevive }}
          tooltip={getOnyxTooltip(kami)}
        />
      );
    }
    return buttons;
  };

  return (
    <Container isVisible={isVisible}>
      {displayedKamis.map((kami) => (
        <KamiCard
          key={kami.entity}
          kami={kami}
          description={getDescription(kami)}
          descriptionOnClick={getDescriptionOnClick(kami)}
          subtext={getSubtext(kami)}
          // contentTooltip={getTooltip(kami)}
          actions={DisplayedActions(account, kami, node)}
          showBattery
          showCooldown
          utils={{ calcExpRequirement }}
        />
      ))}
    </Container>
  );
};

const Container = styled.div<{ isVisible: boolean }>`
  display: ${({ isVisible }) => (isVisible ? 'flex' : 'none')};
  flex-flow: column nowrap;
  gap: 0.45vw;
  padding: 0.6vw;
`;
