import React from "react";
import LogoNavbar from "./logo_navbar";

const Navbar: React.FC = () => {
  return (
    <div className="flex justify-between text-blue-dark mx-2">
      <div className="flex">
        <LogoNavbar />
      </div>
    </div>
  );
};

export default Navbar;
