import { createGlobalStyle } from "styled-components";
import { device } from "./theme";

export const Globalstyle = createGlobalStyle`
  @font-face {
    font-family: 'Airbnb';
    font-weight: bold;
    src: local('Airbnb'),
    url(@/fonts/AirbnbCereal_W_Bd.otf) format('opentype'),
  }

* {
  box-sizing: border-box;

}
  body {
    margin: 0;
    padding: 0 20px;
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-family: Airbnb, "Inter";
    overflow: hidden;
    position: relative;

  }
  button{
    outline: none;
    border: none;
    padding: 0;
    margin: 0;
  }
  button:hover {
    cursor: pointer;
  }
  /* controls font size for icons */
  svg {
    font-size: 25px;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  a {
    text-decoration: none;
    color: inherit;
  }


`;
