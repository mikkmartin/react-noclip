import * as React from "react";
import { css, Global } from "@emotion/react";

export const fontStack =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";';

export const GlobalStyles = () => (
  <Global
    styles={css`
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      :root {
        font-family: ${fontStack};
        font-size: 16px;
        --fg: #000;
        --bg: #eaeaea;
      }
      [data-theme="dark"] {
        --fg: #eaeaea;
        --bg: #000;
      }
      html {
        background: var(--background);
        color: var(--foreground);
      }
    `}
  />
);
