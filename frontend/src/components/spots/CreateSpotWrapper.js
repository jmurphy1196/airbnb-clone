import { styled } from "styled-components";

export const CreateSpotWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 30px;
  justify-content: center;
  align-items: center;
  form {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    gap: 10px;
    flex-direction: column;
    max-width: 800px;
  }
  form input {
    border-radius: 5px;
    padding: 4px;
    width: 100%;
  }
  form select {
    width: fit-content;
  }

  .form-group {
    display: flex;
    gap: 10px;
    justify-content: center;
    width: 100%;
  }
  .sub-group {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 5px;
  }
  .city {
    width: 80%;
  }
  .state {
    width: 20%;
  }
  .country {
    width: 20%;
  }
  .address {
    width: 80%;
  }
  width: 100%;
  h2,
  p {
    margin: 0;
  }
  textarea {
    border-radius: 5px;
    width: 100%;
  }
  .image-container {
    min-height: 300px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  .upload-btn {
    border: 3px solid ${({ theme }) => theme.secondary};
    height: 300px;
    width: 250px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    flex-direction: column;
    cursor: pointer;
    border-style: dashed;
  }
  .upload-btn:hover {
    background-color: ${({ theme }) => theme.secondary};
  }
  .upload-btn:hover p {
    color: white;
  }
  .upload-btn:hover svg {
    color: white;
  }
  .file-input {
    display: none;
  }
  .image-preview {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 300px;
    width: 250px;
    align-self: center;
    position: relative;
  }
  .image-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .image-preview svg {
    position: absolute;
    left: 100%;
    bottom: 100%;
    transform: translate(-120%, 150%);
  }
  button {
    background-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.background};
    padding: 15px 10px;
    align-self: center;
    width: 100%;
    margin-top: 5px;
    font-size: 1.3rem;
  }
  p.error {
    color: red;
  }
`;
