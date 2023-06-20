/* NavBar component represents navigation for the user */

import React from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import "./navbar.css";

// receives props from App.js
const NavigationBar = ({ isUserLoggedIn, handleLogout, isAdmin }) => {
  // renders a list of links that depending on the users' status is diffrent
  return (
    <div className="navbar-container sticky-top">
      <nav>
        <ul className="navbar-ul">
          <li className="centered-links">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>{" "}
            {isUserLoggedIn && <Link to="/blogs">MyBlogs</Link>}
            {isUserLoggedIn && <Link to="/create-post">Write</Link>}
            {isUserLoggedIn && isAdmin && <Link to="/users">Users</Link>}{" "}
          </li>
          <li className="right-links">
            {isUserLoggedIn ? (
              <Dropdown>
                <Dropdown.Toggle variant="link" id="dropdown-my-account">
                  MyAccount
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/account">
                    Account
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <ul className="right-links">
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/signup">Sign Up</Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavigationBar;
