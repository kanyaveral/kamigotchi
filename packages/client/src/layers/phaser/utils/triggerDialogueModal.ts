import { dataStore } from 'layers/react/store/createStore';
import dialogueSound from 'assets/sound/fx/speech3.mp3';

export const triggerDialogueModal = () => {

  const {
    visibleModals,
    sound: { volume },
  } = dataStore.getState();

  const clickFX = new Audio(dialogueSound);

  clickFX.volume = volume;
  clickFX.play();

  dataStore.setState({ dialogue: { description: "hi" } });
  dataStore.setState({
    visibleModals: { ...visibleModals, dialogue: true },
  });
}
