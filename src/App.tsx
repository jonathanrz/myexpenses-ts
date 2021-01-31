import React, { ReactNode } from "react";
import {
  HashRouter as Router,
  Switch,
  Route,
  useLocation,
  Redirect,
} from "react-router-dom";
import Cookie from "js-cookie";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import AccountsPage from "./pages/Accounts";
import BillsPage from "./pages/Bills";
import CategoriesPage from "./pages/Categories";
import CreditCardsPage from "./pages/CreditCards";
import CreditCardsInvoicePage from "./pages/CreditCardsInvoice";
import ExpensesPage from "./pages/Expenses";
import PlacesPage from "./pages/Places";
import ReceiptsPage from "./pages/Receipts";
import HomePage from "./pages/Home";
import MonthExpensesPage from "./pages/MonthExpenses";
import NubankPage from "./pages/Nubank";
import ResumePage from "./pages/Resume";
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

const queryClient = new QueryClient();

function App() {
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Switch>
            <Route path="/login">
              <LoginPage />
            </Route>
            <PrivateRoute exact path="/">
              <HomePage />
            </PrivateRoute>
            <PrivateRoute exact path="/resume">
              <ResumePage />
            </PrivateRoute>
            <PrivateRoute exact path="/accounts">
              <AccountsPage />
            </PrivateRoute>
            <PrivateRoute exact path="/bills">
              <BillsPage />
            </PrivateRoute>
            <PrivateRoute exact path="/categories">
              <CategoriesPage />
            </PrivateRoute>
            <PrivateRoute exact path="/credit_cards/:id">
              <CreditCardsInvoicePage />
            </PrivateRoute>
            <PrivateRoute exact path="/credit_cards">
              <CreditCardsPage />
            </PrivateRoute>
            <PrivateRoute exact path="/expenses/:mode">
              <ExpensesPage />
            </PrivateRoute>
            <PrivateRoute exact path="/month_expenses">
              <MonthExpensesPage />
            </PrivateRoute>
            <PrivateRoute exact path="/nubank">
              <NubankPage />
            </PrivateRoute>
            <PrivateRoute exact path="/places">
              <PlacesPage />
            </PrivateRoute>
            <PrivateRoute exact path="/receipts">
              <ReceiptsPage />
            </PrivateRoute>
            <Route path="*">
              <NoMatch />
            </Route>
          </Switch>
        </Router>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </MuiPickersUtilsProvider>
  );
}

export default App;
