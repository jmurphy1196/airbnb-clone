import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkSetSession, thunkGetSession } from "./store/session";
import { Switch, Route } from "react-router-dom";
import "./App.css";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import LoginFormPage from "./components/session/LoginFormPage";
import Protected from "./Protected";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  useEffect(() => {
    (async () => {
      await dispatch(thunkGetSession());
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
