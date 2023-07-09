import { styled } from "styled-components";
import { device } from "../../theme";

export const SpotsWrapper = styled.div`
  display: grid;
  height: 100%;
  grid-template-columns: repeat(6, minmax(180px, 1fr));
  grid-auto-rows: minmax(250px, auto);
  padding: 0 100px;
  margin-top: 25px;
  gap: 20px;
  max-width: 100%;
  @media ${device.mobile} {
    grid-template-columns: repeat(1, minmax(180px, 1fr));
    padding: 0 25px;
  }
  @media ${device.tablet} {
    grid-template-columns: repeat(2, minmax(180px, 1fr));
    padding: 0 50px;
  }
  @media ${device.laptop} {
    grid-template-columns: repeat(3, minmax(180px, 1fr));
    padding: 0 50px;
  }
  @media ${device.xlLaptop} {
    grid-template-columns: repeat(4, minmax(180px, 1fr));
    padding: 0 50px;
  }
  @media ${device.desktop} {
    grid-template-columns: repeat(6, minmax(180px, 1fr));
  }
`;
