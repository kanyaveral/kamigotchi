/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { registerUIComponent } from 'layers/react/engine/store';
import React, { useState } from 'react';
import { of } from 'rxjs';
import mutedSoundImage from '../../../../assets/images/sound_muted_native.png';
import soundImage from '../../../../assets/images/sound_native.png';
import { dataStore } from 'layers/react/store/createStore';

export function registerVolumeControl() {
  registerUIComponent(
    'VolumeControl',
    {
      colStart: 75,
      colEnd: 85,
      rowStart: 2,
      rowEnd: 10,
    },
    (layers) => of(layers),
    () => {
      const [volumeSliderVisibility, setvolumeSliderVisibility] = useState(false);

      const {
        sound: { volume },
        setSoundState,
      } = dataStore();
      const muted = volume == 0;

      const setVolumeRate = (e: any) => {
        const soundVolume = e.target.value as number;

        setSoundState({ volume: soundVolume });
      };

      const toggleSound = () => {
        muted ? setSoundState({ volume: 0.5 }) : setSoundState({ volume: 0 });
      };

      const handleVolumeSliderVisibility = (isVisible: boolean) => {
        setvolumeSliderVisibility(isVisible);
      };

      return (
        <div
          style={{ pointerEvents: 'auto', alignItems: 'center' }}
          onPointerOut={() => {
            handleVolumeSliderVisibility(false);
          }}
          onPointerOver={() => {
            handleVolumeSliderVisibility(true);
          }}
        >
          <style>
            {`
          input[type=range]::-webkit-slider-thumb {
            width: 15px;
            height: 15px;
            background: black;
            border-radius: 50%;
            cursor: pointer;
          }
          input[type=range]::-moz-range-thumb {
            width: 15px;
            height: 15px;
            background: black;
            border-radius: 50%;
            cursor: pointer;
          }
        `}
          </style>
          <div style={{ display: 'flex', height: '100%', pointerEvents: 'auto' }}>
            <div
              style={{
                width: '50%',
                height: '100%',
                paddingLeft: '10%',
                paddingTop: '13%',
                alignSelf: 'flex-start',
                justifySelf: 'center',
                pointerEvents: 'auto',
              }}
            >
              <input
                type='range'
                min='0'
                max='1'
                step='0.1'
                value={volume}
                onChange={setVolumeRate}
                style={{ ...rangeInputStyle, display: volumeSliderVisibility ? 'block' : 'none' }}
              />
            </div>
            <div
              className='window'
              onClick={toggleSound}
              style={{ pointerEvents: 'auto', position: 'relative', width: '50%' }}
            >
              <img
                style={{
                  height: '100%',
                  width: 'auto',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  display: 'block',
                }}
                src={!muted ? soundImage : mutedSoundImage}
                alt='sound_icon'
              />
            </div>
          </div>
        </div>
      );
    }
  );
}

const rangeInputStyle = {
  width: '65px',
  height: '25px',
  borderRadius: '10px',
  background: '#d3d3d3',
  outline: 'none',
  opacity: 0.7,
  transition: 'opacity 0.2s',
  transform: 'rotate(270deg)',
};
