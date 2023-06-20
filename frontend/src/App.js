/* Parent component that renders the child componnents - uses React Router for routing 
and manages user authentication and authorization. */

// note: added loading messages accoss all components as the deployed app was extremely slow in loading content

import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import Home from "./components/Home/Home";
import NavBar from "./components/Navbar/NavBar";
import Header from "./components/Header/Header";
import Login from "./components/Login/Login";
import SignUp from "./components/Signup/SignUp";
import MyAccount from "./components/MyAccount/MyAccount";
import About from "./components/About/About";
import MyBlogs from "./components/MyBlogs/MyBlogs";
import CreatePost from "./components/Create/CreatePost";
import Users from "./components/Users/Users";
import BlogPage from "./components/BlogPage/BlogPage";
import UserBlogsPage from "./components/UserBlogsPage/UserBlogsPage";

function App() {
  // state variable to hold and set if the user is logged in
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  // state variable to hold and set whether the user is an admin or not
  const [isAdmin, setIsAdmin] = useState(false);

  // state variable to hold and set what role the user has
  const [role, setRole] = useState("normal");
  // state variable to hold and set the username
  const [username, setUsername] = useState("");
  // state variable to hold and set the password
  const [password, setPassword] = useState("");
  // state varible to hold and set the profilePic
  const [profilePicture, setProfilePicture] = useState(null);
  // state variable to hold and set ALL users' allBlogs
  const [allBlogs, setAllBlogs] = useState([]);
  // state variable to hold and set ALL the users information
  const [users, setUsers] = useState([]);
  // state variable to hold and set the user that's logged in Id
  const [userId, setUserId] = useState(null);

  // navigate the user to different pages
  const navigate = useNavigate();

  // format the date for the blogs
  const formatDate = (date) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  // truncates the given content string if it exceeds the specified maxLength
  const truncateContent = (content, maxLength) => {
    if (content.length <= maxLength) {
      return content;
    }
    return content.substring(0, maxLength) + "...";
  };

  // handles user registration
  const handleRegister = async (e) => {
    e.preventDefault();

    // try-catch block for handeling errors
    try {
      // create a FormData object for the given data
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      formData.append("profilePicture", profilePicture);
      formData.append("role", role);

      // sends a POST request to the server endpont with the form data
      const response = await fetch("https://blogapp-mcqn.onrender.com/user/register", {
        method: "POST",
        body: formData,
      });

      // status 200 -> display success message
      if (response.ok) {
        const data = await response.json();
        console.log(data.message);

        // reset fields
        setUsername("");
        setPassword("");
        setProfilePicture(null);

        // navigate the user to the login page
        navigate("/login");
      } else if (response.status === 400) {
        // alert the user that the username is unavailable
        alert("Username is already taken!");
        console.error("Registration failed");
      } else if (response.status === 500) {
        // alert the user that they need a picture to sign up
        alert("Please choose a profile picture!");
        console.error("Registration failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // handles user login
  const handleLogin = async (e) => {
    e.preventDefault();

    // try-catch block for errors
    try {
      // sends a POST request to the server endpoint with the data
      const response = await fetch("https://blogapp-mcqn.onrender.com/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      // status 200
      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        // store the token in the localStorage
        localStorage.setItem("token", data.token);
        // set the user ID
        setUserId(data.userId);
        // set the login status -> for the navbar
        setIsUserLoggedIn(true);
        // set the users' status -> for the navbar
        setIsAdmin(data.role === "admin"); // Set isAdmin based on the role received from the server
        // store the role in the localStorage
        localStorage.setItem("role", data.role);
        // clear the fields
        setUsername("");
        setPassword("");
        // navigate user to the home page
        navigate("/");
      } else if (response.status === 401) {
        // alert the user their credentials are invalid
        alert("Invalid username or password!");
        console.error("Login failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // handels user logout
  const handleLogout = () => {
    // set the admin status to false
    setIsAdmin(false);
    // set the user status to false
    setIsUserLoggedIn(false);
    // clear the storage of the token
    localStorage.clear();
    // Redirect the user to the home page
    navigate("/");
  };

  // if the page refreshes clear credentials
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ""; // Needed for Chrome
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("unload", handleLogout);

    return () => {
      window.removeEventListener("unload", handleLogout);
    };
  });


  return (
    <div>
      {/* Navigation bar and Header are always displayed*/}
      <NavBar
        isAdmin={isAdmin}
        isUserLoggedIn={isUserLoggedIn}
        handleLogout={handleLogout}
      />
      <Header />
      {/* Each route has a corr. path and an element prop representing the component
        to render when the path matches*/}
      <Routes>
        {/* Home component to display ALL blogs*/}
        <Route
          exact
          path="/"
          element={
            <Home
              setAllBlogs={setAllBlogs}
              setUsers={setUsers}
              allBlogs={allBlogs}
              users={users}
              formatDate={formatDate}
              truncateContent={truncateContent}
            />
          }
        />
        {/* SignUp component to register a user */}
        <Route
          path="/signup"
          element={
            <SignUp
              role={role}
              setRole={setRole}
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
              handleRegister={handleRegister}
              setProfilePicture={setProfilePicture}
            />
          }
        />
        {/* Login component to login a user*/}
        <Route
          path="/login"
          element={
            <Login
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
              handleLogin={handleLogin}
            />
          }
        />
        {/* About component */}
        <Route path="/about" element={<About isAdmin={isAdmin} />} />
        {/* MyBlogs component to display ONLY the users blogs*/}
        <Route
          path="/blogs"
          element={
            <MyBlogs
              userId={userId}
              formatDate={formatDate}
              truncateContent={truncateContent}
            />
          }
        />
        {/* User component to manage the users */}
        <Route path="/users" element={<Users userId={userId} />} />
        {/* CreatePost component create a blog */}
        <Route path="/create-post" element={<CreatePost />} />
        {/* MyAccount component for the user to modify their information */}
        <Route
          path="/account"
          element={
            <MyAccount
              setIsAdmin={setIsAdmin}
              handleLogout={handleLogout}
              userId={userId}
              setIsUserLoggedIn={setIsUserLoggedIn}
            />
          }
        />
        {/* BlogPage component for when a blog is clicked on */}
        <Route
          path="/blog/:id"
          element={
            <BlogPage
              formatDate={formatDate}
              isUserLoggedIn={isUserLoggedIn}
              userId={userId}
              users={users}
              isAdmin={isAdmin}
            />
          }
        />
        {/* UserBlogsPage component to get the users' blogs whose name was cliked on*/}
        <Route
          path="/user/:username/blogs"
          element={
            <UserBlogsPage
              users={users}
              formatDate={formatDate}
              truncateContent={truncateContent}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
