/* UserBlogsPage displays a list of blogs by the user whose name was clicked on*/

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Card, Spinner } from "react-bootstrap";
import { FaHeart } from "react-icons/fa";
import "./userblogspage.css";

// receives props from App.js
const UserBlogsPage = ({ users, truncateContent }) => {
  // extracts the username parameter from the URL
  const { username } = useParams();
  // state variable to hold and set the clicked on user's blogs
  const [blogs, setBlogs] = useState([]);
  // state variable for managing the loading state
  const [isLoading, setIsLoading] = useState(true);
  // loading state for the user clicking on a blog
  const [isLoadingBlog, setIsLoadingBlog] = useState(false);

  // fetches the users blogs
  useEffect(() => {
    fetchUserBlogs();
  });

  const fetchUserBlogs = async () => {
    try {
      // sends a GET request to the server endpoint with the username
      const response = await fetch(
        `https://blog-app-gdhi.onrender.com/blog/user/${username}/blogs`
      );
      const data = await response.json();
      // set the blog data
      setBlogs(data);
    } catch (error) {
      // log the error
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // dispaly the loading message
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

  // renders a list of blogs by the same user
  return (
    <Container>
      <div className="row" style={{ marginTop: "40px" }}>
        {Array.isArray(blogs) && blogs.length > 0 ? (
          blogs.map((blog) => {
            // Find the corresponding user for the blog post for the profile picture
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
                  <Card className="mb-3 blog-card">
                    <Card.Img
                      variant="top"
                      // fetch the blog image from the folder
                      src={`data:image/jpeg;base64,${blog.image}`}
                      alt="Blog"
                    />
                    <Card.Body>
                      <Card.Title>{blog.title}</Card.Title>
                      <Card.Text>
                        {truncateContent(blog.content, 100)}
                      </Card.Text>
                      <div className="d-flex justify-content-between align-items-center">
                        {user && (
                          <div className="picture-page">
                            <img
                              // fetch the profile picture from the folder
                              src={`data:image/jpeg;base64,${user.profilePicture}`}
                              alt="Profile"
                            />
                          </div>
                        )}
                        <div className="username-container-page">
                          <p className="mb-0">
                            <i>{blog.user.username}</i>
                          </p>
                        </div>
                        <p className="mb-0">
                          <i>
                            {" "}
                            {blog.likesCount} <FaHeart color="red" />
                          </i>{" "}
                        </p>
                      </div>
                    </Card.Body>
                  </Card>
                </Link>
              </div>
            );
          })
        ) : (
          <p>No blogs found</p>
        )}
      </div>
    </Container>
  );
};

export default UserBlogsPage;
