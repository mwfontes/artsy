import {css} from '@emotion/css';

export default {
  component: css`
    label: settings;
    display: flex;
    flex-direction: column;
    margin-right: 40px;
  `,
  input: css`
    label: settings__input;
    margin-bottom: 20px;
  `,
  resolutionSelection: css`
    label: settings_resolutionSelection;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    & > div {
      display: flex;
      flex-direction: column;
      align-items: center;
      & > input {
        display: none;
      }
      & > label {
        padding: 10px;
        border: 1px solid black;
        cursor: pointer;
      }
      & > input:checked + label {
        background-color: black;
        color: white;
      }
    }
  `,
  applyButton: css`
    label: settings_applyButton;
    background-color: white;
    &:active {
      background-color: black;
      color: white;
    }
  `,
};
