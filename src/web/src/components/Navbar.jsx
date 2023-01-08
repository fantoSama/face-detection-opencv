import React, { useState } from "react";
import logo from "../assets/logo.png";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

function Navbar() {
  const [isMobil, SetIsMobil] = useState(false);

  const handleNav = () => {
    SetIsMobil(!isMobil);
    console.log(isMobil);
  };

  return (
    <div className="flex items-center justify-between h-40 max-w-[1240px] px-4 mx-auto">
      <img
        src={logo}
        alt="this is the logo of the site"
        className="h-full"
      ></img>

      <ul className="hidden md:flex">
        <li className="p-4 text-black bg-[#1bd4f1]  rounded">Get Started</li>
        <li className="p-4 text-[#1bd4f1]">Status</li>
        <li className="p-4 text-[#1bd4f1]">Terms of usage</li>
        <li className="p-4 text-[#1bd4f1]">About</li>
      </ul>

      <div onClick={handleNav} className="block md:hidden">
        {isMobil ? (
          <AiOutlineClose size={20}></AiOutlineClose>
        ) : (
          <AiOutlineMenu size={20}></AiOutlineMenu>
        )}
      </div>

      <div
        className={
          isMobil
            ? "fixed top-0 left-0 w-3/5 h-full border-r border-r-gray-900 ease-in-out duration-500 md:left-[-100%]"
            : "fixed left-[-100%]"
        }
      >
        <img
          src={logo}
          alt="this is the logo of the site"
          className="h-40 mx-auto w-50"
        ></img>
        <ul className="p-4 pt-12 text-center uppercase">
          <li className="p-4 text-black bg-[#1bd4f1]">Get Started</li>
          <li className="p-4 text-[#1bd4f1]">Status</li>
          <li className="p-4 text-[#1bd4f1]">Terms of usage</li>
          <li className="p-4 text-[#1bd4f1]">About</li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
