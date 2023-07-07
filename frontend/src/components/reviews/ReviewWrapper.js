import { styled } from "styled-components";

export const ReviewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 2px solid ${({ theme }) => theme.toggleBorder};
  padding-bottom: 20px;
  header {
    display: flex;
    gap: 10px;
  }
  header > span {
    text-transform: capitalize;
  }
  .content {
    display: flex;
    flex-direction: column;
  }
  .content .date {
    color: ${({ theme }) => theme.light};
  }
  .content button {
    margin-top: 10px;
    max-width: 100px;
    padding: 10px 10px;
    background-color: ${({ theme }) => theme.light};
    color: white;
  }
  .buttons {
    display: flex;
    gap: 20px;
  }
  button {
    width: 100px;
  }
`;
