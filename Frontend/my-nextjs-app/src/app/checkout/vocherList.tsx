'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { instanceWithAuth } from '@/utils/auth';

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
}

const VoucherModal: React.FC<VoucherModalProps> = ({ onClose }) => {
  const [vouchers, setVouchers] = useState<VoucherList>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVoucherList() {
      try {
        const body = { seller_ids: [] }; 
        
   
        const res = await instanceWithAuth.get('usersellervouchers/list', {
          data: body, 
        });

        if (res.status !== 200) throw new Error('Failed to fetch voucher list');
        
        setVouchers(res.data);
      } catch (error: any) {
        setError(error.message || 'Something went wrong');
      }
    }

    fetchVoucherList();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md relative">
        <h2 className="text-lg font-bold mb-4">Voucher List</h2>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>

        {vouchers.length === 0 ? (
          <p>No vouchers available.</p>
        ) : (
          <ul>
            {vouchers.map((voucher) => (
              <li key={voucher.id} className="mb-2 p-2 border-b">
                <h3 className="font-semibold">{voucher.seller_voucher_detail.title}</h3>
                <p>Discount: {voucher.seller_voucher_detail.percentage}%</p>
                <p>Expiry Date: {voucher.seller_voucher_detail.expiry_date}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default VoucherModal;
