/* Jest unit test for the About Page rendering*/

// import dependencies
import "@testing-library/jest-dom/extend-expect";
import React from "react";
import { render, screen } from "@testing-library/react";
import AboutPage from "../components/About/About";

describe("AboutPage", () => {
  it("renders user about page", () => {
    render(<AboutPage isAdmin={false} />);

    // get the user about heading
    const userWelcomeText = screen.getByText("Welcome to the Blog App!");
    // get the user list
    const userStepsList = screen.getByTestId("about-steps");

    // verify that the about page is for the normal user and not the admin user
    expect(userWelcomeText).toBeInTheDocument();
    // verify the list is displayed
    expect(userStepsList).toBeInTheDocument();
  });

  it("renders admin about page", () => {
    render(<AboutPage isAdmin={true} />);
    // get the admin about heading
    const adminWelcomeText = screen.getByText("Welcome, Admin!");
    // get the admin list
    const adminStepsList = screen.getByTestId("about-steps");

    // verify that the about page is for the admin user and not the normal user
    expect(adminWelcomeText).toBeInTheDocument();
    // verify the list is displayed
    expect(adminStepsList).toBeInTheDocument();
  });
});
