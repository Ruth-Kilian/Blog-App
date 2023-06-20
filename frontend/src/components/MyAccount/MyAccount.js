/* MyAccount component displays and manages the users information*/

import React, { useState, useEffect, useCallback } from "react";
import { Form, Button, Container, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./myaccount.css";

// receives props from App.js
const MyAccount = ({ userId, handleLogout, setIsUserLoggedIn }) => {
  // navigate the user to different page
  const navigate = useNavigate();
  // state variable to hold and set the logged in user's information
  const [user, setUser] = useState(null);
  // state variable to hold and set the new username
  const [newUsername, setNewUsername] = useState("");
  // state variable to hold and set the current password
  const [currentPassword, setCurrentPassword] = useState("");
  // state variable to hold and set the new password
  const [newPassword, setNewPassword] = useState("");
  // state variable to hold and set the new profile picture
  const [profilePicture, setProfilePicture] = useState(null);
  const [isLoadingUsername, setIsLoadingUsername] = useState(false); // Loading state for username update button
  const [isLoadingPassword, setIsLoadingPassword] = useState(false); // Loading state for password update button
  const [isLoadingProfilePicture, setIsLoadingProfilePicture] = useState(false); // Loading state for profile picture update button
  const [isLoadingDeleteAccount, setIsLoadingDeleteAccount] = useState(false); // Loading state for delete account button
  const [isLoading, setIsLoading] = useState(true); // Loading state for delete account button

  // wrapped in the useCallback hook - returns a memorized function that only changes if the dependecey changes
  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch(
        `https://blogapp-mcqn.onrender.com/user/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUser({
          ...data.user,
          profilePicture: `data:image/jpeg;base64,${data.user.profilePicture}`,
        });
      } else if (response.status === 401) {
        alert("Unauthorized! You do not have the necessary credentials!");
        navigate("/");
      } else {
        console.log("Failed to fetch User information!");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser, navigate]);

  // handles the username change
  const handleUsernameChange = async (e) => {
    e.preventDefault();
    setIsLoadingUsername(true); // Set loading state to true

    // try-catch block for error handeling
    try {
      // sends a POST reques to the server endpoint with the user id and token and new username
      const response = await fetch(
        `https://blogapp-mcqn.onrender.com/user/${user._id}/change-username`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ newUsername }),
        }
      );

      // status 200
      if (response.ok) {
        // alert the user
        alert("Username updated successfully");
        // clear the field
        setNewUsername("");
      } else {
        // log the error
        console.error("Username update failed");
      }
      // catch and log the error
    } catch (error) {
      console.error(error);
    }
    setIsLoadingUsername(false); // Set loading state back to false
  };

  // handles the password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setIsLoadingPassword(true); // Set loading state to true

    // try-catch block for error handeling
    try {
      // sends a POST request to the server endpoint with the user id and token and password changes
      const response = await fetch(
        `https://blogapp-mcqn.onrender.com/user/${user._id}/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );

      // status 200
      if (response.ok) {
        // alert the user
        alert("Password updated successfully");
        // clear the fields
        setCurrentPassword("");
        setNewPassword("");
      } else if (response.status === 401) {
        alert("Invalid current password!");
        console.error("Password update failed");
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoadingPassword(false); // Set loading state back to false
  };

  // handles the profile picture chnage
  const handleProfilePictureChange = async (e) => {
    e.preventDefault();
    setIsLoadingProfilePicture(true);

    try {
      const fileReader = new FileReader();
      fileReader.onloadend = async () => {
        const base64data = fileReader.result;

        try {
          const response = await fetch(
            `https://blogapp-mcqn.onrender.com/user/${user._id}/change-profile-picture`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ profilePicture: base64data }),
            }
          );

          if (response.ok) {
            alert("Profile picture updated successfully");
            setProfilePicture(null);
            fetchUser();
          } else {
            console.error("Profile picture update failed");
          }
        } catch (error) {
          console.error(error);
        }

        setIsLoadingProfilePicture(false);
      };

      if (e.target.files[0]) {
        fileReader.readAsDataURL(e.target.files[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // handles the deletion of the users account
  const handleDeleteAccount = async () => {
    // confirms that the user wants to delete their account
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (confirmed) {
      setIsLoadingDeleteAccount(true); // Set loading state to true

      // try-catch block for error handeling
      try {
        // sends DELETE request to the server endpoint with the userId, token
        const response = await fetch(
          `https://blogapp-mcqn.onrender.com/user/account/${userId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // log the user out and navigate them to the home page
        if (response.ok) {
          // set user logged in false

          setIsUserLoggedIn(false);
          // logout user
          handleLogout();
          navigate("/");
        } else {
          console.log("Failed to delete account");
        }
      } catch (error) {
        console.error(error);
      }
      setIsLoadingDeleteAccount(false); // Set loading state back to false
    }
  };

  // loading message is displayed
  if (isLoading) {
    return (
      <Container fluid className="page-container">
        <h1 className="d-flex justify-content-center align-items-center loading-spinner">
          Loading Content
        </h1>
        <div className="d-flex justify-content-center align-items-center loading-spinner">
          <Spinner animation="border" role="status" variant="primary" />
        </div>
      </Container>
    );
  }

  // renders a form with several form controls and a delete button icon
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: "140vh" }}
    >
      <div className="login-box shadow p-5" style={{ width: "100vh" }}>
        <div className="d-flex justify-content-between align-items-center">
          <h2 style={{ marginBottom: "30px" }}>{user.role} account</h2>
          <Button
            variant="danger"
            onClick={handleDeleteAccount}
            disabled={isLoadingDeleteAccount}
          >
            {isLoadingDeleteAccount ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Delete Account"
            )}
          </Button>
        </div>
        <div className="profile-picture">
          <img
            style={{ marginBottom: "15px" }}
            // fetch the profile picture from the folder it is stored in
            src={user.profilePicture}
            alt="Profile"
          />
        </div>
        <Form>
          <Form.Group controlId="newUsername">
            <Form.Label>Change Username</Form.Label>
            <Form.Control
              style={{ marginBottom: "15px" }}
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="New Username"
            />
            <Button
              style={{ marginBottom: "15px" }}
              variant="primary"
              type="submit"
              onClick={handleUsernameChange}
              disabled={isLoadingUsername}
            >
              {isLoadingUsername ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Update"
              )}
            </Button>
          </Form.Group>

          <Form.Group controlId="currentPassword">
            <Form.Label>Current Password</Form.Label>
            <Form.Control
              style={{ marginBottom: "15px" }}
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />
          </Form.Group>

          <Form.Group controlId="newPassword">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              style={{ marginBottom: "15px" }}
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
            <Button
              style={{ marginBottom: "15px" }}
              variant="primary"
              type="submit"
              onClick={handlePasswordChange}
              disabled={isLoadingPassword}
            >
              {isLoadingPassword ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Update"
              )}
            </Button>
          </Form.Group>

          <Form.Group controlId="profilePicture">
            <Form.Label>Change Profile Picture</Form.Label>
            <Form.Control
              style={{ marginBottom: "15px" }}
              type="file"
              accept=".jpg, .jpeg, .png"
              onChange={(e) => setProfilePicture(e.target.files[0])}
            />
            <Button
              style={{ marginBottom: "15px" }}
              variant="primary"
              type="submit"
              onClick={handleProfilePictureChange}
              disabled={isLoadingProfilePicture}
            >
              {isLoadingProfilePicture ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Update"
              )}
            </Button>
          </Form.Group>
        </Form>
      </div>
    </Container>
  );
};

export default MyAccount;
