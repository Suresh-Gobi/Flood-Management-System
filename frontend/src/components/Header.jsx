import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
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
              <Link
                to="/about"
                className="text-gray-700 hover:text-blue-500 transition-colors duration-300 text-xs"
              >
                About
              </Link>
            </li>
          </ul>

          <ul className="flex gap-6">
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
          </ul>
        </nav>
      </div>
    </header>
  );
}
