/* Jest unit test for the Home page rendering*/

import "@testing-library/jest-dom/extend-expect";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom"; // Import BrowserRouter
import HomePage from "../components/Home/Home";

test("renders loading message when allBlogs is null", async () => {
  // mock function for setting the users
  const setUsers = jest.fn();
  // mock function for setting the blogs
  const setAllBlogs = jest.fn();
  // mock if the database is null
  const allBlogs = null; // Set allBlogs to null for this test
  // mock users array
  const users = [];
  // mock truncate content function
  const truncateContent = jest.fn();

  // render the component
  render(
    // wrap the component in Route
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

  // Wait for the loading spinner to appear
  await waitFor(() => {
    const loadingMessage = screen.getByText("Loading Content");
    // verify the loading message is appears
    expect(loadingMessage).toBeInTheDocument();
  });
});

test("renders 'No Blogs found' message when allBlogs is an empty array", () => {
  const setUsers = jest.fn();
  const setAllBlogs = jest.fn();
  const allBlogs = []; // Set allBlogs to an empty array for this test
  const users = [];
  const truncateContent = jest.fn();

  render(
    <HomePage
      setUsers={setUsers}
      setAllBlogs={setAllBlogs}
      allBlogs={allBlogs}
      users={users}
      truncateContent={truncateContent}
    />
  );

  const noBlogsMessage = screen.getByText("No Blogs found");
  expect(noBlogsMessage).toBeInTheDocument();
});

test("renders list of blogs when allBlogs contains data", () => {
  // mock function to set the users
  const setUsers = jest.fn();
  // mock function to set the blogs
  const setAllBlogs = jest.fn();
  // mock data for the blogs
  const allBlogs = [
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
  // mock data for the users
  const users = [
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
  // mock the trucate function
  const truncateContent = jest.fn();

  // render the component
  render(
    // wrap the component in Router
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

  // check if the blog titles are rendered
  const blogTitle1 = screen.getByText("Test Blog 1");
  const blogTitle2 = screen.getByText("Test Blog 2");
  // verify that the titles appear
  expect(blogTitle1).toBeInTheDocument();
  expect(blogTitle2).toBeInTheDocument();

  // check if the usernames are rendered
  const username1 = screen.getByText("testuser1");
  const username2 = screen.getByText("testuser2");
  // verify that the username appear
  expect(username1).toBeInTheDocument();
  expect(username2).toBeInTheDocument();
});
