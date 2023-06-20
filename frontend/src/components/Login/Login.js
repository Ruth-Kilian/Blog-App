/* Login form to login the user */

import React, { useState } from "react";
import { Form, Button, Container, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

// receives props from App.js
const LoginForm = ({
  username,
  setUsername,
  password,
  setPassword,
  handleLogin,
}) => {
  // state variable to manage the loading state:
  const [isLoading, setIsLoading] = useState(false);

  // sets the username when the input field changes
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  // sets the password when the input field chanages
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // function to handle the login but also the loading state
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await handleLogin(e);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // renders a bootstrap container and form with form controls
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div className="login-box shadow p-5">
        <h2>Login</h2>
        {/* Link the SignUp Form */}
        <p style={{ marginBottom: "20px", fontSize: "15px" }}>
          Don't have an account?{" "}
          <Link
            to="/signup"
            style={{
              marginBottom: "20px",
              fontSize: "11px",
              textDecoration: "underline",
              fontWeight: "bold",
            }}
          >
            Sign Up
          </Link>
        </p>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              style={{ marginBottom: "15px" }}
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={handleUsernameChange}
            />
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={handlePasswordChange}
            />
          </Form.Group>

          <Button
            style={{ marginTop: "15px" }}
            variant="primary"
            type="submit"
            disabled={isLoading} // Disable the button when loading
          >
            {isLoading ? <Spinner animation="border" size="sm" /> : "Login"}
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default LoginForm;
