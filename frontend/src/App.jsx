import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkSetSession, thunkGetSession } from "./store/session";
import { Switch, Route } from "react-router-dom";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import Protected from "./Protected";
import { Globalstyle } from "./GlobalStyle";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./theme";
import Navigation from "./components/Navigation";
import { thunkGetSpots } from "./store/spots";
import { SpotsGrid } from "./components/spots/SpotsGrid";

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("light");
  const user = useSelector((state) => state.session.user);
  const themeToggler = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };
  useEffect(() => {
    (async () => {
      await dispatch(thunkGetSession());
      await dispatch(thunkGetSpots());
      setLoading(false);
    })();
  }, [dispatch]);
  return (
    <>
      <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
        <Globalstyle />
        {!loading && (
          <>
            <Navigation />
            <Switch>
              <Route exact path='/'>
                <SpotsGrid />
              </Route>
            </Switch>
          </>
        )}
      </ThemeProvider>
    </>
  );
}

export default App;
