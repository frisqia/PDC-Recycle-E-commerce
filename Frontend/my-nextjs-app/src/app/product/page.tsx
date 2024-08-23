"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Loading from "../components/loading/loading";
import NavbarPage from "../components/navbar";
import FooterDash from "../components/footer";
import SortProduct from "./sort";
import { instance } from "@/utils/auth";
instance

interface Product {
  id: number;
  description: string;
  image_url: {
    id: number;
    image_public_id: string;
    image_secure_url: string;
    product_id: number;
  }[];
  name: string;
  price: number;
  avg_rating: number;
  category_id: number;
  seller_info: {
    store_district: string;
    province_id: number;
  };
  sold_qty: number;
}

interface ApiResponse {
  current_page: number;
  products: Product[];
  total_items: number;
  total_page: number;
}

interface Province {
  province: string;
  id: number;
}

interface Category {
  category_name: string;
  id: number;
}
export default function ProductPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allProvince, setAllProvince] = useState<Province[]>([]);
  const [allCategory, setAllCategory] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [sortRating, setSortRating] = useState<"asc" | "desc" | "rating">(
    "rating"
  );
  const [sortPrice, setSortPrice] = useState<"asc" | "desc" | "price">("price");
  const [sortDate, setSortDate] = useState<"newest" | "oldest" | "date">(
    "date"
  );

  const [showAllProvinces, setShowAllProvinces] = useState(false);
  const [showAllCategory, setShowAllCategory] = useState(false);

  useEffect(() => {
    async function fetchAllData(page: number) {
      try {
        const queryParams = new URLSearchParams({
          price: sortPrice,
          date: sortDate,
          rating: sortRating,
          page: page.toString(),
          per_page: "100",
          province_id: selectedProvince?.toString() || "",
          category_id: selectedCategory?.toString() || "",
        });

        const res = await fetch(
          `http://127.0.0.1:5000/api/products/user/query?${queryParams.toString()}`
        );
        if (!res.ok) throw new Error("Failed to fetch products");

        const data: ApiResponse = await res.json();

        const prov = await fetch(
          `http://127.0.0.1:5000/api/locations/provinces`
        );
        if (!prov.ok) throw new Error("Failed to fetch provinces");

        const provData = await prov.json();
        const cat = await fetch(`http://127.0.0.1:5000/api/categories`);

        if (!cat.ok) throw new Error("Failed to fetch categories");

        const catData = await cat.json();

        setAllCategory(catData);

        setAllProvince(provData);
        setAllProducts(data.products);
        setTotalPages(data.total_page);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Error loading products");
      } finally {
        setLoading(false);
      }
    }

    fetchAllData(currentPage);
  }, [
    currentPage,
    sortPrice,
    sortDate,
    sortRating,
    selectedProvince,
    selectedCategory,
  ]);


  if (loading) return <Loading />;
  if (error) return <main>{error}</main>;
  

  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory = selectedCategory
      ? product.category_id === selectedCategory
      : true;
    return (
      matchesCategory &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPaginationNumbers = () => {
    const numbers = [];
    const maxPagesToShow = 5;
    const delta = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(currentPage - delta, 1);
    let endPage = Math.min(currentPage + delta, totalPages);

    if (endPage - startPage < maxPagesToShow - 1) {
      if (startPage === 1) {
        endPage = Math.min(maxPagesToShow, totalPages);
      } else if (endPage === totalPages) {
        startPage = Math.max(totalPages - maxPagesToShow + 1, 1);
      }
    }

    if (startPage > 1) {
      numbers.push(1);
      if (startPage > 2) {
        numbers.push("...");
      }
    }

    for (let page = startPage; page <= endPage; page++) {
      numbers.push(page);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        numbers.push("...");
      }
      numbers.push(totalPages);
    }

    return numbers;
  };

  const paginationNumbers = getPaginationNumbers();

  return (
    <>
      <NavbarPage />
      <div className="pt-[25vh] md:pt[40vh] lg:pt-[30vh] bg-custom-light-blue">
        <div className="flex flex-col md:flex-row justify-center p-10 gap-10">
          <div className="bg-white h-full w-50 p-2 grid gap-2 text-custom-Gunmetal rounded-lg">
            <h1>Filter Location</h1>
            {allProvince
              .slice(0, showAllProvinces ? undefined : 5)
              .map((province) => (
                <button
                  key={province.id}
                  type="button"
                  id={`province-${province.id}`}
                  className={`p-2 text-xs rounded ${
                    selectedProvince === province.id
                      ? "bg-custom-steel-blue text-white"
                      : "bg-custom-light-blue text-custom-steel-blue"
                  }`}
                  onClick={() => setSelectedProvince(province.id)}
                >
                  {province.province}
                </button>
              ))}
            <button
              type="button"
              className={`text-white px-4 rounded mt-2 ${
                showAllProvinces ? "bg-gray-500" : "bg-custom-steel-blue"
              }`}
              onClick={() => setShowAllProvinces(!showAllProvinces)}
            >
              {showAllProvinces ? "Hide" : "Show More"}
            </button>

            <h1>Filter Category</h1>
            {allCategory
              .slice(0, showAllCategory ? undefined : 5)
              .map((category) => (
                <button
                  key={category.id}
                  type="button"
                  id={`category-${category.id}`}
                  className={`p-2 text-xs rounded ${
                    selectedCategory === category.id
                      ? "bg-custom-steel-blue text-white"
                      : "bg-custom-light-blue text-custom-steel-blue"
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.category_name}
                </button>
              ))}

            <button
              type="button"
              className={`text-white px-4 rounded mt-2 ${
                showAllCategory ? "bg-gray-500" : "bg-custom-steel-blue"
              }`}
              onClick={() => setShowAllCategory(!showAllCategory)}
            >
              {showAllCategory ? "Hide" : "Show More"}
            </button>

            {(selectedProvince || selectedCategory !== null) && (
              <button
                type="button"
                className="bg-gray-500 text-white px-4 rounded mt-2"
                onClick={() => {
                  setSelectedProvince(null);
                  setSelectedCategory(null);
                }}
              >
                Reset Filter
              </button>
            )}
          </div>

          <div className="flex-1">
            <SortProduct
              sortRating={sortRating}
              sortPrice={sortPrice}
              sortDate={sortDate}
              onSortRatingChange={(value) => {
                setSortRating(value);
                setCurrentPage(1);
              }}
              onSortPriceChange={(value) => {
                setSortPrice(value);
                setCurrentPage(1);
              }}
              onSortDateChange={(value) => {
                setSortDate(value);
                setCurrentPage(1);
              }}
            />
            <div className="grid bg-white rounded-b-lg shadow-lg">
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <Link
                        href={`/product/detail-product?id=${product.id}`}
                        key={product.id}
                      >
                        <div className="bg-white shadow-md rounded-lg overflow-hidden transition-transform duration-500 hover:scale-105">
                          <img
                            src={product.image_url[0].image_secure_url}
                            className="w-full h-[200px] object-cover"
                            alt={product.name}
                            loading="lazy"
                          />
                          <div className="p-4">
                            <h2 className="text-sm font-bold mb-2">
                              {product.name}
                            </h2>
                            <p className="text-gray-700 text-sm">
                              Rp.{product.price}
                            </p>
                            <p className="text-gray-500 text-xs">
                              ⭐ {product.avg_rating} ({product.sold_qty} sold)
                              <p className="text-xs">
                                📌 {product.seller_info.store_district}
                              </p>
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="col-span-2 text-center text-gray-700">
                      No products found
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-2 py-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-custom-steel-blue text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Previous
              </button>
              {paginationNumbers.map((number, index) =>
                typeof number === "number" ? (
                  <button
                    key={index}
                    onClick={() => handlePageChange(number)}
                    className={`px-4 py-2 rounded ${
                      currentPage === number
                        ? "bg-custom-steel-blue text-white"
                        : "bg-gray-300"
                    }`}
                  >
                    {number}
                  </button>
                ) : (
                  <span key={index} className="px-4 py-2">
                    ...
                  </span>
                )
              )}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="bg-custom-steel-blue text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      <FooterDash />
    </>
  );
}
