/* MyBlogs component displays all the logged in users' blogs */

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Card, Spinner } from "react-bootstrap";
import { FaHeart } from "react-icons/fa";
import "./myblogs.css";

// receives props from App.js
const MyBlogs = ({ userId, truncateContent }) => {
  // state variable to hold and set the logged in users' information
  const [user, setUser] = useState(null);
  // state variable to hold and set the logged in users' blogs
  const [myBlogs, setMyBlogs] = useState([]);
  // loading state for the user clicking on a blog
  const [isLoadingBlog, setIsLoadingBlog] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true); // New state for user loading
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(true); // New state for blogs loading
  // navigate the user to different pages
  const navigate = useNavigate();

  // fetches the user's information
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // sends a GET request to the server enpoint with the logged in users id and token
        const response = await fetch(
          `https://blog-app-gdhi.onrender.com/user/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // status 200
        if (response.ok) {
          const data = await response.json();
          // set the user data
          setUser(data.user);
        } else {
          // log the error
          console.log("Failed to fetch User Information!");
        }
        // catch and log the error
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingUser(false); // Set loading state to false when finished
      }
    };
    fetchUser();
  }, [userId, navigate]);

  // fetches the logged in users blogs
  useEffect(() => {
    const fetchMyBlogs = async () => {
      try {
        // sends a GET request to the server endpont with the token
        const response = await fetch(
          `https://blog-app-gdhi.onrender.com/blog/my-blogs/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        // status 200
        if (response.ok) {
          const data = await response.json();
          // set the blogs
          setMyBlogs(data);
        } else if (response.status === 401) {
          alert("Unauthorized! You do not have the necessary credentials!");
          navigate("/");
        } else {
          // log the error
          console.error("Failed to fetch myBlogs");
        }
        // catch and log the error
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingBlogs(false); // Set loading state to false when finished
      }
    };
    fetchMyBlogs();
  }, [userId]);

  // if the blog & user is null then dispaly the loading message
  if (isLoadingUser || isLoadingBlogs) {
    // Check loading states instead of myBlogs length
    return (
      <Container fluid className="page-container">
        <h1 className="d-flex justify-content-center align-items-center">
          Loading Content
        </h1>
        <div className="d-flex justify-content-center align-items-center loading-spinner">
          <Spinner animation="border" role="status" variant="primary"></Spinner>
        </div>
      </Container>
    );
  }

  // if the there are no blogs with the logged in user's id
  if (myBlogs.length === 0) {
    return (
      <h1 className="d-flex justify-content-center align-items-center">
        No Blogs found
      </h1>
    );
  }

  // loading message for when the blog is clicked on
  if (isLoadingBlog) {
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

  // renders the list of blogs with the username/profilepicture and timestamp
  return (
    <Container>
      <div className="row" style={{ marginTop: "40px" }}>
        {/* map through the blogs finding the */}
        {myBlogs.map((blog) => (
          <div
            key={blog._id}
            className="col-md-6"
            style={{ marginBottom: "40px" }}
          >
            {/* A link to the BlogPage of the specific blog clicked on*/}
            <Link
              to={`/blog/${blog._id}`}
              className="blog-link-home"
              onClick={() => setIsLoadingBlog(true)}
            >
              <Card className="mb-3 blog-card">
                <Card.Img
                  variant="top"
                  // Convert the binary blog image data to a data URI and set it as the src
                  src={`data:image/jpeg;base64,${blog.image}`}
                  alt="Blog"
                  className="image"
                />
                <Card.Body>
                  <Card.Title>{blog.title}</Card.Title>
                  <Card.Text>{truncateContent(blog.content, 100)}</Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="picture">
                      <img
                        // Convert the binary profile picture data to a data URI and set it as the src
                        src={`data:image/jpeg;base64,${user.profilePicture}`}
                        alt="Profile"
                      />
                    </div>
                    <div className="username-container">
                      <p className="mb-0" style={{ fontSize: "16px" }}>
                        <i>{blog.user.username}</i>
                      </p>
                    </div>
                    <p className="mb-0" style={{ fontSize: "16px" }}>
                      {/* display the likes on the post */}
                      {blog.likesCount} <FaHeart color="red" />
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Link>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default MyBlogs;
