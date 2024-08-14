'use client';
import React from "react";

export default function FilterSearch() {
  return (
    <>
      <div className="grid">
        <p className="px-10">FILTER</p>

        {/* Location Filter */}
        <label className="px-10">Location</label>
        <div className="px-10 grid grid-cols-3 gap-1 md:grid-cols-6 lg:grid-cols-9 lg:text-xs">
          {[
            "JABODETABEK",
            "DKI JAKARTA",
            "JAKARTA TIMUR",
            "JAKARTA BARAT",
            "JAKARTA PUSAT",
            "JAKARTA UTARA",
            "JAKARTA SELATAN",
            "BALI",
            "BANGKA BELITUNG",
            "JAWA TENGAH",
            "DI.YOGYAKARTA",
            "JAWA BARAT",
            "KOTA BANDUNG",
            "BEKASI",
            "KAB.BEKASI",
            "KAB.KARAWANG",
            "KOTA.BOGOR",
            "TANGERANG",
            "KOTA.DEPOK",
            "KOTA.CILEGON",
            "JAWA TIMUR",
            "KALIMANTAN SELATAN",
            "KALIMANTAN TIMUR",
            "JAMBI",
            "GORONTALO",
            "KEPULAUAN SERIBU",
            "LAMPUNG",
            "MALUKU",
            "MALUKU UTARA",
          ].map((location) => (
            <button
              key={location}
              type="button"
              className="search-button text-custom-green border border-custom-green p-1 bg-custom-pastel-green text-xs"
            >
              {location}
            </button>
          ))}
        </div>

        {/* Tipe Penjual */}
        <label className="px-10">Tipe Penjual</label>
        <div className="px-10 grid grid-cols-3 gap-1 md:grid-cols-6 lg:grid-cols-9 lg:text-xs">
          {["Mall", "Star", "Star +"].map((type) => (
            <button
              key={type}
              type="button"
              className="search-button text-custom-green border border-custom-green p-1 bg-custom-pastel-green text-xs"
            >
              {type}
            </button>
          ))}
        </div>

        {/* Payment Method */}
        <label className="px-10">Payment Method</label>
        <div className="px-10 grid grid-cols-3 gap-1 md:grid-cols-6 lg:grid-cols-9 lg:text-xs">
          {["COD", "CICILAN"].map((method) => (
            <button
              key={method}
              type="button"
              className="search-button text-custom-green border border-custom-green p-1 bg-custom-pastel-green text-xs"
            >
              {method}
            </button>
          ))}
        </div>

        {/* Delivery Option */}
        <label className="px-10">Delivery Option</label>
        <div className="px-10 grid grid-cols-3 gap-1 md:grid-cols-6 lg:grid-cols-9 lg:text-xs">
          {[
            "INSTANT",
            "REGULER",
            "HEMAT",
            "SAMEDAY",
            "KARGO",
            "NEXT DAY",
            "INSTANT CAR",
            "AMBIL DI TEMPAT",
          ].map((option) => (
            <button
              key={option}
              type="button"
              className="search-button text-custom-green border border-custom-green p-1 bg-custom-pastel-green text-xs"
            >
              {option}
            </button>
          ))}
        </div>

        {/* Promo Program */}
        <label className="px-10">PROMO PROGRAM</label>
        <div className="px-10 grid grid-cols-3 gap-1 md:grid-cols-6 lg:grid-cols-9 lg:text-xs">
          {[
            "CASHBACK",
            "FREE DELIVERY",
            "DISCOUNT",
            "GROSIR",
            "READY STOCK",
            "TERMURAH",
          ].map((promo) => (
            <button
              key={promo}
              type="button"
              className="search-button text-custom-green border border-custom-green p-1 bg-custom-pastel-green text-xs"
            >
              {promo}
            </button>
          ))}
        </div>

        {/* Price Range */}
        <label className="px-10">PRICE</label>
        <div className="px-10 flex items-center space-x-2">
          {/* Adjusted input and button styles */}
          <input
            type="number"
            placeholder="MIN"
            className="border p-1 text-xs"
          />
          <input
            type="number"
            placeholder="MAX"
            className="border p-1 text-xs"
          />
        </div>
        <div className="px-10 grid grid-cols-3 gap-1 md:grid-cols-6 lg:grid-cols-9 lg:text-xs">
          {["0-75K", "75-150K", "150-200K"].map((range) => (
            <button
              key={range}
              type="button"
              className="search-button text-custom-green border border-custom-green p-1 bg-custom-pastel-green text-xs"
            >
              {range}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
