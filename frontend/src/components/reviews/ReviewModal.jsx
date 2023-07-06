import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Modal from "react-modal";
import { styled } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faSpinner,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

import { faStar as faEmptyStar } from "@fortawesome/free-regular-svg-icons";
import { thunkCreateReview } from "../../store/reviews";

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
    filter: brightness(95%);
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
  }
`;

export default function ReviewModal({ isOpen, onRequestClose, spotId }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [activeRating, setActiveRating] = useState(1);
  const [rating, setRating] = useState(1);
  const [review, setReview] = useState("");

  const handleSubmit = async () => {
    const res = await thunkCreateReview(spotId, { review, stars: rating });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => {
        onRequestClose();
      }}
      contentLabel='Login modal'
    >
      <ModalWrapper>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <header>
            <FontAwesomeIcon icon={faCircleXmark} onClick={onRequestClose} />
            <h2>How was your stay?</h2>
          </header>
          <div className='errors'></div>
          <textarea
            name='review'
            id=''
            cols='30'
            rows='10'
            placeholder='Enter a review...'
            onChange={(e) => setReview(e.target.value)}
          ></textarea>
          <div
            className='stars-container'
            onMouseLeave={() => setActiveRating(rating)}
          >
            {[1, 2, 3, 4, 5].map((val) => {
              if (activeRating >= val) {
                return (
                  <FontAwesomeIcon
                    icon={faStar}
                    onMouseEnter={() => setActiveRating(val)}
                    onClick={() => setRating(val)}
                    color='gold'
                  />
                );
              }
              return (
                <FontAwesomeIcon
                  icon={faEmptyStar}
                  onMouseEnter={() => setActiveRating(val)}
                  onClick={() => setRating(val)}
                />
              );
            })}
          </div>
          <button>Submit your review</button>
        </form>
      </ModalWrapper>
    </Modal>
  );
}
