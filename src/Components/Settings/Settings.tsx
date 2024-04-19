import React from 'react';
import {cx} from '@emotion/css';

import {useAppSettings, EResolution} from '../../Providers/AppSettings/AppSettings';

import styles from './Settings.styles';

interface ISettings {
  onApply(imageUrl: string): void;
}

function Settings({onApply}: ISettings) {
  const {setResolution} = useAppSettings();
  const familiesInputRef = React.useRef<HTMLInputElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const typeSelectRef = React.useRef<HTMLSelectElement>(null);

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

    onApply(imageUrl);
  };

  const handleDownload = () => {
    const svg = document.getElementById('canvas')?.querySelector('svg') as SVGSVGElement | null;
    if (!svg) {
      console.error('No SVG found with id canvas');
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], {type: 'image/svg+xml'});
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'artwork.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={cx(styles.component)}>
      <h1>Settings</h1>
      <h3>Image file</h3>
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
      <button onClick={handleApply} className={cx(styles.actionButtons)}>
        Apply
      </button>
      <button onClick={handleDownload} className={cx(styles.actionButtons)}>
        Download generated artwork
      </button>
    </div>
  );
}

export default Settings;
