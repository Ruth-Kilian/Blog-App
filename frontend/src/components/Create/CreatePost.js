/* CreatePost component represents a form for creating a new blog post */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";

const CreatePost = () => {
  // state variable to hold and set the title
  const [title, setTitle] = useState("");
  // state variable to hold and set the content
  const [content, setContent] = useState("");
  // state variable to hold and set the image
  const [image, setImage] = useState(null);
  // state variable to manage the loading state
  const [isLoading, setIsLoading] = useState(false);
  // navigate the user to different pages
  const navigate = useNavigate();

  // updates the title state variable with the new value entered
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  // updates the content state variable with the new value entered
  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  // updates the image state variable with the selected image file
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // handles the submit of the blog
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // create a FormData object and appends the values
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", image);

    // try-catch block for errors
    try {
      // sends a POST request to the server endpoint with the formData and token
      const response = await fetch("https://blog-app-gdhi.onrender.com/blog", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      // status 200
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        // clear the fields
        setTitle("");
        setContent("");
        setImage(null);
        // navigate to the users blogs
        navigate("/blogs");
           } else if (response.status === 401) {
        alert("Unauthorized! You do not have the necessary credentials!");
        navigate("/");
      } else {
        // alert the user that all the fields need to have data
        alert(
          "Please provide the necessary information for all required fields."
        );
        console.log("Blog failed");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // renders a bootstrap form container with from controls
  return (
    <Container className="py-4">
      <h2>Create a Blog Post</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={handleTitleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="content">
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={content}
            onChange={handleContentChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="image">
          <Form.Label>Image</Form.Label>
          <Form.Control type="file" onChange={handleImageChange} />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              <span className="ms-2">Publishing...</span>
            </>
          ) : (
            "Publish"
          )}
        </Button>
      </Form>
    </Container>
  );
};

export default CreatePost;
