import {css} from '@emotion/css';

export default {
  component: css`
    label: app;
    display: flex;
    width: 100%;
    height: 100vh;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    @media (max-width: 720px) {
      flex-direction: column;
    }
  `,
};
