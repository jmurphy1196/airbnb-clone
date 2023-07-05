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
`;
