import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaNetworkWired } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Safely get uploadedFilePath
  const user = localStorage.getItem("user");
  const uploaded = user ? JSON.parse(user).uploadedFilePath : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Optional: remove user info on logout
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-sky-800 via-cyan-700 to-teal-700 text-white shadow">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Brand */}
        <Link to="/" className="flex items-center space-x-2">
          <FaNetworkWired className="text-teal-200" size={24} />
          <span className="text-xl md:text-2xl font-bold tracking-wide">
            TIC Data Science Portal
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="px-3 py-1 rounded hover:bg-white/10 transition"
          >
            Home
          </Link>
          {token && (
            <>
              <Link
                to="/upload"
                className="px-3 py-1 rounded hover:bg-white/10 transition"
              >
                {uploaded ? "Reupload" : "Upload"}
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded hover:bg-white/10 transition"
              >
                Logout
              </button>
            </>
          )}
          {!token && (
            <>
              <Link
                to="/login"
                className="px-3 py-1 rounded hover:bg-white/10 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1 rounded hover:bg-white/10 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
