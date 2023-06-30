import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { thunkSetSession, thunkGetSession } from "./store/session";
import { Switch, Route } from "react-router-dom";
import "./App.css";
import LoginFormPage from "./components/session/LoginFormPage";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      const data = await dispatch(thunkGetSession());
    })();
  }, [dispatch]);
  return (
    <>
      <h1>hello world</h1>
      <Switch>
        <Route exact path='/login'>
          <LoginFormPage />
        </Route>
      </Switch>
    </>
  );
}

export default App;
