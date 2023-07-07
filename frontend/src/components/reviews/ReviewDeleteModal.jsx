import { useState } from "react";
import Modal from "react-modal";
import { styled } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faSpinner,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { thunkRemoveReview } from "../../store/reviews";
import { useDispatch } from "react-redux";
const ModalWrapper = styled.div`
  background-color: ${({ theme }) => theme.background};
  height: 100%;
  width: 100%;
  padding: 0px 20px;
  padding-bottom: 30px;
  form {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 10px;
  }
  form header {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: center;
    position: relative;
    padding: 20px 0px;
    border-bottom: 2px solid ${({ theme }) => theme.toggleBorder};
  }
  form header h2 {
    flex: 0 1 auto;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  form header svg {
    flex: 0 1 auto;
    margin-right: auto;
  }

  form button {
    background-color: ${({ theme }) => theme.primary};
    padding: 10px;
    color: ${({ theme }) => theme.background};
    border-radius: 5px;
    font-weight: bold;
    font-size: 1.2rem;
  }
  p.error {
    color: red;
  }
  input.error {
    border: 1px solid red;
    outline: none;
  }

  button[disabled] {
    pointer-events: none;
    filter: brightness(75%);
  }
  .stars-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
    margin-top: 10px;
  }
  button {
    margin-top: 20px;
    width: 50%;
  }
  button.cancel {
    background-color: ${({ theme }) => theme.secondary};
    color: white;
  }
  .buttons {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    gap: 20px;
  }
`;

export default function DeleteReviewModal({
  isOpen,
  onRequestClose,
  reviewId,
}) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const res = await dispatch(thunkRemoveReview(reviewId));
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => {
        setLoading(false);
        setValidationErrors({});
        setRating(0);
        setActiveRating(0);
        setReview("");
        onRequestClose();
      }}
      contentLabel='Delete review modal'
    >
      <ModalWrapper>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleDelete();
          }}
        >
          <header>
            <FontAwesomeIcon icon={faCircleXmark} onClick={onRequestClose} />
            <h2>Delete this review?</h2>
          </header>
          <div className='errors'></div>
          <div className='buttons'>
            <button type='submit'>Delete</button>
            <button className='cancel' onClick={onRequestClose}>
              No
            </button>
          </div>
        </form>
      </ModalWrapper>
    </Modal>
  );
}
