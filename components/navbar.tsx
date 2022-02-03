import React from "react";
import LogoNavbar from "./logo_navbar";

const Navbar: React.FC = () => (
  <div className="flex justify-between text-blue-dark">
    <div className="flex">
      <LogoNavbar />
    </div>
    <p className="text-md cursor-pointer">Contact us</p>
  </div>
);

export default Navbar;
