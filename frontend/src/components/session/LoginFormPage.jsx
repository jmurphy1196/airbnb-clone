import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { thunkSetSession } from "../../store/session";
import { useHistory } from "react-router-dom";

export default function LoginFormPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm();

  const submitHandler = async ({ credential, password }) => {
    const data = await dispatch(thunkSetSession({ credential, password }));
    if (data.errors) {
      setError("login", { type: "custom", message: data.errors.credential });
    } else {
      history.push("/");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(submitHandler)}>
        <p className='error'>{errors?.login?.message}</p>
        <input type='text' {...register("credential", { required: true })} />
        <input type='password' {...register("password", { required: true })} />
        <button type='submit'>Login</button>
      </form>
    </>
  );
}
