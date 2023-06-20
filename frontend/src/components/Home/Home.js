/* Home component displays a list of blogs by all the users */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Card, Spinner } from "react-bootstrap";
import "./home.css";
import { FaHeart } from "react-icons/fa";

// receives props from App.js
const HomePage = ({
  setUsers,
  setAllBlogs,
  allBlogs,
  users,
  truncateContent,
}) => {
  // loading state for the user clicking on a blog
  const [isLoadingBlog, setIsLoadingBlog] = useState(false);
  // loading state for the blogs
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(true);

  // fetches the user information and blogs
  useEffect(() => {
    // fetch All users' blogs
    const fetchAllBlogs = async () => {
      try {
        // sends a GET request to server endpoint
        const response = await fetch("https://blogapp-mcqn.onrender.com/blog/"); // Replace with your API endpoint
        if (response.ok) {
          const data = await response.json();
          // set the blog data
          setAllBlogs(data);
        } else {
          console.log("Failed to fetch user information.");
        }
      } catch (error) {
        // log the error
        console.error(error);
      } finally {
        setIsLoadingBlogs(false);
      }
    };

    // fetch All users' information
    const fetchAllUsers = async () => {
      try {
        // sends a GET request to the server enpoint
        const response = await fetch("https://blogapp-mcqn.onrender.com/user/");
        if (response.ok) {
          const data = await response.json();
          // set the user data
          setUsers(data.users);
        } else {
          console.log("Failed to fetch user blogs.");
        }
      } catch (error) {
        // log the error
        console.error(error);
      }
    };
    fetchAllBlogs();
    fetchAllUsers();
  }, [setUsers, setAllBlogs]);

  // dispaly the loading message
  if (isLoadingBlogs) {
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

  // renders a list of blogs with an image, title, short intro, username/profilepic and totla likes on the post
  return (
    <Container>
      <div className="row" style={{ marginTop: "40px" }}>
        {Array.isArray(allBlogs) && allBlogs.length > 0 ? (
          allBlogs.map((blog) => {
            // Find the corresponding user for the blog post
            const user = users.find((user) => user._id === blog.user._id);

            return (
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
                  <Card className="mb-3 blog-card-home">
                    <Card.Img
                      variant="top"
                      // Convert the binary blog image data to a data URI and set it as the src
                      src={`data:image/jpeg;base64,${blog.image}`}
                      alt="Blog"
                      className="card-img-top"
                    />
                    <Card.Body className="card-body-home">
                      <Card.Title className="card-title-home">
                        {blog.title}
                      </Card.Title>
                      <Card.Text className="card-text-home">
                        {truncateContent(blog.content, 100)}
                      </Card.Text>
                      <div className="d-flex justify-content-between align-items-center">
                        {user && (
                          <div className="picture-home">
                            <img
                              // Convert the binary profile picture data to a data URI and set it as the src
                              src={`data:image/jpeg;base64,${user.profilePicture}`}
                              alt="Profile"
                            />
                          </div>
                        )}
                        <div className="username-container-home">
                          <p className="mb-0">
                            <i>{user ? user.username : "Unknown"}</i>
                          </p>
                        </div>
                        <p className="mb-0">
                          <i>
                            {" "}
                            {blog.likesCount} <FaHeart color="red" />
                          </i>
                        </p>
                      </div>
                    </Card.Body>
                  </Card>
                </Link>
              </div>
            );
          })
        ) : (
          <h1>No Blogs found</h1>
        )}
      </div>
    </Container>
  );
};

export default HomePage;
