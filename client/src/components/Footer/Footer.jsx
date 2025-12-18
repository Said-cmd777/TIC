import React from "react";
import { FaNetworkWired } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-teal-700 via-cyan-700 to-sky-800 text-white py-6 mt-8">
      <div className="container mx-auto text-center space-y-2">
        <div className="flex justify-center items-center gap-2">
          <FaNetworkWired className="text-teal-200" />
          <p className="text-sm md:text-base font-medium">
            Information & Communication Technology • Data Science Portal
          </p>
        </div>
        <p className="text-xs opacity-80">
          &copy; {new Date().getFullYear()} TIC DS. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
