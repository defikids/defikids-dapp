import React, { useEffect, useState } from "react";
import LogoNavbar from "./logo_navbar";
import { useStore } from "../services/store";

const Navbar: React.FC = () => {
  const {
    state: { wallet, loggedIn, logout },
  } = useStore();

  const [auth, setAuth] = useState(false);

  useEffect(() => {
    setAuth(true);
  }, []);

  const handleLogoutClick = async () => {
    logout();
  };

  return (
    <div className="flex justify-between text-blue-dark">
      <div className="flex">
        <LogoNavbar />
      </div>
      <div className="flex items-center">
        {loggedIn && auth && (
          <div className="flex items-center">
            <p className="mr-4 pt-0.5">Wallet: {wallet}</p>
            <a className="text-blue-dark text-md" onClick={handleLogoutClick}>
              Logout
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
