/* Sign Up form to register the user */

import React, { useState } from "react";
import { Form, Button, Container, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

// receives props from App.js
const SignUpForm = ({
  role,
  setRole,
  username,
  setUsername,
  password,
  setPassword,
  handleRegister,
  setProfilePicture,
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

  // sets the selected file as the profile picture
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setProfilePicture(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // sets the role of the user
  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  // function to handle the sign in but also the loading state
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await handleRegister(e);
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
      <div className="signup-box shadow p-5">
        <h2>Sign Up</h2>

        {/* Link the Login Form */}
        <p style={{ marginBottom: "20px", fontSize: "15px" }}>
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              marginBottom: "20px",
              fontSize: "11px",
              textDecoration: "underline",
              fontWeight: "bold",
            }}
          >
            Login
          </Link>
        </p>
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
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
              style={{ marginBottom: "15px" }}
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={handlePasswordChange}
            />
          </Form.Group>

          <Form.Group controlId="profilePicture">
            <Form.Label>Profile Picture</Form.Label>
            <Form.Control
              type="file"
              onChange={handleImageChange}
              accept="image/jpeg, image/png"
            />
          </Form.Group>

          <Form.Group controlId="role">
            <Form.Label>Role</Form.Label>
            <Form.Control as="select" value={role} onChange={handleRoleChange}>
              <option value="normal">Normal User</option>
              <option value="admin">Admin User</option>
            </Form.Control>
          </Form.Group>

          <Button
            style={{ marginTop: "15px" }}
            variant="primary"
            type="submit"
            disabled={isLoading} // Disable the button when loading
          >
            {isLoading ? <Spinner animation="border" size="sm" /> : "Sign Up"}
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default SignUpForm;
