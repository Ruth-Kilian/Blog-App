/* Snapshot test for Home page list */

import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom"; // Import BrowserRouter
import HomePage from "../components/Home/Home";

test("renders HomePage component", () => {
  // mock function for the users
  const setUsers = jest.fn();
  // mock function for the blogs
  const setAllBlogs = jest.fn();
  const allBlogs = [
    // Mock data for testing
    {
      _id: "1",
      title: "Test Blog 1",
      content: "Lorem ipsum dolor sit amet",
      user: {
        _id: "1",
        username: "testuser1",
        profilePicture: "profile1.jpg",
      },
      likesCount: 10,
    },
    {
      _id: "2",
      title: "Test Blog 2",
      content: "Lorem ipsum dolor sit amet",
      user: {
        _id: "2",
        username: "testuser2",
        profilePicture: "profile2.jpg",
      },
      likesCount: 5,
    },
  ];
  const users = [
    // Mock data for testing
    {
      _id: "1",
      username: "testuser1",
      profilePicture: "profile1.jpg",
    },
    {
      _id: "2",
      username: "testuser2",
      profilePicture: "profile2.jpg",
    },
  ];
  // mock function to truncate the content
  const truncateContent = jest.fn();

  // render the component
  const { asFragment } = render(
    // wrap component with Router
    <Router>
      <HomePage
        setUsers={setUsers}
        setAllBlogs={setAllBlogs}
        allBlogs={allBlogs}
        users={users}
        truncateContent={truncateContent}
      />
    </Router>
  );
  // assert the test
  expect(asFragment()).toMatchSnapshot();
});
