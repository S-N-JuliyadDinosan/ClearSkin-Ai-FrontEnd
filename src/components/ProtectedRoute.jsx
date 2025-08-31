import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * ProtectedRoute ensures that a user is logged in before accessing a route.
 * If not logged in, it redirects to the /register page.
 * It also stores the intended path so that after login,
 * the user is redirected back to where they wanted to go.
 *
 * @param {React.ReactNode} children - The component(s) to render if user is logged in
 */
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("jwtToken"); // check token instead of just email
  const location = useLocation();

  // If user is not logged in
  if (!user) {
    // Save the page user was trying to visit
    localStorage.setItem("redirectPath", location.pathname);

    // Redirect to register (or login)
    return <Navigate to="/register" replace />;
  }

  // If no children provided, show fallback
  if (!children) {
    return <div>You are authorized but nothing to display.</div>;
  }

  return children;
};

export default ProtectedRoute;
