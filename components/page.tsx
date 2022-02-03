import React from "react";
import Navbar from "./navbar";

const Page: React.FC = ({ children }) => (
  <div>
    <Navbar />
    <div>{children}</div>
  </div>
);

export default Page;
