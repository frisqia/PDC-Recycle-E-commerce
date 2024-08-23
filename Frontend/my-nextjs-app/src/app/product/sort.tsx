"use client";
import React from "react";

interface SortProductProps {
  sortRating: string;
  sortPrice: string;
  sortDate: string;
  onSortRatingChange: (value: "asc" | "desc" | "rating") => void;
  onSortPriceChange: (value: "asc" | "desc" | "price") => void;
  onSortDateChange: (value: "newest" | "oldest" | "date") => void;
}

export default function SortProduct({
  sortRating,
  sortPrice,
  sortDate,
  onSortRatingChange,
  onSortPriceChange,
  onSortDateChange,
}: SortProductProps) {
  return (
    <div className="flex gap-4 justify-between bg-white p-4 text-custom-Olive-Drab rounded-t-lg">
      <div className="flex-1">
        <select
          id="rating-sort"
          className="bg-custom-light-blue w-full p-2 rounded"
          value={sortRating}
          onChange={(e) =>
            onSortRatingChange(e.target.value as "asc" | "desc" | "rating")
          }
        >
          <option value="rating" disabled>
            Rating
          </option>
          <option value="asc">Rating Terendah</option>
          <option value="desc">Rating tertinggi</option>
        </select>
      </div>

      <div className="flex-1">
        <select
          id="price-sort"
          className="bg-custom-light-blue w-full p-2 rounded"
          value={sortPrice}
          onChange={(e) =>
            onSortPriceChange(e.target.value as "asc" | "desc" | "price")
          }
        >
          <option value="price" disabled>
            Price
          </option>
          <option value="asc">Harga Terendah</option>
          <option value="desc">Harga Tertinggi</option>
        </select>
      </div>

      <div className="flex-1">
        <select
          id="date-sort"
          className="bg-custom-light-blue w-full p-2 rounded"
          value={sortDate}
          onChange={(e) =>
            onSortDateChange(e.target.value as "newest" | "oldest" | "date")
          }
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
    </div>
  );
}
