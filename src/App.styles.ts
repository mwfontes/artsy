import {css} from '@emotion/css';

export default {
  component: (isHorizontalLayout = true): string => css`
    label: app;
    display: flex;
    width: 100%;
    height: 100vh;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    ${isHorizontalLayout &&
    css`
      flex-direction: row;
    `}
  `,
};
