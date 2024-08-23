"use client";
import React, { FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function SearchNav() {
  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchValue = (e.target as HTMLFormElement).search.value.trim();

    if (searchValue) {
      router.push(`/product?search=${encodeURIComponent(searchValue)}`);
    } else {
      console.log("Search value is empty");
    }
  };

  return (
    <div className="p-10">
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          placeholder="Search"
          name="search"
          className="search-input p-2 border border-gray-300 rounded w-full"
        />
        <button
          type="submit"
          className="search-button ml-2 bg-custom-green text-white px-4 py-2 rounded hover:bg-custom-green/80 transition duration-300"
        >
          <i className="fa fa-search"></i>
        </button>
      </form>
    </div>
  );
}
