import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useRedirectWithLoader() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * Smooth redirect or run callback
   * @param {string|null} path - Path to redirect
   * @param {number} delay - delay before executing
   * @param {function|null} callback - optional callback
   */
  const redirect = (path = null, delay = 400, callback = null) => {
    setLoading(true);

    // Start fade-out effect before redirect/callback
    setTimeout(() => {
      if (callback) callback(); // run action first (like fetch)
      if (path) navigate(path); // navigate smoothly
    }, delay);

    // Allow loader to fade out after short extra delay
    setTimeout(() => setLoading(false), delay + 200);
  };

  return { loading, redirect };
}
