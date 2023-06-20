/* Snapshot test for Login Form*/

// import dependencies
import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom"; // Import BrowserRouter
import LoginForm from "../components/Login/Login";

// define the test
test("renders LoginForm correctly", () => {
  // render the component
  const { container } = render(
    // wrap component with Router
    <Router>
      <LoginForm />
    </Router>
  );
  // assert the test
  expect(container).toMatchSnapshot();
});
