"use client";
import React, { useEffect, useState } from "react";
import { instanceWithAuth } from "@/utils/auth";

interface VoucherDetail {
  created_at: string;
  discount_type: number;
  discount_type_name: string;
  expiry_date: string;
  id: number;
  is_active: number;
  max_discount_amount: number;
  min_purchase_amount: number;
  percentage: number;
  seller_id: number;
  start_date: string;
  title: string;
  usage_limit: number;
}

interface VoucherListItem {
  id: number;
  is_used: number;
  seller_voucher_detail: VoucherDetail;
  seller_voucher_id: number;
  user_id: number;
}

type VoucherList = VoucherListItem[];

interface VoucherModalProps {
  onClose: () => void;
  onVoucherSelect: (voucherId: number | null) => void;
}

const VoucherModal: React.FC<VoucherModalProps> = ({
  onClose,
  onVoucherSelect,
}) => {
  const [vouchers, setVouchers] = useState<VoucherList>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedVoucherId, setSelectedVoucherId] = useState<number | null>(
    null
  );

  useEffect(() => {
    async function fetchVoucherList() {
      try {
        const body = { seller_ids: [] };

        const res = await instanceWithAuth.get("usersellervouchers/list", {
          data: body,
        });

        if (res.status !== 200) throw new Error("Failed to fetch voucher list");

        setVouchers(res.data);
      } catch (error: any) {
        setError(error.message || "Something went wrong");
      }
    }

    fetchVoucherList();
  }, []);

  const useVoucher = async () => {
    if (selectedVoucherId === null) return;
  
    try {
      const res = await instanceWithAuth.put(
        `usersellervouchers/used/${selectedVoucherId}`
      );
      if (res.status !== 200) throw new Error("Failed to use voucher");
      setSuccessMessage("Voucher used successfully");
      onVoucherSelect(selectedVoucherId); 
      onClose();
    } catch (error) {
      console.log(error);
      setError("Failed to use voucher");
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md relative">
        <h2 className="text-lg font-bold mb-4">Voucher List</h2>
        <button
          onClick={() => {
            onClose();
          }}
          className="absolute top-2 right-2 text-white bg-red-700 p-2 rounded-lg hover:bg-red-600"
        >
          Close
        </button>

        {successMessage && (
          <p className="text-green-600 font-semibold mb-2">{successMessage}</p>
        )}
        {error && <p className="text-red-600 font-semibold mb-2">{error}</p>}

        {vouchers.length === 0 ? (
          <p>No vouchers available.</p>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            <ul>
              {vouchers.map((voucher) => (
                <li
                  key={voucher.id}
                  className={`mb-2 p-2 border-b cursor-pointer ${
                    selectedVoucherId === voucher.id ? "bg-gray-200" : ""
                  }`}
                  onClick={() => setSelectedVoucherId(voucher.id)}
                >
                  <h3 className="font-semibold">
                    {voucher.seller_voucher_detail.title}
                  </h3>
                  <p>Discount: {voucher.seller_voucher_detail.percentage}%</p>
                  <p>
                    Expiry Date: {voucher.seller_voucher_detail.expiry_date}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {selectedVoucherId && (
          <button
            onClick={useVoucher}
            className="mt-4 bg-custom-green text-white px-4 py-2 rounded hover:bg-custom-green/80 transition duration-300"
          >
            Apply Voucher
          </button>
        )}
      </div>
    </div>
  );
};

export default VoucherModal;
