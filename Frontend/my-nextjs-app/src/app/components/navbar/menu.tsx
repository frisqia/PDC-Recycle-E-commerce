'use client';
import Head from 'next/head';
import Link from 'next/link';
import React, { useState } from "react";


export default function MenuNav() {
    const [selectedOption, setSelectedOption] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);

    if (selectedValue) {
      window.location.href = selectedValue;
    }
  };
  return (
    <>
    <Head>
      <title>Menu Section</title>
    </Head>
    <div className='text-custom-Olive-Drab'>
         <Link href="#" className="p-2 border border-gray-300 rounded">
          Home
        </Link>
        <select
          value={selectedOption}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">Baby, Child & Toys</option>
          <option value="#">Toys & Gift</option>
        </select>
        <select
          value={selectedOption}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">Fashion</option>
          <option value="#">Accesoris</option>
          <option value="#">Bags</option>
          <option value="#">Coats & Jacket</option>
          <option value="#">Dresses & Skirts</option>
          <option value="#">Knitewear</option>
          <option value="#">Tops</option>
        </select>
        <select
          value={selectedOption}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">Jwellery & Watches</option>
          <option value="#">Bracelets</option>
          <option value="#">Earings</option>
          <option value="#">Necklackes</option>
          <option value="#">Rings</option>
          <option value="#">Watches</option>
        </select>
        <select
          value={selectedOption}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">Footwear</option>
          <option value="#">Women</option>
          <option value="#">Men</option>
        </select>
        <select
          value={selectedOption}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">Home & Garden</option>
          <option value="#">Bed & Bath</option>
          <option value="#">Garden & Outdoor</option>
          <option value="#">Kitchen & Dining</option>
          <option value="#">Living</option>
        </select>
        <select
          value={selectedOption}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">Gift Guide</option>
          <option value="#">Fer Her</option>
          <option value="#">For Him</option>
          <option value="#">For Kids</option>
        </select>
    </div>
    </>
  );
}
