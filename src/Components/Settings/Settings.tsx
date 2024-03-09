import React from 'react';
import {cx} from '@emotion/css';

import {EPaintType, useAppSettings, EResolution} from '../../Providers/AppSettings/AppSettings';

import styles from './Settings.styles';

interface ISettings {
  onApply(imageUrl: string): void;
}

function Settings({onApply}: ISettings) {
  const {setResolution, setPaintType, resolution} = useAppSettings();
  const familiesInputRef = React.useRef<HTMLInputElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const typeSelectRef = React.useRef<HTMLSelectElement>(null);
  const renderSizeSelectRef = React.useRef<HTMLSelectElement>(null);

  const handleApply = () => {
    if (!fileInputRef.current!.files || fileInputRef.current!.files.length === 0) {
      alert('Please select a file');
      return;
    }

    const url = window.URL || window.webkitURL;
    const imageUrl = url.createObjectURL(fileInputRef.current!.files[0]);

    const resolutionRadioEls = familiesInputRef.current!.querySelectorAll('input');

    if (resolutionRadioEls.length) {
      setResolution([...resolutionRadioEls].find((radio) => radio.checked)!.value as EResolution);
    }
    setPaintType(typeSelectRef.current!.value as EPaintType);

    onApply(imageUrl);
  };

  return (
    <div className={cx(styles.component)}>
      <h1>Settings</h1>
      <h3>Image file in A4 aspect ratio</h3>
      <input ref={fileInputRef} type="file" className={cx(styles.input)} />
      <section>
        <h3>Artwork resolution</h3>
        <div className={cx(styles.resolutionSelection)} ref={familiesInputRef}>
          {Object.values(EResolution).map((res, i) => (
            <div key={res}>
              <input
                type="radio"
                name="resolution"
                id={`resolution-${res.replaceAll(' ', '-').toLowerCase()}`}
                value={res}
              />
              <label htmlFor={`resolution-${res.replaceAll(' ', '-').toLowerCase()}`}>{res}</label>
            </div>
          ))}
        </div>
      </section>
      <h3>Paint mode</h3>
      <select ref={typeSelectRef} className={cx(styles.input)}>
        {Object.values(EPaintType).map((type: EPaintType) => (
          <option value={type} key={type}>
            {type}
          </option>
        ))}
      </select>
      <button onClick={handleApply} className={cx(styles.applyButton)}>
        Apply
      </button>
    </div>
  );
}

export default Settings;
