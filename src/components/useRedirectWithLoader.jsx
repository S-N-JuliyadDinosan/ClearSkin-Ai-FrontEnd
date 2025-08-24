import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useRedirectWithLoader() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * Redirect or run a callback with loader
   * @param {string|null} path - Path to redirect, or null if only running a callback
   * @param {number} delay - Delay in ms before redirect/callback
   * @param {function|null} callback - Function to run after delay
   */
  const redirect = (path = null, delay = 1200, callback = null) => {
    setLoading(true);

    setTimeout(() => {
      if (path) {
        navigate(path); // navigate to route
      }
      if (callback) {
        callback(); // run pagination or other action
      }
      setLoading(false);
    }, delay);
  };

  return { loading, redirect };
}
