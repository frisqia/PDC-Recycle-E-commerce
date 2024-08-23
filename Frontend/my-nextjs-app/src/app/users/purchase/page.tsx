"use client";
import Loading from "@/app/components/loading/loading";
import NavbarPage from "@/app/components/navbar";
import React, { useEffect, useState } from "react";
import StarRating from "@/app/product/detail-product/customrate";
import { instanceWithAuth } from "@/utils/auth";

interface ProductInfo {
  image_url: string;
  is_active: number;
  name: string;
  price: number;
}

interface ProductOrder {
  product_id: number;
  product_info: ProductInfo;
  product_order_id: number;
  quantity: number;
}

interface Transaction {
  created_at: string;
  gross_amount: number;
  id: string;
  information: string;
  payment_link: string;
  product_orders: ProductOrder[];
  seller_id: number;
  seller_info: {
    store_image_url: string;
    store_name: string;
  };
  total_discount: number;
  transaction_status: number;
  transaction_status_name: string;
  updated_at: string;
  user_id: number;
  user_seller_voucher_id: number;
  reviewed?: boolean;
}

interface TransactionData {
  current_page: number;
  total_items: number;
  total_page: number;
  transactions: Transaction[];
}

interface ReviewData {
  message: string;
}

export default function purchaseTransaction() {
  const LOCAL_STORAGE_KEY = "reviewed_transactions";

  const getReviewedTransactions = (): Set<string> => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return new Set(stored ? JSON.parse(stored) : []);
  };

  const addReviewedTransaction = (transactionId: string) => {
    const reviewedTransactions = getReviewedTransactions();
    reviewedTransactions.add(transactionId);
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify(Array.from(reviewedTransactions))
    );
  };

  const [sortDate, setSortDate] = useState<"newest" | "latest">("newest");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentTransactionId, setCurrentTransactionId] = useState<
    string | null
  >(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [reviewData, setReviewData] = useState<{
    productOrders: {
      product_id: number;
      rating: number;
      review: string;
    }[];
    productInfo: { [key: number]: ProductInfo };
  }>({
    productOrders: [],
    productInfo: {},
  });
  const [statusFilter, setStatusFilter] = useState<number | null>(null);

  const openPopup = (transaction: Transaction) => {
    const productInfoMap: { [key: number]: ProductInfo } = {};
    transaction.product_orders.forEach((order) => {
      productInfoMap[order.product_id] = order.product_info;
    });

    const initialReviewData = transaction.product_orders.map((order) => ({
      product_id: order.product_id,
      rating: 0,
      review: "",
    }));

    setReviewData({
      productOrders: initialReviewData,
      productInfo: productInfoMap,
    });
    setCurrentTransactionId(transaction.id);
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
    setSuccessMessage(null);
  };

  const fetchData = async (
    transactionId: string | null = null,
    pageNumber: number = 1,
    sortDate: "newest" | "latest" = "newest",
    status: number | null = null
  ) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pageNumber.toString(),
        per_page: "10",
        date: sortDate,
      });

      if (transactionId) {
        queryParams.append("tx", transactionId);
      }

      if (status !== null) {
        queryParams.append("status", status.toString());
      }

      const response = await instanceWithAuth.get(
        `transactions/?${queryParams.toString()}`
      );

      if (response.status !== 200) {
        throw new Error("Failed to fetch data");
      }

      const data: TransactionData = await response.data;

      const reviewedTransactions = getReviewedTransactions();
      const updatedTransactions = data.transactions.map((trans) => ({
        ...trans,
        reviewed: reviewedTransactions.has(trans.id),
      }));
      setTransactions(updatedTransactions);
      setFilteredTransactions(updatedTransactions);
      setCurrentPage(data.current_page);
      setTotalPages(data.total_page);
    } catch (error: any) {
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(null, currentPage, sortDate, statusFilter);
  }, [currentPage, sortDate, statusFilter]);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [transactions, searchTerm]);

  const handleSearch = () => {
    const trimmedSearchTerm = searchTerm.trim().toLowerCase();
    const filtered = transactions.filter((trans) =>
      trans.id.toLowerCase().includes(trimmedSearchTerm)
    );
    setFilteredTransactions(filtered);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
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

  const handleReviewChange = (
    product_id: number,
    newRating: number,
    review: string
  ) => {
    const updatedReviews = reviewData.productOrders.map((reviewData) =>
      reviewData.product_id === product_id
        ? { ...reviewData, rating: newRating, review }
        : reviewData
    );
    setReviewData({ ...reviewData, productOrders: updatedReviews });
  };

  const handleSubmitReview = async () => {
    if (!currentTransactionId) return;

    try {
      const response = await instanceWithAuth.post(
        `transactions/review/${currentTransactionId}`,
        {
          reviews: reviewData.productOrders,
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to submit review");
      }

      const result: ReviewData = await response.data;

      setSuccessMessage(result.message);

      addReviewedTransaction(currentTransactionId);

      setTransactions((transactions) =>
        transactions.map((trans) =>
          trans.id === currentTransactionId
            ? { ...trans, reviewed: true }
            : trans
        )
      );

      closePopup();
    } catch (error: any) {
      setError(error.message || "Something went wrong");
    }
  };

  const handleSortDateChange = (value: "newest" | "latest") => {
    setSortDate(value);
    fetchData(null, currentPage, value, statusFilter);
  };

  const handleStatusChange = (newStatus: number | null) => {
    setStatusFilter(newStatus);
    fetchData(null, currentPage, sortDate, newStatus);
  };

  const handleCancelTransaction = async (transactionId: string) => {
    setLoading(true);
    try {
      const response = await instanceWithAuth.post(
        `transactions/cancel/${transactionId}`
      );

      if (response.status !== 200) {
        throw new Error("Failed to cancel transaction");
      }

      fetchData();
    } catch (error: any) {
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <NavbarPage />
      <div className="px-[5vw] py-[20vh] md:px-[10vw] py-[30vh] lg:py-[45vh] lg:px-20  bg-custom-light-blue">
        <filter className="grid lg:grid-cols-7 text-xs gap-2 md:grid-cols-3 grid-cols-2 mb-4 px-5">
          <button
            onClick={() => handleStatusChange(1)}
            className={`px-4 py-2 rounded-lg text-x md:text-xs lg:text-sm ${
              statusFilter === 1
                ? "bg-custom-green text-white"
                : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
          >
            WAITING_FOR_PAYMENT
          </button>
          <button
            onClick={() => handleStatusChange(2)}
            className={`px-4 py-2 rounded-lg text-xs md:text-sm lg:text-sm ${
              statusFilter === 2
                ? "bg-custom-green text-white"
                : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
          >
            PAYMENT_SUCCESS
          </button>
          <button
            onClick={() => handleStatusChange(3)}
            className={`px-4 py-2 rounded-lg text-xs md:text-sm lg:text-sm ${
              statusFilter === 3
                ? "bg-custom-green text-white"
                : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
          >
            PREPARED_BY_SELLER
          </button>
          <button
            onClick={() => handleStatusChange(4)}
            className={`px-4 py-2 rounded-lg text-xs md:text-sm lg:text-sm ${
              statusFilter === 4
                ? "bg-custom-green text-white"
                : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
          >
            ON_DELIVERY
          </button>
          <button
            onClick={() => handleStatusChange(5)}
            className={`px-4 py-2 rounded-lg text-xs md:text-sm lg:text-sm ${
              statusFilter === 5
                ? "bg-custom-green text-white"
                : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
          >
            DELIVERED
          </button>
          <button
            onClick={() => handleStatusChange(6)}
            className={`px-4 py-2 rounded-lg text-xs md:text-sm lg:text-base ${
              statusFilter === 6
                ? "bg-custom-green text-white"
                : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
          >
            CANCELLED
          </button>
          <button
            onClick={() => handleStatusChange(null)}
            className={`px-4 py-2 rounded-lg text-xs md:text-sm lg:text-base ${
              statusFilter === null
                ? "bg-custom-green text-white"
                : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
        </filter>

        <form className="px-5 flex" onSubmit={(e) => e.preventDefault()}>
          <div className="flex w-full">
            <i className="fa fa-filter flex bg-white p-4 text-custom-green"></i>
            <select
              id="date-sort"
              className="bg-custom-light-blue w-full p-2  bg-white p-4 w-full"
              value={sortDate}
              onChange={(e) =>
                handleSortDateChange(e.target.value as "newest" | "latest")
              }
            >
              <option value="newest">Newest</option>
              <option value="latest">latest</option>
            </select>
          </div>

          <i
            className="fa fa-search text-gray-300 bg-white p-4 cursor-pointer"
            onClick={handleSearch}
          ></i>
          <input
            type="text"
            id="search"
            placeholder="you can search by store name, order number, and product name"
            className="w-full py-3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </form>

        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((trans) => (
            <div
              key={trans.id}
              style={{
                background: "white",
                border: "1px solid #ccc",
                padding: "25px",
                margin: "20px",
                paddingBlock: "10px",
              }}
            >
              <div className="flex justify-between border-b px-4 md-px-7 lg:px-10 pb-4 font-bold">
                <p className="text-xs md:text-sm lg:text-base">
                  {trans.seller_info.store_name}
                </p>
                <p className="text-xs md:text-sm lg:text-base">
                  Status: {trans.transaction_status_name}
                </p>
                <p className="text-xs md:text-sm lg:text-base">{trans.id}</p>
              </div>
              {trans.product_orders.map((order) => (
                <div
                  key={order.product_order_id}
                  className=" flex justify-between mb-[8px] pt-10 font-10 px-4 md-px-7 lg:px-10"
                >
                  <img
                    src={order.product_info.image_url}
                    alt={order.product_info.name}
                    className="w-[50px] md:w-[70px] lg:w-[100px]"
                  />
                  <p className="text-xs md:text-sm lg:text-base">
                    {order.product_info.name}, x {order.quantity} pcs
                  </p>
                  <p className="text-xs md:text-sm lg:text-base">
                    Rp.{order.product_info.price}
                  </p>
                </div>
              ))}
              <div className="flex flex-col gap-2 items-end space-y-4 mt-4 px-10">
                <p>Total Amount: Rp.{trans.gross_amount}</p>
                {trans.transaction_status_name === "WAITING_FOR_PAYMENT" && (
                  <div className="flex flex-row space-x-2">
                    {" "}
                    <a
                      href={trans.payment_link}
                      target="_blank"
                      className="px-4 py-2 mt-3 bg-custom-green hover:bg-custom-green/80 text-white rounded-lg text-xs md:text-sm lg:text-base"
                    >
                      Go to Payment
                    </a>
                    <button
                      className="px-4 py-2 mt-3 bg-red-600 hover:bg-red-600/80 text-white rounded-lg text-xs md:text-sm lg:text-base"
                      onClick={() => handleCancelTransaction(trans.id)}
                    >
                      Cancel Transaction
                    </button>
                  </div>
                )}

                {trans.transaction_status_name === "DELIVERED" &&
                  !trans.reviewed && (
                    <button
                      className="px-4 py-2 bg-custom-green hover:bg-custom-green/80 text-white rounded-lg text-xs md:text-sm lg:text-base"
                      onClick={() => openPopup(trans)}
                    >
                      Give a Review
                    </button>
                  )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center text-xl font-bold mt-10 bg-white">
            <p>No transactions found</p>
          </div>
        )}

        <div className="flex justify-between mt-4 px-10">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg text-xs md:text-sm lg:text-base ${
              currentPage === 1
                ? "bg-gray-300 text-gray-700"
                : "bg-custom-green hover:bg-custom-green/80 text-white"
            }`}
          >
            Previous
          </button>

          <div className="flex space-x-1">
            {paginationNumbers.map((number, index) =>
              number === "..." ? (
                <span key={index} className="px-4 py-2 text-gray-700">
                  ...
                </span>
              ) : (
                <button
                  key={number}
                  onClick={() => setCurrentPage(number as number)}
                  className={`px-4 py-2 rounded-lg text-xs md:text-sm lg:text-base ${
                    number === currentPage
                      ? "bg-custom-green text-white"
                      : "bg-white text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {number}
                </button>
              )
            )}
          </div>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg text-xs md:text-sm lg:text-base ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-700"
                : "bg-custom-green hover:bg-custom-green/80 text-white"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closePopup}
        >
          <div
            className="bg-white p-5 rounded w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">
              Review your purchased products
            </h2>
            {reviewData.productOrders.map((order) => (
              <div key={order.product_id} className="mb-4">
                <div className="flex gap-2">
                  <img
                    src={reviewData.productInfo[order.product_id]?.image_url}
                    alt=""
                    className="w-20 h-20 mb-2"
                  />
                  <h3 className="text-md font-semibold">
                    {reviewData.productInfo[order.product_id]?.name}
                  </h3>
                </div>

                <StarRating
                  rating={order.rating}
                  onClick={(rating) =>
                    handleReviewChange(order.product_id, rating, order.review)
                  }
                />
                <textarea
                  value={order.review}
                  onChange={(e) =>
                    handleReviewChange(
                      order.product_id,
                      order.rating,
                      e.target.value
                    )
                  }
                  placeholder="Write your review here"
                  className="w-full p-2 border rounded mt-2"
                />
              </div>
            ))}

            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-custom-green hover:bg-custom-green/80 text-white rounded mr-2"
                onClick={handleSubmitReview}
              >
                Submit Review
              </button>
              <button
                className="px-4 py-2 bg-gray-300 hover:bg-gray-200 text-gray-700 rounded"
                onClick={closePopup}
              >
                Cancel
              </button>
            </div>
            {successMessage && (
              <p className="text-green-600 mt-4">{successMessage}</p>
            )}
            {error && <p className="text-red-600 mt-4">Error: {error}</p>}
          </div>
        </div>
      )}
    </>
  );
}
