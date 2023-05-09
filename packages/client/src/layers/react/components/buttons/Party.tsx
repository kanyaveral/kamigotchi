import React from 'react';
import { of } from 'rxjs';
import kamiImage from '../../../../assets/images/kami_native.png';

import { MenuButton } from 'layers/react/components/library/MenuButton';
import { registerUIComponent } from 'layers/react/engine/store';

export function registerPartyButton() {
  registerUIComponent(
    'PartyButton',
    {
      colStart: 92,
      colEnd: 95,
      rowStart: 2,
      rowEnd: 10,
    },
    (layers) => of(layers),
    () => {
      return (
        <MenuButton
          id='party_button'
          targetDiv='party'
          text="Party"
        >
          <img style={{ height: '100%', width: 'auto' }} src={kamiImage} alt='kami_icon' />
        </MenuButton>
      );
    }
  );
}
