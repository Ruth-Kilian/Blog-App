/* Snapshot test for SignIn form */

// import dependencies
import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom"; // Import BrowserRouter
import SignUpForm from "../components/Signup/SignUp";

// define the test
test("renders SignUpForm correctly", () => {
  // render the component
  const { container } = render(
    // wrap component with Router
    <Router>
      <SignUpForm />
    </Router>
  );
  // assert the test
  expect(container).toMatchSnapshot();
});
