/* Button component that represents a delete button for an admin user interface*/

import React from "react";
import { Button, Spinner } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";

// receives a prop from BlogPage.js
const AdminDeleteButton = ({ handleAdminDelete, isLoadingAdminDelete }) => {
  return (
    // onClick the blog will be deleted by the admin user
    <Button
      variant="danger"
      onClick={handleAdminDelete}
      disabled={isLoadingAdminDelete}
    >
      {isLoadingAdminDelete ? (
        <Spinner animation="border" size="sm" />
      ) : (
        <FaTrash />
      )}
    </Button>
  );
};

// export it to be used in BlogPage.js
export default AdminDeleteButton;
