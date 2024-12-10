// Layout.js
import React from 'react';
import Navbar from './navbar'; // Import the Navbar component

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar /> {/* Navbar will be rendered once here */}
      <div>{children}</div> {/* Content of the current page will be rendered here */}
    </div>
  );
};

export default Layout;
