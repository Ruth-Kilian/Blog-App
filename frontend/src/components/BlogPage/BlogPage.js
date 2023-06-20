/* BlogPage component that displays the blog the user clicked on */

import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Container, Card, Button, Form, Spinner } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import UserDeleteButton from "./Buttons/UserDeleteButton";
import AdminDeleteButton from "./Buttons/AdminDeleteButton";
import "./blogpage.css";

// receives from App.js
export default function BlogPage({
  users,
  userId,
  isUserLoggedIn,
  formatDate,
  isAdmin,
}) {
  // navigate the user to diffrent pages
  const navigate = useNavigate();
  // extracts the id parameter from the URL
  const { id } = useParams();
  // state variable to hold and set the blog
  const [blog, setBlog] = useState(null);
  // state variable to hold and set the editing mode
  const [isEditing, setIsEditing] = useState(false);
  // state variable to hold and set the edited blog
  const [editedBlog, setEditedBlog] = useState({
    title: "",
    content: "",
    image: null,
  });
  // state variable to hold and set the likes on the post
  const [liked, setLiked] = useState(false);
  // loading state for getting the blog
  const [isLoadingBlog, setIsLoadingBlog] = useState(true);
  // loading state for when the username is clicked on
  const [isLoadingUserBlogs, setIsLoadingUserBlogs] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false); // Loading state for edit button
  const [isLoadingSave, setIsLoadingSave] = useState(false); // Loading state for save button
  const [isLoadingCancel, setIsLoadingCancel] = useState(false); // Loading state for cancel button
  const [isLoadingUserDelete, setIsLoadingUserDelete] = useState(false); // Loading state for user delete button
  const [isLoadingAdminDelete, setIsLoadingAdminDelete] = useState(false); // Loading state for admin delete button

  // wrapped in the useCallback hook - returns a memorized function that only changes if the dependecey changes
  const fetchBlog = useCallback(async () => {
    try {
      const response = await fetch(
        `https://blogapp-mcqn.onrender.com/blog/${id}`
      );

      if (response.ok) {
        const data = await response.json();
        setBlog(data);
      } else if (response.status === 404) {
        // Blog not found, handle the error here
        console.error("Blog not found");
      } else {
        // Other error occurred, handle it accordingly
        console.error("Failed to fetch the blog");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingBlog(false);
    }
  }, [id]);

  // fetches the clicked on blog
  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  // toggles the isEditing state
  const handleEdit = () => {
    setIsLoadingEdit(true); // Set loading state to true
    setIsEditing(!isEditing);
    if (!isEditing) {
      // updates the editedBlog state with the current filed values
      setEditedBlog((prevEditedBlog) => ({
        ...prevEditedBlog,
        title: blog.title,
        content: blog.content,
        image: null,
      }));
    }
    setIsLoadingEdit(false); // Set loading state back to false after completing the editing process
  };

  // called when the input fields change and updates the corr. properties in the state
  const handleInputChange = (event) => {
    setEditedBlog({
      ...editedBlog,
      [event.target.name]: event.target.value,
    });
  };

  // called when the image file is selected and updates the state with the selected image
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setEditedBlog((prevEditedBlog) => ({
      ...prevEditedBlog,
      image: file,
    }));
  };

  // called when the edit mode is canceled -> resetting the state
  const handleCancel = () => {
    setIsLoadingCancel(true);

    try {
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
    setIsLoadingCancel(false);
  };

  // handles the submitting of the edited blog
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoadingSave(true);
    try {
      // createa a new FormData object with the new values
      const formData = new FormData();
      formData.append("title", editedBlog.title);
      formData.append("content", editedBlog.content);
      formData.append("image", editedBlog.image); // Append the image file

      // sends a PUT request to the server endpoint
      const response = await fetch(
        `https://blogapp-mcqn.onrender.com/blog/edit/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData, // Send the form data
        }
      );

      if (response.ok) {
        // set the editing mode off
        setIsEditing(false);
        // fetch the blog
        fetchBlog();
      } else {
        // log the error
        console.error("Failed to edit the blog");
      }
      // catch and log the error
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingSave(false);
    }
  };

  // handles the liking of a post
  const handleLike = async () => {
    try {
      const response = await fetch(
        `https://blogapp-mcqn.onrender.com/blog/like/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        setLiked(!liked);
      } else {
        alert("You have already left kudos here!");
        console.error("Failed to like the blog");
      }
    } catch (error) {
      // catch and log the error
      console.error(error);
    }
  };

  // handles the deletion of a blog of the logged in users
  const handleUserDelete = async () => {
    setIsLoadingUserDelete(true);
    try {
      // sends a DELETE request to the server endpoint with the blog id and userid and token
      const response = await fetch(
        `https://blogapp-mcqn.onrender.com/blog/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ user: userId }),
        }
      );

      if (response.ok) {
        // redirect the user to the blog page
        navigate("/blogs");
      } else {
        // log the error
        console.error("Failed to delete the blog");
      }
      // catch and log the error
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingUserDelete(false);
    }
  };

  // handles the deletion of a blog by the admin
  const handleAdminDelete = async () => {
    setIsLoadingAdminDelete(true);
    try {
      // sends a DELETE request to the server endpoint with the blogid and token
      const response = await fetch(
        `https://blogapp-mcqn.onrender.com/admin/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete blog");
      }

      const responseData = await response.json();
      console.log(responseData.message);
      // navigate admin user to the home page
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingAdminDelete(false);
    }
  };

  // if the blog is null then dispaly the loading message
  if (!blog) {
    // use a spinner from bootstarp
    return (
      <Container fluid className="page-container">
        <h1 className="d-flex justify-content-center align-items-center loading-spinner">
          Loading Content
        </h1>
        <div className="d-flex justify-content-center align-items-center loading-spinner">
          <Spinner animation="border" role="status" variant="primary"></Spinner>
        </div>
      </Container>
    );
  }

  if (isLoadingBlog) {
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

  // loading message for when the username is clicked on
  if (isLoadingUserBlogs) {
    return (
      <Container fluid className="page-container">
        <h1 className="d-flex justify-content-center align-items-center loading-spinner">
          Loading Blog...
        </h1>
        <div className="d-flex justify-content-center align-items-center loading-spinner">
          <Spinner animation="border" role="status" variant="primary" />
        </div>
      </Container>
    );
  }

  // find the corr. user profile picture
  const user = users.find((user) => user._id === blog.user._id);

  // renders a container with the blog image, title, all the content, username/profilepic and created and edited date
  return (
    <Container
      fluid
      className="page-container"
      style={{ marginBottom: "70px" }}
    >
      <Card className="mb-3">
        <Card.Img
          variant="top"
          // Convert the binary blog image data to a data URI and set it as the src
          src={`data:image/jpeg;base64,${blog.image}`}
          alt="Blog"
        />
        <Card.Body className="card-body-details">
          <div>
            {/* Editing mode */}
            {isEditing ? (
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="title">
                  <Form.Control
                    type="text"
                    name="title"
                    value={editedBlog.title}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="content">
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="content"
                    value={editedBlog.content}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="change-image">
                  <Form.Control
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Form.Group>
                <div className="buttons">
                  <Button
                    variant="success"
                    type="submit"
                    className="mr-2"
                    disabled={isLoadingSave}
                  >
                    {isLoadingSave ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Save"
                    )}
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={handleCancel}
                    disabled={isLoadingCancel}
                  >
                    {isLoadingCancel ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Cancel"
                    )}
                  </Button>
                </div>
              </Form>
            ) : (
              <>
                <div className="d-flex justify-content-between align-items-center">
                  <Card.Title className="blog-title ">{blog.title}</Card.Title>
                  <div>
                    {/* Added code for liking/unliking */}
                    {blog.user._id !== userId && isUserLoggedIn && (
                      <Button variant="link" onClick={handleLike}>
                        {liked ? (
                          <FaHeart color="black" />
                        ) : (
                          <FaHeart color="red" />
                        )}
                      </Button>
                    )}
                  </div>

                  {/* Check for ownership or admin status for edit button */}
                  {(blog.user._id === userId || isAdmin) && isUserLoggedIn && (
                    <div>
                      {/* Check for ownership or admin status for delete button */}
                      {blog.user._id === userId && (
                        <Button
                          variant="success"
                          className="mr-2"
                          style={{ marginRight: "5px" }}
                          onClick={handleEdit}
                          disabled={isLoadingEdit} // Disable the button while the editing process is ongoing
                        >
                          {isLoadingEdit ? ( // Conditional rendering based on the loading state
                            <Spinner animation="border" size="sm" />
                          ) : (
                            <FaEdit />
                          )}
                        </Button>
                      )}
                      {/* Add condition to display delete button for admin */}
                      {blog.user._id !== userId && isAdmin && (
                        <AdminDeleteButton
                          handleAdminDelete={handleAdminDelete}
                          isLoadingAdminDelete={isLoadingAdminDelete}
                        />
                      )}

                      {/* Check for ownership for delete button */}
                      {blog.user._id === userId && (
                        <UserDeleteButton
                          handleDelete={handleUserDelete}
                          isLoadingUserDelete={isLoadingUserDelete}
                        />
                      )}
                    </div>
                  )}
                </div>
                <Card.Text className="card-text-details ">
                  {blog.content}
                </Card.Text>
              </>
            )}
          </div>
          <div className="d-flex justify-content-between align-items-center">
            {user && (
              <div className="picture">
                <img
                  // Convert the binary profile picture data to a data URI and set it as the src
                  src={`data:image/jpeg;base64,${user.profilePicture}`}
                  alt="Profile"
                />
              </div>
            )}

            <div className="username-containers">
              {/* Link to see the users other blogs*/}
              <Link
                style={{ textDecoration: "underline" }}
                to={`/user/${blog.user.username}/blogs`}
                className="mb-0 small-text"
                onClick={() => setIsLoadingUserBlogs(true)}
              >
                <i className="username">{blog.user.username}</i>
              </Link>
            </div>
            <p className="mb-0 small-text">
              {/* Created date and edited date */}
              <i>Created: {formatDate(blog.createdAt)}</i>
              {blog.createdAt !== blog.updatedAt && (
                <i> | Last Edited: {formatDate(blog.updatedAt)}</i>
              )}
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
