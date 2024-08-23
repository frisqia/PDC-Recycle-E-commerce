"use client";

import FooterDash from "@/app/components/footer";
import CatalogDashboard from "@/app/components/homedash/content";
import Loading from "@/app/components/loading/loading";
import NavbarPage from "@/app/components/navbar";
import accessToken from "@/app/token-sementara/config";
import { instance, instanceWithAuth } from "@/utils/auth";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

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

interface Profile {
  seller: {
    addresses: {
      district_id: number;
      district_name: string;
      is_active: number;
      postal_code: number;
      province_id: number;
      province_name: string;
    }[];
    id: number;
    store_description: string;
    store_image_url: string;
    store_name: string;
  };
}

interface Voucher {
  created_at: string;
  discount_type: number;
  expiry_date: string;
  id: number;
  is_active: number;
  max_discount_amount: number;
  min_purchase_amount: number;
  percentage: number;
  start_date: string;
  title: string;
  usage_limit: number;
}

export default function SellerInfo() {
  const [seller, setSeller] = useState<Profile | null>(null);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [claimedVouchers, setClaimedVouchers] = useState<number[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const saveClaimedVouchersToLocalStorage = (voucherIds: number[]) => {
    localStorage.setItem("claimedVouchers", JSON.stringify(voucherIds));
  };

  const loadClaimedVouchersFromLocalStorage = () => {
    const storedVouchers = localStorage.getItem("claimedVouchers");
    return storedVouchers ? JSON.parse(storedVouchers) : [];
  };

  const [startIndex, setStartIndex] = useState(0);
  const vouchersPerPage = 5;
  useEffect(() => {
    async function fetchSellerInfo() {
      const storedVouchers = loadClaimedVouchersFromLocalStorage();
      setClaimedVouchers(storedVouchers);

      if (id) {
        try {
          const res = await fetch(
            `http://127.0.0.1:5000/api/sellers/publicinfo/${id}`
          );
          if (!res.ok) throw new Error("Failed to fetch seller info");
          const data = await res.json();
          setSeller(data);

          const prodRes = await fetch(
            `http://127.0.0.1:5000/api/products/user/query?seller_id=${id}&page=${currentPage}&per_page=18`
          );
          if (!prodRes.ok) throw new Error("Failed to fetch product info");
          const prodData: ApiResponse = await prodRes.json();
          setAllProducts(prodData.products);
          setTotalPages(prodData.total_page);
          const vochRes = await fetch(
            `http://127.0.0.1:5000/api/sellervouchers/publiclist/${id}`
          );
          if (!vochRes.ok) throw new Error("Failed to fetch voucher data");
          const vocData = await vochRes.json();
          console.log(vocData, "vocher");
          setVouchers(vocData || []);

          // const res = await instance.get(`sellers/publicinfo/${id}`)
          // if(res.status !==200) throw new Error("Failed to fetch seller info")
          // const data = await res.data
          // setSeller(data)

          // const prodRes = await instance.get(`products/user/query?seller_id=${id}&page=${currentPage}&per_page=18`)
          // if(prodRes.status !==200) throw new Error("Failed to fetch product info");
          // const prodData:ApiResponse = await prodRes.data
          // setAllProducts(prodData.products);
          // setTotalPages(prodData.total_page);
          

          // const vocherRes = await instance.get(`sellervouchers/publiclist/${id}`)
          // if(vocherRes.status ! ==200) throw new Error("Failed to fetch voucher data");
          // const vocData = await vocherRes.data
          // setVouchers(vocData || [])

          
        } catch (error) {
          console.error("Error fetching data:", error);
          setError("Error loading seller and product info");
        } finally {
          setLoading(false);
        }
      }
    }

    fetchSellerInfo();
  }, [id, currentPage]);

  const handleClaimVoucher = async (voucherId: number) => {
    try {
      const response = await instanceWithAuth.post(`usersellervouchers/save/${voucherId}`)
      if (response.status ! === 200) {throw new Error("Failed to claim voucher"); }
      const result = await response.data
      console.log("Voucher claimed successfully:", result);

      const updatedClaimedVouchers = [...claimedVouchers, voucherId];
      setClaimedVouchers(updatedClaimedVouchers);
      saveClaimedVouchersToLocalStorage(updatedClaimedVouchers);
    } catch (error) {
      console.error("Error claiming voucher:", error);
    }
  };

  if (loading) return <Loading />;

  if (error) return <main>{error}</main>;

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

  const handlePrevVouchers = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - vouchersPerPage);
    }
  };

  const handleNextVouchers = () => {
    if (startIndex + vouchersPerPage < vouchers.length) {
      setStartIndex(startIndex + vouchersPerPage);
    }
  };

  return (
    <>
      <NavbarPage />
      <div className="py-[25vh] md:py-[30vh] lg:py-[35vh] px-[5vh] lg:px-[10vw] bg-custom-light-blue">
        <div className="flex justify-center gap-3 bg-white p-4 rounded-t-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 bg-custom-Gunmetal w:[10vw] md:w-[25vw] lg:w-[20vw] p-6 rounded-lg text-white shadow-lg">
            <img
              className="w-[80px] h-[80px] rounded-full bg-white p-2"
              src={seller?.seller.store_image_url}
              alt={seller?.seller.store_name}
            />
            <div className="grid gap-3 ">
              <strong>{seller?.seller.store_name}</strong>
              <p>{seller?.seller.store_description}</p>
            </div>
          </div>

          <div>
            <h2 className="font-bold"> 📌 Addresses:</h2>
            {seller?.seller.addresses.map((address, index) => (
              <div key={index}>
                <p>
                  {address.district_name}, {address.province_name}
                </p>
                <p>Postal Code: {address.postal_code}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 bg-white p-4 rounded-lg shadow-lg">
          <strong className="justify-center flex text-custom-Olive-Drab mb-4">
            Available Vouchers:
          </strong>
          <div className="flex gap-2 justify-between items-center mb-4">
            <button
              onClick={handlePrevVouchers}
              disabled={startIndex === 0}
              className="bg-custom-Gunmetal text-white p-2 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {vouchers
                .slice(startIndex, startIndex + vouchersPerPage)
                .map((voucher) => {
                  const isClaimed = claimedVouchers.includes(voucher.id);
                  return (
                    <div
                      key={voucher.id}
                      className="border p-4 rounded-lg shadow-md bg-red-200 "
                    >
                      <h3 className="font-bold text-base text-custom-dark-green truncate">
                        {voucher.title}
                      </h3>
                      <div className="flex">
                        <p className="text-sm text-gray-700 mt-1">Discount:</p>
                        <p className="text-red-500"> {voucher.percentage}%</p>
                      </div>

                      <p className="text-sm text-gray-700">
                        Max Discount: Rp{" "}
                        {voucher.max_discount_amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-700">
                        Min Purchase: Rp{" "}
                        {voucher.min_purchase_amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Expires:{" "}
                        {new Date(voucher.expiry_date).toLocaleDateString()}
                      </p>
                      <button
                        onClick={() => handleClaimVoucher(voucher.id)}
                        disabled={isClaimed}
                        className={` transition-transform hover:scale-105 w-full mt-2 p-2 text-sm font-semibold rounded ${
                          isClaimed ? "bg-gray-400" : "bg-red-600 text-white"
                        }`}
                      >
                        {isClaimed ? "Claimed" : "Claim"}
                      </button>
                    </div>
                  );
                })}
            </div>
            <button
              onClick={handleNextVouchers}
              disabled={startIndex + vouchersPerPage >= vouchers.length}
              className="bg-custom-Gunmetal text-white p-2 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
        <div className="mt-6 bg-white p-4  shadow-lg">
          <strong className="justify-center flex text-custom-Olive-Drab">
            Seller Products:
          </strong>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10 p-10">
            {allProducts.map((product) => (
              <Link
                href={`/product/detail-product?id=${product.id}`}
                key={product.id}
              >
                <div
                  key={product.id}
                  className="bg-white shadow-md rounded-lg overflow-hidden transition-transform duration-500 hover:scale-105"
                >
                  {product.image_url && product.image_url.length > 0 && (
                    <img
                      src={product.image_url[0].image_secure_url}
                      className="w-full h-[200px] object-cover"
                      alt={product.name}
                    />
                  )}
                  <h3 className="text-sm font-bold mb-2">{product.name}</h3>
                  <p className="text-gray-700 text-sm">
                    Price: ${product.price}
                  </p>
                  <p className="text-gray-500 text-xs">
                    ⭐ {product.avg_rating} ({product.sold_qty} sold)
                    <p className="text-xs text-end">
                      📌 {product.seller_info.store_district}
                    </p>
                  </p>
                </div>
              </Link>
            ))}
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
        <div className="mt-6 bg-white p-4 rounded-b-lg shadow-lg rounded-b-lg">
          <CatalogDashboard />
        </div>
        <FooterDash />
      </div>
    </>
  );
}
