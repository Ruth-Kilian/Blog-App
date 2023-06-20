/* Snapshot test for MyBlogs list */

// import dependencies
import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom"; // Import BrowserRouter
import MyBlogs from "../components/MyBlogs/MyBlogs";

// define the test
test("renders MyBlogs component", () => {
  // mock userId
  const userId = "123";
  const truncateContent = jest.fn();

  // render the component
  const { container } = render(
    // wrap component with Router
    <Router>
      <MyBlogs userId={userId} truncateContent={truncateContent} />
    </Router>
  );
  // assert the test
  expect(container).toMatchSnapshot();
});
