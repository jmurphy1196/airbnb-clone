import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { thunkSetSession } from "../../store/session";
import Modal from "react-modal";
import { styled } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { thunkCreateUser } from "../../store/session";

const ModalWrapper = styled.div`
  background-color: ${({ theme }) => theme.background};
  height: 100%;
  width: 100%;
  padding: 0 20px;
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

  form input {
    padding: 10px 5px;
    border-radius: 5px;
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

  .border {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
  }
  .border > div {
  }
  .border .item-1 {
    border: 1px solid ${({ theme }) => theme.toggleBorder};
    width: 100%;
  }
  .border .item-2 {
    padding: 0 4px;
  }
  .border .item-3 {
    border: 1px solid ${({ theme }) => theme.toggleBorder};
    width: 100%;
  }
  #demo-btn {
    background-color: ${({ theme }) => theme.secondary};
  }
  button[disabled] {
    pointer-events: none;
    filter: brightness(95%);
  }
  .spinner {
    animation: spin 1s ease-in-out infinite;
  }
`;

export default function LoginModal({
  isOpen,
  onRequestClose,
  formType,
  setFormType,
}) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm();

  const submitHandler = async ({
    credential,
    password,
    username,
    firstName,
    lastName,
    email,
  }) => {
    setLoading(true);
    if (formType === "login") {
      const data = await dispatch(thunkSetSession({ credential, password }));
      setLoading(false);
      if (data.errors && data.errors.credential) {
        setError("login", { type: "custom", message: data.errors.credential });
      } else {
        onRequestClose();
      }
    } else if (formType === "signup") {
      //signup logic here
      const data = await dispatch(
        thunkCreateUser({ email, username, password, firstName, lastName })
      );
      setLoading(false);
      if (data.errors) {
        if (data.errors.username)
          setError("username", {
            type: "custom",
            message: data.errors.username,
          });
        if (data.errors.errors) {
          if (data.errors.errors.password) {
            setError("password", {
              type: "custom",
              message: data.errors.errors.password,
            });
          }
        }
      } else {
        onRequestClose();
      }
    }
  };
  const loginDemoUser = async () => {
    const data = await dispatch(
      thunkSetSession({ credential: "Demo-lition", password: "password" })
    );
    if (data.errors && data.errors.credential) {
      setError("login", { type: "custom", message: data.errors.credential });
    } else {
      reset();
      onRequestClose();
    }
  };
  Modal.setAppElement("#root");

  const handleFormType = () => {
    reset();
    setFormType();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel='Login modal'
    >
      <ModalWrapper>
        {formType === "login" ? (
          <form onSubmit={handleSubmit(submitHandler)}>
            <header>
              <FontAwesomeIcon icon={faCircleXmark} onClick={onRequestClose} />
              <h2>Login or sign up</h2>
            </header>
            {errors?.login?.message && (
              <p className='error'>{errors?.login?.message}</p>
            )}
            <input
              placeholder='username or email'
              type='text'
              {...register("credential", { required: true })}
            />
            <input
              placeholder='password'
              type='password'
              {...register("password", { required: true })}
            />
            <button type='submit' disabled={loading}>
              {!loading ? (
                "Login"
              ) : (
                <FontAwesomeIcon icon={faSpinner} className='spinner' />
              )}
            </button>
            <button id='demo-btn' onClick={loginDemoUser} disabled={loading}>
              {!loading ? (
                "Demo User"
              ) : (
                <FontAwesomeIcon icon={faSpinner} className='spinner' />
              )}
            </button>
            <div className='border'>
              <div className='item-1'></div>
              <div className='item-2'>or</div>
              <div className='item-3'></div>
            </div>
            <button onClick={handleFormType}>Signup</button>
          </form>
        ) : (
          <form onSubmit={handleSubmit(submitHandler)}>
            <header>
              <FontAwesomeIcon icon={faCircleXmark} onClick={onRequestClose} />
              <h2>Login or sign up</h2>
            </header>
            {errors?.username?.message && (
              <p className='error'>{errors?.username?.message}</p>
            )}
            {errors?.password?.message && (
              <p className='error'>{errors?.password?.message}</p>
            )}
            <input
              placeholder='username'
              type='text'
              {...register("username", { required: true })}
            />
            <input
              placeholder='email'
              type='email'
              {...register("email", { required: true })}
            />
            <input
              placeholder='password'
              type='password'
              {...register("password", { required: true })}
            />
            <input
              placeholder='first name'
              type='text'
              {...register("firstName", { required: true })}
            />
            <input
              placeholder='last name'
              type='text'
              {...register("lastName", { required: true })}
            />
            <button type='submit'>Signup</button>
            <div className='border'>
              <div className='item-1'></div>
              <div className='item-2'>or</div>
              <div className='item-3'></div>
            </div>
            <button onClick={handleFormType} disabled={loading}>
              Login
            </button>
          </form>
        )}
      </ModalWrapper>
    </Modal>
  );
}
