"use client";
import React, { useState } from "react";
import LOGO from "../../asset/LOGO.png";
import Image from "next/image";
import SearchNav from "./searchbar";
import Head from "next/head";
import NavCart from "./navcart";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function NavbarPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname(); 
  const router = useRouter(); 

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navigateToHome = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userAccessToken"); 
    router.push("/login");
  };

  const navigateToDashboard = () => {
    router.push("/users/dashboard"); 
  };

  const isOnUserDashboard = pathname === "/users/dashboard";
  const isUserLoggedIn = !!localStorage.getItem("userAccessToken");

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
      </Head>

      <div className="bg-white shadow-md fixed top-0 left-0 w-full p-5 z-50">
        <div className="flex justify-between items-center p-4 ">
          <div className="flex items-center space-x-4">
            <div className="grid">
              <Image src={LOGO} alt="logo" className="w-20 h-20" />
              <p className="text-custom-green font-bold">PDC RYCYCLE</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4 hover:bg-white">
            <SearchNav />
          </div>
          <div className="flex justify-center gap-3">
            <button
              className="md:hidden bg-custom-green text-white p-2 rounded hover:bg-custom-green/80 transition duration-300"
              onClick={navigateToHome}
            >
              <i className="fa fa-home"></i>
            </button>
            {isUserLoggedIn && !isOnUserDashboard && (
                <button
                  className="md:hidden bg-custom-green text-white px-4 py-2 rounded hover:bg-custom-green/80 transition duration-300"
                >
                  <i className="fa fa-user"></i>
                </button>
              )}
            <button
              className="md:hidden bg-custom-green text-white p-2 rounded hover:bg-custom-green/80 transition duration-300"
              onClick={toggleMenu}
            >
              <i className="fa fa-bars"></i>
            </button>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <button
              className="flex items-center justify-center bg-custom-green text-white p-3 rounded hover:bg-custom-green/80 transition duration-300"
              onClick={navigateToHome}
            >
              <i className="fa fa-home  "></i>
            </button>
            {pathname !== "/cart" && <NavCart />}
            {!isOnUserDashboard && isUserLoggedIn && (
              <button>
                <i onClick={navigateToDashboard} className="fa fa-user w-full bg-custom-green text-white p-3 rounded hover:bg-custom-green/80 transition duration-300 "></i>
              </button>
            )}
            {isUserLoggedIn ? (
              <button
                className="bg-custom-green text-white px-4 py-2 rounded hover:bg-custom-green/80 transition duration-300"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <a
                href="/login"
                className="bg-custom-green text-white px-4 py-2 rounded hover:bg-custom-green/80 transition duration-300"
              >
                Login/Register
              </a>
            )}
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-md absolute top-full left-0 w-full p-5 gap-10">
            <SearchNav />
            <div className="grid gap-2">
              {pathname !== "/cart" && <NavCart />}
          
              {isUserLoggedIn ? (
                <button
                  className="bg-custom-green text-white px-4 py-2 rounded hover:bg-custom-green/80 transition duration-300"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              ) : (
                <a
                  href="/login"
                  className="bg-custom-green text-white px-4 py-2 rounded hover:bg-custom-green/80 transition duration-300"
                >
                  Login/Register
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
