import { ClockFixture } from './fixtures/clock';
import { LeftMenuFixture, RightMenuFixture } from './fixtures/menu';
import { NotificationFixture } from './fixtures/notifications';
import { ActionQueue } from './fixtures/queue';

import { AccountModal } from './modals/account';
import { ChatModal } from './modals/chat';
import { CraftingModal } from './modals/crafting';
import { DialogueModal } from './modals/dialogue';
import { GachaModal } from './modals/gacha';
import { GoalModal } from './modals/goals';
import { HelpModal } from './modals/help';
import { InventoryModal } from './modals/inventory';
import { KamiDetails } from './modals/kami';
import { KamiBridge } from './modals/kamiBridge';
import { LeaderboardModal } from './modals/leaderboard';
import { MapModal } from './modals/map';
import { MerchantWindow } from './modals/merchant';
import { EmaBoard } from './modals/naming';
import { NodeModal } from './modals/node';
import { PartyModal } from './modals/party';
import { Presale } from './modals/presale';
import { Reveal } from './modals/reveal/Reveal';
import { Settings } from './modals/settings';
import { TradingModal } from './modals/trading';
// unused
import { FundOperator } from './modals/FundOperator';

import { Quests } from './modals/quests';
import { AccountRegistrar, GasHarasser, OperatorUpdater, WalletConnecter } from './validators';
import { TokenChecker } from './validators/TokenChecker';
import type { UIComponent } from 'app/root/types';

import { Scene } from './canvas';
import { LoadingState } from './boot';

export const allComponents = [
  // boot
  LoadingState,

  // validators
  WalletConnecter,
  AccountRegistrar,
  OperatorUpdater,
  GasHarasser,
  TokenChecker,

  // fixtures
  ClockFixture,
  LeftMenuFixture,
  RightMenuFixture,
  NotificationFixture,
  ActionQueue,

  // canvas
  Scene,

  // menu modals
  AccountModal,
  ChatModal,
  CraftingModal,
  HelpModal,
  InventoryModal,
  MapModal,
  NodeModal,
  PartyModal,
  Quests,
  Settings,
  TradingModal,
  Presale,

  // scene modals
  DialogueModal,
  KamiBridge,
  EmaBoard,
  FundOperator,
  GachaModal,
  KamiDetails,
  LeaderboardModal,
  Reveal,
  MerchantWindow,
  GoalModal,
] as const satisfies UIComponent[];
