import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { thunkSetSession } from "./store/session";
import { Switch, Route } from "react-router-dom";
import "./App.css";
import LoginFormPage from "./components/session/LoginFormPage";

function App() {
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
