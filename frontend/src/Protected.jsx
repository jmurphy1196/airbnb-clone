import React from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function Protected({ isAuth, children }) {
  const history = useHistory();
  if (!isAuth) history.push("/");

  return <>{children}</>;
}
