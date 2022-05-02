import React from 'react';
import {cx} from '@emotion/css';

import styles from './Settings.styles';

interface ISettings {
  onApply: (imageUrl: string) => void;
}

function Settings({onApply}: ISettings) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleApply = () => {
    const imageUrl = inputRef.current!.value;
    onApply(imageUrl);
  }

  return (
    <div className={cx(styles.component)}>
      <h1>Settings</h1>
      <input ref={inputRef} type="number" className={cx(styles.input)} />
      <button onClick={handleApply}>Apply</button>
    </div>
  );
} 

export default Settings;
