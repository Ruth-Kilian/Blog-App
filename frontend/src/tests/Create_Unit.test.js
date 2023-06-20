/* Jest unit test for the CreatePost component */

// import dependencies
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { act } from "react-dom/test-utils";
import CreatePost from "../components/Create/CreatePost";

describe("CreatePost", () => {
  let originalAlert;

  // before all the test run
  beforeAll(() => {
    // mock the alert function
    originalAlert = window.alert;
    Object.defineProperty(window, "alert", {
      writable: true,
      value: jest.fn(),
    });
  });

  afterAll(() => {
    window.alert = originalAlert;
  });

  it("should submit the form with correct data", async () => {
    const mockResponse = "Blog post created successfully";
    // mock the fetch function to simulate a success response
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });
    global.fetch = mockFetch;

    // capture console logs
    const consoleLogSpy = jest.spyOn(console, "log");

    // render the component
    render(
      // wrap component in Router
      <Router>
        <CreatePost />
      </Router>
    );

    // get the elements
    const titleInput = screen.getByLabelText("Title");
    const contentInput = screen.getByLabelText("Content");
    const imageInput = screen.getByLabelText("Image");
    const publishButton = screen.getByRole("button", { name: "Publish" });

    // simulate user by changing input values
    fireEvent.change(titleInput, { target: { value: "Test Title" } });
    fireEvent.change(contentInput, { target: { value: "Test Content" } });

    // select an image simulation
    const file = new File(["test image"], "test.jpg", { type: "image/jpeg" });
    Object.defineProperty(imageInput, "files", {
      value: [file],
    });
    fireEvent.change(imageInput);

    // trigger the button
    await act(async () => {
      fireEvent.click(publishButton);
    });

    // verify console log
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Blog post created successfully"
    );

    // verify behaviour - check if the fetch was called with the correct URL and parameters
    expect(mockFetch).toHaveBeenCalledWith("http://localhost:8080/blog", {
      method: "POST",
      headers: {
        Authorization: "Bearer null",
      },
      body: expect.any(FormData),
    });

    const formData = mockFetch.mock.calls[0][1].body;
    expect(formData.get("title")).toBe("Test Title");
    expect(formData.get("content")).toBe("Test Content");
    expect(formData.get("image")).toBe(file);

    // if the path matches the expected value
    expect(window.location.pathname).toBe("/blogs");
  });

  // verifies the behaviour of showing an alert if the submision fails
  it("should show an alert if form submission fails", async () => {
    const mockResponse = { error: "Invalid data" };
    // mocj the fetch function to simulate failed response
    const mockFetch = jest.fn().mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue(mockResponse),
    });
    global.fetch = mockFetch;

    // render the component
    render(
      // wrap the component in Router
      <Router>
        <CreatePost />
      </Router>
    );

    // get the button
    const publishButton = screen.getByRole("button", { name: "Publish" });
    // trigger the button
    await act(async () => {
      fireEvent.click(publishButton);
    });

    // verify the function was called with the correct URL and request parameters
    expect(mockFetch).toHaveBeenCalledWith("http://localhost:8080/blog", {
      method: "POST",
      headers: {
        Authorization: "Bearer null",
      },
      body: expect.any(FormData),
    });
    // verify the alert was called with the correct error message
    expect(window.alert).toHaveBeenCalledWith(
      "Please provide the necessary information for all required fields."
    );
  });
});
