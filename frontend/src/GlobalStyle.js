import { createGlobalStyle } from "styled-components";
import { device } from "./theme";

export const Globalstyle = createGlobalStyle`

* {
  box-sizing: border-box;

}
  body {
    margin: 0;
    padding: 0 20px;
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-family: Airbnb, "Inter";
    overflow-x: hidden;
    position: relative;
    padding-bottom: 30px;

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
  svg:hover {
    cursor: pointer;
  }
  textarea {
    font-family: Airbnb, "Inter";
  }

  /* modal style */
  .ReactModal__Content{
    top: 50%;
    left: 50%;
    width: 550px; 
    height: fit-content;
    margin: auto auto;
    padding: 0 !important;
    display: flex;
    border-radius: 16px !important;
  @media ${device.mobile}  {
    width: 300px; 
  }
  @media ${device.tablet}  {
    width: 400px; 
  }
  @media ${device.laptop}  {
    width: 500px; 
  }
  @media ${device.desktop}  {
    width: 550px; 
  }
  }
  .spinner {
    animation: spin 1s ease-in-out infinite;
  }
  @keyframes spin {
    from {transform:rotate(0deg);}
    to {transform:rotate(360deg);}
}
textarea {
  resize: none
}


`;
