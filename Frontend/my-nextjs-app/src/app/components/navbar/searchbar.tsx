'use client';
import React, { FormEvent, useState } from "react";
import FilterSearch from "./filter";

interface SearchNavProps {
  isFilterMenuOpen: boolean;
  toggleFilterMenu: () => void;
}

export default function SearchNav({ isFilterMenuOpen, toggleFilterMenu }: SearchNavProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchValue = (e.target as HTMLFormElement).search.value;
    console.log("Searching for:", searchValue);
  };

  return (
    <div className="p-10">
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          placeholder="Search"
          name="search"
          className="search-input p-2 border border-gray-300 rounded"
        />
        <button type="submit" className="search-button ml-2 bg-custom-green text-white px-4 py-2 rounded hover:bg-custom-green/80 transition duration-300">
          <i className="fa fa-search"></i>
        </button>
        <button
          type="button"
          className="search-button text-custom-green px-4 py-2 text-5xl hover:text-custom-green/80 transition duration-300"
          onClick={toggleFilterMenu}
        >
          <i className="fa fa-sliders"></i>
        </button>
      </form>
      {isFilterMenuOpen && (
        <div className="flex flex-col items-center space-x-4 mt-4 overflow-y-auto max-h-64">
          <FilterSearch />
        </div>
      )}
    </div>
  );
}
