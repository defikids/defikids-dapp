import React, { useEffect, useState } from "react";
import LogoNavbar from "./logo_navbar";
import { useStore } from "../services/store";

const Navbar: React.FC = () => {
  const {
    state: { wallet, loggedIn },
  } = useStore();

  const [auth, setAuth] = useState(false);

  useEffect(() => {
    setAuth(true);
  }, []);

  const handleLogoutClick = async () => {
    const Web3Auth = (await import("../services/web3auth")).default;
    Web3Auth.logout();
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
            <a
              className="bg-white text-blue-dark text-md"
              onClick={handleLogoutClick}
            >
              Logout
            </a>
          </div>
        )}
        <p className="text-md cursor-pointer ml-8">Contact us</p>
      </div>
    </div>
  );
};

export default Navbar;
