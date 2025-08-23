// useRedirectWithLoader.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useRedirectWithLoader = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const redirect = (path, delay = 1500) => {
    setLoading(true);

    // Wait for delay, then navigate
    setTimeout(() => {
      navigate(path, { state: { showLoader: true } }); // pass loader state to next page
      setLoading(false); // hide loader in current page
    }, delay);
  };

  return { loading, redirect };
};
