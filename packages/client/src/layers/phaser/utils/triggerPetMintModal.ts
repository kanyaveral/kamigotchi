import { dataStore } from 'layers/react/store/createStore';

export const triggerPetMintModal = () => {
  const { visibleModals } = dataStore.getState();
  if (!visibleModals.kamiMintPost)
    dataStore.setState({
      visibleModals: { ...visibleModals, kamiMint: true },
    });
};
