import React, { useState, useEffect } from "react";
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
  input.error {
    border: 1px solid red;
    outline: none;
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
`;

export default function LoginModal({
  isOpen,
  onRequestClose,
  formType,
  setFormType,
}) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    credential: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    username: "",
  });
  const [formTouched, setFormTouched] = useState({});
  const [formErrors, setFormErrors] = useState({});
  useEffect(() => {
    const errors = {};
    if (formType === "login") {
      if (formData.credential.length < 4) {
        errors.credential = "credential must be at least 4 characters";
      }
      if (formData.password.length < 6) {
        errors.password = "password must be at least 6 characters";
      }
    } else {
      if (
        formData.password !== formData.confirmPassword &&
        formType === "signup"
      ) {
        errors.confirmPassword = "passwords do not match";
      }
      if (formData.firstName.trim() === "") {
        errors.firstName = "First name cannot be empty";
      }
      if (formData.lastName.trim() === "") {
        errors.firstName = "Last name cannot be empty";
      }
    }

    setFormErrors(errors);
  }, [formData]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (formType === "login") {
      const data = await dispatch(
        thunkSetSession({
          credential: formData.credential,
          password: formData.password,
        })
      );
      setLoading(false);
      if (data.errors && data.errors.credential) {
        //handle error here
        if (data.errors.credential) {
          setFormErrors({ ...formErrors, credential: data.errors.credential });
        }
      } else {
        clearFormData();
        onRequestClose();
      }
    } else if (formType === "signup") {
      //signup logic here
      const data = await dispatch(thunkCreateUser({ ...formData }));
      setLoading(false);
      if (data.errors) {
        if (data.errors?.username)
          if (data.errors?.errors) {
            //handle herrors here
            if (data.errors.errors?.password) {
            }
          }
      } else {
        onRequestClose();
      }
    }
  };

  const clearFormData = () => {
    setFormData({
      credential: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      username: "",
    });
    setFormTouched({});
    setFormErrors({});
  };

  const loginDemoUser = async () => {
    setLoading(true);
    const data = await dispatch(
      thunkSetSession({ credential: "Demo-lition", password: "password" })
    );
    setLoading(false);
    if (data.errors && data.errors.credential) {
      console.log("network err");
    } else {
      onRequestClose();
    }
  };
  Modal.setAppElement("#root");

  const handleFormType = () => {
    clearFormData();
    setFormType(formType === "login" ? "signup" : "login");
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => {
        clearFormData();
        onRequestClose();
      }}
      contentLabel='Login modal'
    >
      <ModalWrapper>
        <form
          onChange={(e) => {
            formTouched[e.target.id] = true;
          }}
          onSubmit={submitHandler}
        >
          <header>
            <FontAwesomeIcon icon={faCircleXmark} onClick={onRequestClose} />
            <h2>Login or sign up</h2>
          </header>
          <div className='errors'>
            {Object.keys(formErrors).map((err) => {
              if (formErrors[err] && formTouched[err])
                return <p className='error'>{formErrors[err]}</p>;
            })}
          </div>
          {formType === "login" ? (
            <>
              <input
                id='credential'
                placeholder='username or email'
                type='text'
                value={formData.credential}
                className={`${
                  formErrors.credential && formTouched.credential && "error"
                }`}
                onChange={(e) =>
                  setFormData({ ...formData, credential: e.target.value })
                }
              />
              <input
                id='password'
                placeholder='password'
                type='password'
                value={formData.password}
                className={`${
                  formErrors.password && formTouched.password && "error"
                }`}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type='submit'
                disabled={loading || Object.keys(formErrors).length}
              >
                {!loading ? (
                  "Login"
                ) : (
                  <FontAwesomeIcon icon={faSpinner} className='spinner' />
                )}
              </button>
              <button
                id='demo-btn'
                onClick={(e) => {
                  e.preventDefault();
                  loginDemoUser();
                }}
                disabled={loading}
              >
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
            </>
          ) : (
            <>
              <input
                id='username'
                placeholder='username'
                type='text'
                value={formData.username}
                className={`${
                  formErrors.username && formTouched.username && "error"
                }`}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
              <input
                id='email'
                placeholder='email'
                type='email'
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={`${
                  formErrors.email && formTouched.email && "error"
                }`}
              />
              <input
                id='password'
                placeholder='password'
                type='password'
                value={formData.password}
                className={`${
                  formErrors.password && formTouched.password && "error"
                }`}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <input
                id='confirmPassword'
                placeholder='confirm password'
                type='password'
                value={formData.confirmPassword}
                className={`${
                  formErrors.confirmPassword &&
                  formTouched.confirmPassword &&
                  "error"
                }`}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
              />
              <input
                id='firstName'
                placeholder='first name'
                type='text'
                value={formData.firstName}
                className={`${
                  formErrors.firstName && formTouched.firstName && "error"
                }`}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
              <input
                id='lastName'
                placeholder='last name'
                type='text'
                value={formData.lastName}
                className={`${
                  formErrors.lastName && formTouched.lastName && "error"
                }`}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
              <button
                type='submit'
                disabled={loading || Object.keys(formErrors).length}
              >
                Signup
              </button>
              <div className='border'>
                <div className='item-1'></div>
                <div className='item-2'>or</div>
                <div className='item-3'></div>
              </div>
              <button onClick={handleFormType} disabled={loading}>
                Login
              </button>
            </>
          )}
        </form>
      </ModalWrapper>
    </Modal>
  );
}
