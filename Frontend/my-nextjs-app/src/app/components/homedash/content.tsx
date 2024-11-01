"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import Loading from "../loading/loading";
import Link from "next/link";

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
  sold_qty: number;
  avg_rating: number;
  seller_info: {
    store_district: string;
  };
}

interface ApiResponse {
  current_page: number;
  products: Product[];
  total_items: number;
  total_page: number;
}

export default function CatalogDashboard() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productsToShow, setProductsToShow] = useState(8);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchProducts(page: number) {
      try {
        const res = await fetch(
          `http://127.0.0.1:5000/api/products/user/query?page=${page}&per_page=12`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        const data: ApiResponse = await res.json();

        setAllProducts((prevProducts) => [...prevProducts, ...data.products]);

        if (data.products.length < 8 || allProducts.length >= 100) {
          setShowAllProducts(true);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Error loading products");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts(currentPage);
  }, [currentPage]);

  const handleShowMoreProducts = () => {
    setProductsToShow((prev) => Math.min(prev + 8, 100));
    if (productsToShow >= allProducts.length && !showAllProducts) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleHideProducts = () => {
    setProductsToShow(8);
    setShowAllProducts(false);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <main>{error}</main>;
  }

  return (
    <>
      <Head>
        <title>Recommendation Product</title>
      </Head>
      <div className="grid">
        <h1 className="text-center font-bold text-2xl mb-6 text-custom-Olive-Drab">
          RECOMMENDATION PRODUCT
        </h1>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allProducts.slice(0, productsToShow).map((product) => (
              <Link
                href={`/product/detail-product?id=${product.id}`}
                key={product.id}
              >
                <div className="bg-white shadow-md rounded-lg overflow-hidden transition-transform duration-500 hover:scale-105">
                  <img
                    src={product.image_url[0].image_secure_url}
                    alt={product.name}
                    className="w-full h-[20vh] md:h-[23vh] lg:h-[25vh] object-cover"
                    loading="lazy"
                  />
                  <div className="p-1 grid">
                    <h2 className="text-lg text-[10px] text-blaack font-bold">
                      {product.name}
                    </h2>
                    <p className="text-gray-700 text-[8px]">
                      Rp.{product.price}
                    </p>
                    <div className="flex justify-between text-gray-500 text-[8px]">
                      <p>⭐ ({product.avg_rating})</p>
                      <p>({product.sold_qty} sold)</p>
                    </div>
                    <p className="text-[8px] text-right">
                      📌 {product.seller_info.store_district}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            {!showAllProducts && (
              <button
                onClick={handleShowMoreProducts}
                className="bg-custom-Gunmetal text-white py-2 px-4 rounded-lg hover:bg-custom-Gunmetal/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              >
                Show More
              </button>
            )}
            {showAllProducts && (
              <button
                onClick={handleHideProducts}
                className="bg-custom-Gunmetal text-white  py-2 px-4 rounded-lg hover:bg-custom-Gunmetal/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              >
                Hide
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
