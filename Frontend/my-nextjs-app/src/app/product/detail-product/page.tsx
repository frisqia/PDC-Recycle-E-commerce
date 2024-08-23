"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import StarRating from "./customrate";
import Loading from "@/app/components/loading/loading";
import NavbarPage from "@/app/components/navbar";
import FooterDash from "@/app/components/footer";
import CatalogDashboard from "@/app/components/homedash/content";
import Link from "next/link";
import { instance, instanceWithAuth } from "@/utils/auth";


interface Review {
  rating: number;
  review: string;
  user_username: string;
}

interface Product {
  id: number;
  avg_rating: number | null;
  description: string;
  image_url: {
    id: number;
    image_public_id: string;
    image_secure_url: string;
    product_id: number;
  }[];
  name: string;
  price: number;
  reviews: Review[];
  seller_id: number;
  seller_info: {
    store_image_url: string;
    store_name: string;
    store_district: string;
  };
  sold_qty: number;
  stock: number;
  volume_m3: number;
  weight_kg: number;
}

export default function Test() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [quantityError, setQuantityError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewsToShow, setReviewsToShow] = useState(5);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleShowMoreReviews = () => {
    if (product) {
      const newReviewCount = Math.min(
        reviewsToShow + 5,
        product.reviews.length
      );
      setReviewsToShow(newReviewCount);
      if (newReviewCount === product.reviews.length) {
        setShowAllReviews(true);
      }
    }
  };

  const handleHideReviews = () => {
    setShowAllReviews(false);
    setReviewsToShow(5);
  };

  useEffect(() => {
    async function fetchProduct() {
      if (id) {
        try {
          const res = await fetch(
            `http://127.0.0.1:5000/api/products/user/product/${id}`
          );
          if (!res.ok) throw new Error("Failed to fetch product");
          const data = await res.json();
          setProduct(data);
        } catch (error) {
          console.error("Error fetching product:", error);
          setError("Error loading product");
        } finally {
          setLoading(false);
        }
      }
    }

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      const res = await instanceWithAuth.post(`carts/createupdate`, {
        items: [
          {
            product_id: product.id,
            quantity: quantity,
          },
        ],
      });
      if (res.status !== 200) throw new Error("Failed to add to cart");
      const result = res.data;
      setSuccessMessage("Success add to cart");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      setError(error.message || "Failed to add to cart");
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (product && newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
      setQuantityError(null);
    } else if (newQuantity < 1) {
      setQuantityError("This product's minimum quantity is 1 item");
    } else if (product && newQuantity > product.stock) {
      setQuantityError(
        `Maximum quantity to purchase this item is ${product.stock} items`
      );
    }
  };

  const handleQuantityInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (!isNaN(newQuantity)) {
      handleQuantityChange(newQuantity);
    }
  };

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? (product?.image_url.length || 1) - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === (product?.image_url.length || 1) - 1 ? 0 : prevIndex + 1
    );
  };

  if (loading) return <Loading />;
  if (error) return <main>{error}</main>;

  return (
    <>
      <style jsx>
        {`
          .no-spinner::-webkit-outer-spin-button,
          .no-spinner::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }

          .no-spinner {
            -moz-appearance: textfield;
          }

          table {
            border-collapse: collapse;
            width: 100%;
          }

          th,
          td {
            border: 1px solid #ddd;
            padding: 8px;
          }

          th {
            text-align: left;
            font-weight: bold;
          }

          td {
            font-weight: normal;
          }
        `}
      </style>

      <NavbarPage />
      <div className="bg-custom-light-blue h-full">
        <div className="px-[5vw] md:px-[10vw] lg:px-[10vw] pt-[30vh] md:pt-[38vh] lg:pt-[45vh] pb-[10vh] flex justify-center items-center">
          <div className="grid grid-cols-1 w-full max-w-9xl md:max-w-7xl items-center justify-center">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 p-2 md:p-10 bg-white border-lg rounded-t-lg shadow-lg">
              <div className="relative">
                <div className="flex justify-center overflow-hidden p-10">
                  {product?.image_url.length && (
                    <>
                      <button
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-full"
                        onClick={handlePrevImage}
                      >
                        &lt;
                      </button>
                      <div
                        className="flex justify-center"
                        onClick={() => openModal(currentImageIndex)}
                      >
                        <img
                          src={
                            product.image_url[currentImageIndex]
                              .image_secure_url
                          }
                          alt={product.name}
                          className="object-cover cursor-pointer"
                          style={{ width: "400px", height: "400px" }}
                        />
                      </div>
                      <button
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-full"
                        onClick={handleNextImage}
                      >
                        &gt;
                      </button>
                    </>
                  )}
                </div>
                <div className="flex justify-center">
                  {product?.image_url.map((image, index) => (
                    <img
                      key={index}
                      src={image.image_secure_url}
                      alt={`Thumbnail ${index}`}
                      className={`cursor-pointer mx-1 ${
                        index === currentImageIndex
                          ? "border-2 border-blue-500"
                          : ""
                      }`}
                      style={{ width: "70px", height: "70px" }}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col font-sans ">
                <div className="divide-y">
                  <h1 className="text-3xl mb-4 font-bold px-5">
                    {product?.name}
                  </h1>
                  <p className="mb-4 text-4xl font-bold px-5">
                    Rp.{product?.price}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-5">
                  <div className="flex items-center mb-4">
                    <button
                      className={`px-2 py-1 bg-gray-300 text-black w-8 h-8 flex items-center justify-center ${
                        quantity <= 1 ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={() =>
                        handleQuantityChange(Math.max(quantity - 1, 1))
                      }
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      className="w-16 mx-2 text-center border border-gray-300 rounded-md py-1 px-2 no-spinner"
                      type="number"
                      value={quantity}
                      onChange={handleQuantityInputChange}
                      min="1"
                      max={product?.stock}
                    />
                    <button
                      className={`px-2 py-1 bg-gray-300 text-black w-8 h-8 flex items-center justify-center ${
                        quantity >= (product?.stock || 0)
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() =>
                        handleQuantityChange(
                          Math.min(quantity + 1, product?.stock || 0)
                        )
                      }
                      disabled={quantity >= (product?.stock || 0)}
                    >
                      +
                    </button>
                    <p className="mb-4 p-5"> stock {product?.stock}</p>
                  </div>
                </div>
                {quantityError && (
                  <p className="text-red-500">{quantityError}</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-6 text-center text-white rounded">
                  <button
                    className="w-full bg-custom-green rounded"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </button>
                </div>
                {successMessage && (
                  <p className="text-red-500 mt-2">{successMessage}</p>
                )}
                <div className="pt-4 px-5">
                  <table>
                    <thead>
                      <tr>
                        <th>Sold</th>
                        <th>Volume</th>
                        <th>Weight</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{product?.sold_qty} pcs</td>
                        <td>{product?.volume_m3} m³</td>
                        <td>{product?.weight_kg} kg</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="flex pt-2 px-8 gap-2 items-center">
                  <img
                    src={product?.seller_info.store_image_url}
                    alt={product?.seller_info.store_name}
                    className="w-[80px] h-[80px] rounded-full"
                  />
                  <div className="grid">
                    <strong>{product?.seller_info.store_name}</strong>

                    <Link
                      href={`/seller-profile/${product?.seller_id}`}
                      key={product?.seller_id}
                      className=" hover:text-gray-200 p-1 rounded flex gap-2 border"
                    >
                      <i className="material-icons">store</i>
                      view store
                    </Link>
                  </div>
                </div>
                <div className="py-4 ">
                  <p className="text-2xl mb-2 bg-gray-100 px-5 md:px-10">
                    Description
                  </p>
                  <p className="px-5 md:px-10">{product?.description}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center pt-4 ">
              <div className="bg-white border-lg shadow-lg p-10 max-w-7xl w-full">
                <h2 className="text-xl font-bold mb-2">Reviews</h2>
                {!product || !product.reviews ? (
                  <p>No reviews yet</p>
                ) : product.reviews.length === 0 ? (
                  <p>No reviews yet</p>
                ) : (
                  <>
                    {product.reviews
                      .slice(0, reviewsToShow)
                      .map((review, index) => (
                        <div
                          key={index}
                          className="border-b-2 border-gray-200 py-2"
                          style={{ marginTop: "10px" }}
                        >
                          <div className="flex items-center">
                            <strong>{review.user_username}</strong>{" "}
                            <StarRating rating={review.rating} />
                          </div>
                          <p>
                            <strong>Review:</strong> {review.review}
                          </p>
                        </div>
                      ))}
                    {showAllReviews ? (
                      <button
                        onClick={handleHideReviews}
                        className="mt-4 text-blue-500 hover:text-blue-700"
                      >
                        Hide
                      </button>
                    ) : (
                      product.reviews.length > 5 && (
                        <button
                          onClick={handleShowMoreReviews}
                          className="mt-4 text-blue-500 hover:text-blue-700"
                        >
                          Show more
                        </button>
                      )
                    )}
                  </>
                )}
              </div>
            </div>
            {isModalOpen && product && (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                <div className="relative p-4 rounded">
                  <button
                    className="absolute top-2 right-2 text-xl font-bold"
                    onClick={closeModal}
                  >
                    <i className="fa fa-close bg-red-800 p-2 text-white rounded-lg hover:bg-red-400">
                      Close
                    </i>
                  </button>
                  <button
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-full"
                    onClick={handlePrevImage}
                  >
                    &lt;
                  </button>
                  <img
                    src={product.image_url[currentImageIndex].image_secure_url}
                    alt={product.image_url[currentImageIndex].image_public_id}
                    className="object-cover"
                    style={{ maxWidth: "70vw", maxHeight: "50vh" }}
                  />
                  <button
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-full"
                    onClick={handleNextImage}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-center pt-4 ">
              <div className="bg-white border-lg shadow-lg rounded-b-lg p-10 max-w-7xl w-full flex items-center justify-center">
                <div className="max-w-3xl w-full">
                  <CatalogDashboard />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterDash />
    </>
  );
}
