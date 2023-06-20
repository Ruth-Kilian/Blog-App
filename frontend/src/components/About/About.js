/* About component - displays an about page depending on which user is logged in */

import React from "react";
import "./about.css"; // Import the CSS file for styling

const UserAboutPage = () => {
  return (
    <div className="about-container">
      <h1>Welcome to the Blog App!</h1>
      <p className="about-description">
        This app allows you to create and share blog posts with other users. It
        provides a platform to express your thoughts, ideas, and experiences
        with a wider audience.
      </p>
      <p className="about-instructions">
        To use the Blog App, follow these steps:
      </p>
      <ol className="about-steps" data-testid="about-steps">
        <li>Sign up for an account if you haven't already.</li>
        <li>Login to access your account and start using the app.</li>
        <li>Click on the "Write" link to create a new blog post.</li>
        <li>
          Fill in the required information, such as the title, content and image
          of your blog post.
        </li>
        <li>Click on the "Publish" button to publish your blog post.</li>
        <li>
          Explore the "MyBlogs" section to view and manage your own blog posts.
        </li>
        <li>
          Interact with other users by reading and liking on their blog posts.
        </li>
      </ol>
    </div>
  );
};

const AdminAboutPage = () => {
  return (
    <div className="about-container">
      <h1>Welcome, Admin!</h1>
      <p className="about-description">
        As an admin, you have additional privileges and responsibilities in
        managing the Blog App.
      </p>
      <ol className="about-steps" data-testid="about-steps">
        <li>Access the "Users" section to manage user accounts.</li>
        <li>View and moderate user posts.</li>
      </ol>
    </div>
  );
};

const AboutPage = ({ isAdmin }) => {
  return isAdmin ? <AdminAboutPage /> : <UserAboutPage />;
};

export default AboutPage;
