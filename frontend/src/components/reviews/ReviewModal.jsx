import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  }
`;

export default function ReviewModal({ isOpen, onRequestClose, spotId }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [activeRating, setActiveRating] = useState(0);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await dispatch(
        thunkCreateReview(spotId, user, { review, stars: rating })
      );
      if (res.title) {
        //there was an error
        setValidationErrors({ ...validationErrors, review: res.title });
      } else {
        onRequestClose();
      }
    } catch (err) {
      console.log(err);
    }
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
      contentLabel='Login modal'
    >
      <ModalWrapper>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <header>
            <FontAwesomeIcon icon={faCircleXmark} onClick={onRequestClose} />
            <h2>How was your stay?</h2>
          </header>
          <div className='errors'>
            {validationErrors?.review && (
              <p className='error'>{validationErrors.review}</p>
            )}
          </div>
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
          <button type='submit' disabled={rating < 1 || review.length < 10}>
            Submit your review
          </button>
        </form>
      </ModalWrapper>
    </Modal>
  );
}
