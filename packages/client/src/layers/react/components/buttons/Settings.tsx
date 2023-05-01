import React from 'react';
import { of } from 'rxjs';
import settingsImage from '../../../../assets/images/settings_native.png';

import { MenuButton } from 'layers/react/components/library/MenuButton';
import { registerUIComponent } from 'layers/react/engine/store';

export function registerSettingsButton() {
  registerUIComponent(
    'SettingsButton',
    {
      colStart: 98,
      colEnd: 100,
      rowStart: 2,
      rowEnd: 10,
    },
    (layers) => of(layers),
    () => {
      return (
        <MenuButton id="settings_button" targetDiv="settings">
          <img style={{height: '100%', width: 'auto' }}
            src={settingsImage}
            alt='settings_icon'
          />
        </MenuButton>
      );
    }
  );
}
