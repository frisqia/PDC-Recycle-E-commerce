"use client";
import React, { useState } from "react";
import LOGO from "../../asset/LOGO.png";
import Image from "next/image";
import SearchNav from "./searchbar";
import MenuNav from "./menu";
import Head from "next/head";

export default function NavbarPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false); // Tambahkan state ini

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleFilterMenu = () => setIsFilterMenuOpen(!isFilterMenuOpen);

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
          <div className="hidden md:flex items-center space-x-4 hover:bg-white ">
            <SearchNav
              isFilterMenuOpen={isFilterMenuOpen}
              toggleFilterMenu={toggleFilterMenu}
            />
          </div>
          {!isFilterMenuOpen && (
            <div className="hidden md:flex items-center space-x-4">
              <button className="bg-custom-green text-white px-4 py-2 rounded hover:bg-custom-green/80 transition duration-300">
                Login/Register
              </button>
              <button className="bg-custom-green text-white px-4 py-2 rounded hover:bg-custom-green/80 transition duration-300">
                <i className="fa fa-shopping-cart"></i>
              </button>
            </div>
          )}
          <button
            className="md:hidden flex items-center justify-center bg-custom-green text-white p-2 rounded hover:bg-custom-green/80 transition duration-300"
            onClick={toggleMenu}
          >
            <i className="fa fa-bars"></i>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-md absolute top-full left-0 w-full p-5 ">
            <SearchNav
              isFilterMenuOpen={isFilterMenuOpen}
              toggleFilterMenu={toggleFilterMenu}
            />
            <button className="w-full bg-custom-green text-white py-2 rounded mt-2 hover:bg-custom-green/80 transition duration-300">
              Login/Register
            </button>
            <button className="w-full bg-custom-green text-white py-2 rounded mt-2 hover:bg-custom-green/80 transition duration-300">
              <i className="fa fa-shopping-cart"></i> Cart
            </button>
            <div className="grid justify-center">
              <MenuNav />
            </div>
          </div>
        )}
        <div className="flex justify-center hidden md:flex items-center space-x-4">
          <MenuNav />
        </div>
      </div>
    </>
  );
}
