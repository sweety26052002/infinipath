import React from "react";
import { Navigate } from "react-router-dom";
import { getItemInLocalStorage } from "../services/localStorage"; // Adjust the import path as needed

interface RoleBasedRouteProps {
  element: React.ReactNode;
  // path: string;
  allowedRoles: string[];
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  element,
  allowedRoles,
}) => {
  const userRole = getItemInLocalStorage("seekerDetails")?.role || ""; // Assuming you store the user role in local storage

  if (!allowedRoles.includes(userRole)) {
    // Redirect to a different page if the user does not have the appropriate role
    return <Navigate to="/unauthorized" />;
  }

  return (
    <>
      {element}
      {/* <Outlet /> */}
    </>
  );
};

export default RoleBasedRoute;
