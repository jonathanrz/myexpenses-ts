import React, { ReactNode } from "react";
import {
  HashRouter as Router,
  Switch,
  Route,
  useLocation,
  Redirect,
} from "react-router-dom";
import Cookie from "js-cookie";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import AccountsPage from "./pages/Accounts";
import BillsPage from "./pages/Bills";
import CreditCardsPage from "./pages/CreditCards";
import PlacesPage from "./pages/Places";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";

function NoMatch() {
  let location = useLocation();

  return (
    <div>
      <h3>
        No match for <code>{location.pathname}</code>
      </h3>
    </div>
  );
}

interface PrivateRouteProps {
  children: ReactNode;
  exact: boolean | undefined;
  path: string | string[] | undefined;
}

function PrivateRoute({ children, exact, path }: PrivateRouteProps) {
  const isAuthenticated = Cookie.get("user") !== undefined;

  return (
    <Route
      exact={exact}
      path={path}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

function App() {
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <Router>
        <Switch>
          <Route path="/login">
            <LoginPage />
          </Route>
          <PrivateRoute exact path="/">
            <HomePage />
          </PrivateRoute>
          <PrivateRoute exact path="/accounts">
            <AccountsPage />
          </PrivateRoute>
          <PrivateRoute exact path="/bills">
            <BillsPage />
          </PrivateRoute>
          <PrivateRoute exact path="/credit_cards">
            <CreditCardsPage />
          </PrivateRoute>
          <PrivateRoute exact path="/places">
            <PlacesPage />
          </PrivateRoute>
          <Route path="*">
            <NoMatch />
          </Route>
        </Switch>
      </Router>
    </MuiPickersUtilsProvider>
  );
}

export default App;
