import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("renders sign up form", () => {
  const { getByLabelText } = render(<App />);
  const emailInput = getByLabelText("Email *");
  expect(emailInput).toBeInTheDocument();
  const passwordInput = getByLabelText("Password *");
  expect(passwordInput).toBeInTheDocument();
});
