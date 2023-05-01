import React from 'react';
import { of } from 'rxjs';
import chatImage from '../../../../assets/images/chat_native.png';

import { MenuButton } from 'layers/react/components/library/MenuButton';
import { registerUIComponent } from 'layers/react/engine/store';

export function registerChatButton() {
  registerUIComponent(
    'ChatButton',
    {
      colStart: 89,
      colEnd: 99,
      rowStart: 2,
      rowEnd: 10,
    },
    (layers) => of(layers),
    () => {
      return (
        <MenuButton id="chat_button" targetDiv="chat">
          <img style={{height: '100%', width: 'auto' }}
            src={chatImage}
            alt='chat_icon'
          />
        </MenuButton>
      );
    }
  );
}
