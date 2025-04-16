import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ReqOTP from "./pages/ReqOTP";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import SignupValidation from "./auth/SignupValidation";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./components/Dashboard";
import Device from "./pages/dashboard/device";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        {/* <Route path="/about" element={<About />} /> */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/req-otp" element={<ReqOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Device" element={<Device />} />
        <Route path="/sign-up/verify/:otp" element={<SignupValidation />} />
      </Routes>
    </BrowserRouter>
  );
}