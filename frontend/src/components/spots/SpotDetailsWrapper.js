import { styled } from "styled-components";
import { device, size } from "../../theme";

export const SpotDetailsWrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  padding: 0 30px;
  gap: 20px;
  .spot-images {
    display: grid;
    grid-template-columns: repeat(4, minmax(180px, 1fr));
    grid-template-rows: repeat(2, minmax(250px, 400px));
    gap: 10px;
    @media ${device.mobile} {
      grid-template-columns: repeat(1, minmax(180px, 1fr));
      grid-template-rows: repeat(auto, minmax(250px, 400px));
    }
    @media ${device.tablet} {
      grid-template-columns: repeat(2, minmax(180px, 1fr));
    }
    @media ${device.laptop} {
      grid-template-columns: repeat(4, minmax(180px, 1fr));
    }
    @media ${device.desktop} {
      grid-template-columns: repeat(4, minmax(180px, 1fr));
    }
  }
  img {
    border-radius: 16px;
    border: 1px solid ${({ theme }) => theme.toggleBorder};
  }
  .main-image {
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 1;
    grid-row-end: 3;
    @media ${device.mobile} {
      grid-row-start: 1;
      grid-row-end: 2;
    }
    @media ${device.tablet} {
      grid-column-start: 1;
      grid-column-end: 3;
      grid-row-start: 1;
      grid-row-end: 2;
    }
    @media ${device.laptop} {
      grid-column-start: 1;
      grid-column-end: 3;
      grid-row-start: 1;
      grid-row-end: 3;
    }
    @media ${device.desktop} {
      grid-column-start: 1;
      grid-column-end: 3;
      grid-row-start: 1;
      grid-row-end: 3;
    }
  }
  .sub-image {
    @media only screen and (max-width: ${size.mobile}) {
      grid-column: 1;
    }
  }
  .image {
  }
  .image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .desc {
    display: flex;
    @media only screen and (max-width: ${size.laptop}) {
      flex-wrap: wrap;
    }
  }
  .desc p {
    width: 65%;
    @media only screen and (max-width: ${size.laptop}) {
      width: 100%;
    }
  }
  .spot-pricing-container {
    display: flex;
    justify-content: flex-end;
    width: 35%;
    @media only screen and (max-width: ${size.laptop}) {
      width: 100%;
      justify-content: center;
    }
  }
  .spot-pricing {
    border: 2px solid black;
    width: 50%;
    padding: 30px 15px;
    display: flex;
    align-items: center;
    border-radius: 10px;
    flex-direction: column;
    justify-content: space-around;
    gap: 20px;
    @media only screen and (max-width: ${size.laptop}) {
      width: 100%;
    }
    @media only screen and (max-width: ${size.desktop}) {
      width: 80%;
    }
  }
  .spot-pricing header {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
  }
  .spot-pricing button {
    width: 100%;
    background-color: ${({ theme }) => theme.primary};
    padding: 10px;
    color: ${({ theme }) => theme.background};
    border-radius: 5px;
    font-weight: bold;
    font-size: 1.2rem;
  }
  #review-btn {
    max-width: 250px;
    padding: 15px 5px;
    background-color: ${({ theme }) => theme.secondary};
    color: ${({ theme }) => theme.background};
    font-size: 1.3rem;
    border-radius: 2px;
  }
`;
