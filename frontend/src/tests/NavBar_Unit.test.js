/* Jest unit test for the rendering of the NavBar component */

// import dependencies
import "@testing-library/jest-dom/extend-expect";
import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NavigationBar from "../components/NavBar/NavBar";

describe("NavigationBar", () => {
  test("renders navigation links correctly when user is not logged in", () => {
    // render the component
    render(
      // wrap the component with MemoryRouter - provides functionality
      <MemoryRouter>
        <NavigationBar
          isUserLoggedIn={false}
          handleLogout={jest.fn()}
          isAdmin={false}
        />
      </MemoryRouter>
    );

    // Check if "Home" and "About" links are rendered
    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /about/i })).toBeInTheDocument();

    // Check if "MyBlogs" and "Write" links are not rendered
    expect(screen.queryByRole("link", { name: /myblogs/i })).toBeNull();
    expect(screen.queryByRole("link", { name: /write/i })).toBeNull();

    // Check if "Users" link is not rendered
    expect(screen.queryByRole("link", { name: /users/i })).toBeNull();
  });

  test("renders navigation links correctly when user is logged in", () => {
    render(
      <MemoryRouter>
        <NavigationBar
          isUserLoggedIn={true}
          handleLogout={jest.fn()}
          isAdmin={false}
        />
      </MemoryRouter>
    );

    // Check if "Home" and "About" & "MyBlogs" and "Write"  links are rendered
    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /myblogs/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /write/i })).toBeInTheDocument();

    // Check if "Users" link is not rendered
    expect(screen.queryByRole("link", { name: /users/i })).toBeNull();
  });

  test("renders navigation links correctly when admin user is logged in", () => {
    render(
      <MemoryRouter>
        <NavigationBar
          isUserLoggedIn={true}
          handleLogout={jest.fn()}
          isAdmin={true}
        />
      </MemoryRouter>
    );

    // Check if "Home", "About", "Users", "MyBlogs" and "Write"  are rendered
    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /users/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /myblogs/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /write/i })).toBeInTheDocument();
  });
});
