import { styled } from "styled-components";

export const CreateSpotWrapper = styled.div`
  display: grid;

  grid-template-columns: repeat(6, minmax(180px, 1fr));
  grid-auto-rows: minmax(250px, auto);
`;
