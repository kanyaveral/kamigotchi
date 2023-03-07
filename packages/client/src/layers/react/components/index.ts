import { registerActionQueue } from './ActionQueue';
import { registerLoadingState } from './LoadingState';
import { registerMerchantWindow } from './MerchantWindow';
import { registerMiningModal } from './MiningModal';
import { registerObjectModal } from './ObjectModal';
import { registerMyKamiButton } from './MyKamiButton';
import { registerChatButton } from './ChatButton';
import { registerFoodShopButton } from './FoodShopButton';
import { registerPetList } from './PetList';
import { registerRequestQueue } from './RequestQueue';
import { registerTradeWindow } from './TradeWindow';
import { registerDetectOperatorName } from './DetectOperatorName';
import { registerMintProcess } from './MintProcess';
import { registerPetMint } from './PetMint';
import { registerPetDetails } from './PetDetails';
import { registerChat } from './Chat';
import { registerWorldMap } from './WorldMap';

export function registerUIComponents() {
  registerLoadingState();
  registerDetectOperatorName();
  registerPetList();
  registerMerchantWindow();
  registerMiningModal();
  registerRequestQueue();
  registerTradeWindow();
  registerMyKamiButton();
  registerChatButton();
  registerFoodShopButton();
  registerObjectModal();
  registerMintProcess();
  registerChat();
  registerPetMint();
  registerPetDetails();
  registerWorldMap();
  registerActionQueue();
}
