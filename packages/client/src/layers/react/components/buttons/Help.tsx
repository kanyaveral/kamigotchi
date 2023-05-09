import React from 'react';
import { of } from 'rxjs';
import helpImage from '../../../../assets/images/help_native.png';

import { MenuButton } from 'layers/react/components/library/MenuButton';
import { registerUIComponent } from 'layers/react/engine/store';

export function registerHelpButton() {
  registerUIComponent(
    'HelpButton',
    {
      colStart: 98,
      colEnd: 101,
      rowStart: 2,
      rowEnd: 10,
    },
    (layers) => of(layers),
    () => {
      return (
        <MenuButton id="settings_button" targetDiv="help" text="Help">
          <img style={{height: '100%', width: 'auto' }}
            src={helpImage}
            alt='help_icon'
          />
        </MenuButton>
      );
    }
  );
}
