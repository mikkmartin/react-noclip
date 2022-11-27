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
      }
      * {
        border: 1px solid red;
        background: rgba(255, 0, 0, 0.05);
      }
    `}
  />
);
