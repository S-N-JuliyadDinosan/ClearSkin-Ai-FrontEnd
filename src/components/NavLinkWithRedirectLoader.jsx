import React, { useState } from "react";
import { useRedirectWithLoader } from "./useRedirectWithLoader";
import Loader from "./Loader";

const NavLinkWithRedirectLoader = ({
  to,
  children,
  delay = 1000,
  isActive = false,
  className, // accept custom styles
}) => {
  const { redirect, loading } = useRedirectWithLoader();
  const [localLoading, setLocalLoading] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setLocalLoading(true);
    redirect(to, delay, () => setLocalLoading(false));
  };

  const showLoader = loading || localLoading;

  return (
    <>
      {showLoader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 transition-opacity duration-500">
          <Loader />
        </div>
      )}

      <button
        onClick={handleClick}
        className={className ? className : `flex items-center px-4 py-2 text-sm font-medium rounded-md w-full text-left ${isActive ? "bg-blue-700 text-white" : "hover:bg-blue-700 text-white"}`}
      >
        {children}
      </button>
    </>
  );
};

export default NavLinkWithRedirectLoader;
