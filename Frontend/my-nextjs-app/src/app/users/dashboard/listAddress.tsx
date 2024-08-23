"use client";
import React, { useEffect, useState } from "react";
import { instanceWithAuth } from "@/utils/auth";

interface AddressesList {
  address_line: string;
  address_type: string;
  district_id: number;
  district_name: string;
  id: number;
  is_active: number;
  phone_number: string;
  postal_code: string;
  province_id: number;
  province_name: string;
  receiver_name: string;
  rt_rw: string;
}

interface AddressListProps {
  onClose: () => void;
}

const AddressList: React.FC<AddressListProps> = ({ onClose }) => {
  const [addresses, setAddresses] = useState<AddressesList[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAddresses() {
      try {
        const res = await instanceWithAuth.get(`addresses/list`);
        if (res.status !== 200) throw new Error("Failed to fetch addresses");
        const data: AddressesList[] = res.data;
        setAddresses(data);
      } catch (error: any) {
        setError(error.message || "Something went wrong");
      }
    }

    fetchAddresses();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const res = await instanceWithAuth.delete(`addresses/delete/${id}`);
      if (res.status !== 200) throw new Error("Failed to delete address");
      
      // Menghapus alamat yang sudah dihapus dari state addresses
      setAddresses((prevAddresses) =>
        prevAddresses.filter((address) => address.id !== id)
      );
    } catch (error: any) {
      setError(error.message || "Failed to delete address");
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 shadow-lg max-w-lg mx-4 max-h-[50vh] overflow-auto">
        <div className="flex justify-between items-center">
          <h3 className="mt-4 text-lg font-bold">Address List</h3>
          <button
            className="text-white bg-red-600 hover:bg-red-600/80 p-2 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div>
          {addresses.length === 0 ? (
            <p>No addresses found</p>
          ) : (
            <ul>
              {addresses.map((address) => (
                <li key={address.id} className="border-b py-2">
                  <p><strong>Address:</strong> {address.address_line}</p>
                  <p><strong>Type:</strong> {address.address_type}</p>
                  <p><strong>District:</strong> {address.district_name}</p>
                  <p><strong>Province:</strong> {address.province_name}</p>
                  <p><strong>Receiver Name:</strong> {address.receiver_name}</p>
                  <p><strong>Phone Number:</strong> {address.phone_number}</p>
                  <p><strong>Postal Code:</strong> {address.postal_code}</p>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="text-white bg-red-500 hover:bg-red-700 p-2 rounded mt-2"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressList;
