import React from 'react';
import '../App.css'; // Make sure your loader CSS is here

const Loader = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
      <div className="loader"></div>
    </div>
  );
};

export default Loader;
