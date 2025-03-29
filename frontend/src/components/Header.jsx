import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

export default function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/sign-in");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="bg-white shadow-md fixed top-0 w-full z-10">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-4">
        <Link to="/">
          <h1 className="font-bold text-lg sm:text-2xl flex items-center">
            <span className="text-blue-500">F</span>
            <span className="text-gray-900">MS</span>
          </h1>
        </Link>

        <nav className="flex justify-between w-full ml-8">
          <ul className="flex gap-6">
            <li>
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-500 transition-colors duration-300 text-xs"
              >
                Home
              </Link>
            </li>
            <li>
              {/* <Link
                to="/about"
                className="text-gray-700 hover:text-blue-500 transition-colors duration-300 text-xs"
              >
                About
              </Link> */}
            </li>
          </ul>

          <ul className="flex gap-6">
            {token ? (
              <>
                <li className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="text-gray-700 hover:text-blue-500 transition-colors duration-300 text-xs flex items-center"
                  >
                    <FaUserCircle size={24} />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Dashboard
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/sign-up"
                    className="text-gray-700 hover:text-blue-500 transition-colors duration-300 text-xs"
                  >
                    Signup
                  </Link>
                </li>
                <li>
                  <Link
                    to="/sign-in"
                    className="text-gray-700 hover:text-blue-500 transition-colors duration-300 text-xs"
                  >
                    Sign in
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
