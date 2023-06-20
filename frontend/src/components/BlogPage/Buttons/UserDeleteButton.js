/* Button component that represents a delete button for a normal user interface*/

import React from "react";
import { Button, Spinner } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";

// receives a prop from BlogPage.js
const UserDeleteButton = ({ handleDelete, isLoadingUserDelete }) => {
  return (
    // onClick the blog will be deleted by the admin user
    <Button
      variant="danger"
      onClick={handleDelete}
      disabled={isLoadingUserDelete}
    >
      {isLoadingUserDelete ? (
        <Spinner animation="border" size="sm" />
      ) : (
        <FaTrash />
      )}
    </Button>
  );
};

// export it to be used in BlogPage.js
export default UserDeleteButton;
