import React from 'react';
import {cx} from '@emotion/css';

import {EPaintType, useAppSettings} from '../../Providers/AppSettings/AppSettings';

import styles from './Settings.styles';

interface ISettings {
  onApply(imageUrl: string): void;
}

function Settings({onApply}: ISettings) {
  const {setFamilies, setPaintType} = useAppSettings();
  const familiesInputRef = React.useRef<HTMLInputElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const typeSelectRef = React.useRef<HTMLSelectElement>(null);

  const handleApply = () => {
    if (!fileInputRef.current!.files || fileInputRef.current!.files.length === 0) {
      return;
    }

    const url = window.URL || window.webkitURL;
    const imageUrl = url.createObjectURL(fileInputRef.current!.files[0]);
    
    setFamilies(parseInt(familiesInputRef.current!.value, 10) || 1);
    setPaintType(typeSelectRef.current!.value as EPaintType);

    onApply(imageUrl);
  };

  return (
    <div className={cx(styles.component)}>
      <h1>Settings</h1>
      <h3>Image file in A4 aspect ratio</h3>
      <input ref={fileInputRef} type="file" className={cx(styles.input)} />
      <h3>Number of drawn families of lines</h3>
      <input ref={familiesInputRef} type="number" className={cx(styles.input)} />
      <h3>Paint mode</h3>
      <select ref={typeSelectRef} className={cx(styles.input)}>
        {Object.values(EPaintType).map((type: EPaintType) => (
          <option value={type} key={type}>
            {type}
          </option>
        ))}
      </select>
      <button onClick={handleApply}>Apply</button>
    </div>
  );
}

export default Settings;
