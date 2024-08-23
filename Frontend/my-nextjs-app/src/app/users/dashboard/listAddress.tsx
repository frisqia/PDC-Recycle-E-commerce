"use client";
import React, { useEffect, useState } from "react";
import { instanceWithAuth } from "@/utils/auth";

interface AddressesList {
  address_line: string;
  address_type: string;
  district_id: number;
  district_name: string;
  id: number;   // ID digunakan untuk update
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

interface Province {
  id: number;
  province: string;
}

interface District {
  district: string;
  id: number;
  province_id: number;
}

const AddressList: React.FC<AddressListProps> = ({ onClose }) => {
  const [addresses, setAddresses] = useState<AddressesList[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [filteredDistricts, setFilteredDistricts] = useState<District[]>([]);
  
  const [editingAddress, setEditingAddress] = useState<AddressesList | null>(null);

  const [addressLine, setAddressLine] = useState("");
  const [addressType, setAddressType] = useState("");
  const [temporaryProvinceId, setTemporaryProvinceId] = useState<number | null>(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [rtRw, setRtRw] = useState("");

  useEffect(() => {
    async function fetchProvincesAndDistricts() {
      try {
        const provResp = await instanceWithAuth.get(`locations/provinces`);
        if (provResp.status !== 200) throw new Error(`Failed to fetch provinces`);
        const provData: Province[] = await provResp.data;
        setProvinces(provData);

        const disResp = await instanceWithAuth.get(`locations/districts`);
        if (disResp.status !== 200) throw new Error(`Failed to fetch districts`);
        const disData: District[] = await disResp.data;
        setDistricts(disData);
        setFilteredDistricts(disData);
      } catch (error: any) {
        setError(error.message || "Something went wrong");
      }
    }

    fetchProvincesAndDistricts();
  }, []);

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

  const handleUpdate = async () => {
    if (!editingAddress) return;

    try {
      const res = await instanceWithAuth.put(`addresses/update/${editingAddress.id}`, {
        address_line: addressLine || editingAddress.address_line,
        address_type: addressType || editingAddress.address_type,
        district_id: selectedDistrictId || editingAddress.district_id,
        phone_number: phoneNumber || editingAddress.phone_number,
        postal_code: postalCode || editingAddress.postal_code,
        province_id: temporaryProvinceId || editingAddress.province_id,
        receiver_name: receiverName || editingAddress.receiver_name,
        rt_rw: rtRw || editingAddress.rt_rw,
        is_active: 1,
      });

      if (res.status !== 200) throw new Error("Failed to update address");

      setAddresses((prevAddresses) =>
        prevAddresses.map((address) =>
          address.id === editingAddress.id
            ? { ...address, ...res.data }
            : address
        )
      );
      setEditingAddress(null);
    } catch (error: any) {
      setError(error.message || "Failed to update address");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await instanceWithAuth.delete(`addresses/delete/${id}`);
      if (res.status !== 200) throw new Error("Failed to delete address");
      
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
                    onClick={() => {
                      setEditingAddress(address);
                      setAddressLine(address.address_line);
                      setAddressType(address.address_type);
                      setTemporaryProvinceId(address.province_id);
                      setSelectedDistrictId(address.district_id);
                      setPhoneNumber(address.phone_number);
                      setPostalCode(address.postal_code);
                      setReceiverName(address.receiver_name);
                      setRtRw(address.rt_rw);
                    }}
                    className="text-white bg-custom-green hover:bg-custom-green/80 p-2 rounded mt-2 mr-2"
                  >
                    Edit
                  </button>
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

        {editingAddress && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-60">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-4 relative">
              <h2 className="text-lg font-bold mb-4">Edit Address</h2>
              <label className="block mb-2">Address Line</label>
              <input
                type="text"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                className="border p-2 rounded-md w-full mb-4"
              />

              <label className="block mb-2">Address Type</label>
              <input
                type="text"
                value={addressType}
                onChange={(e) => setAddressType(e.target.value)}
                className="border p-2 rounded-md w-full mb-4"
              />

              <label className="block mb-2">Province</label>
              <select
                value={temporaryProvinceId || ""}
                onChange={(e) => setTemporaryProvinceId(Number(e.target.value))}
                className="border p-2 rounded-md w-full mb-4"
              >
                <option value="">Select Province</option>
                {provinces.map((province) => (
                  <option key={province.id} value={province.id}>
                    {province.province}
                  </option>
                ))}
              </select>

              <label className="block mb-2">District</label>
              <select
                value={selectedDistrictId || ""}
                onChange={(e) => setSelectedDistrictId(Number(e.target.value))}
                className="border p-2 rounded-md w-full mb-4"
              >
                <option value="">Select District</option>
                {filteredDistricts
                  .filter(district => district.province_id === temporaryProvinceId)
                  .map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.district}
                    </option>
                  ))}
              </select>

              <label className="block mb-2">Phone Number</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="border p-2 rounded-md w-full mb-4"
              />

              <label className="block mb-2">Postal Code</label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="border p-2 rounded-md w-full mb-4"
              />

              <label className="block mb-2">Receiver Name</label>
              <input
                type="text"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                className="border p-2 rounded-md w-full mb-4"
              />

              <label className="block mb-2">RT/RW</label>
              <input
                type="text"
                value={rtRw}
                onChange={(e) => setRtRw(e.target.value)}
                className="border p-2 rounded-md w-full mb-4"
              />

              <button
                onClick={handleUpdate}
                className="text-white bg-blue-500 hover:bg-blue-700 p-2 rounded mr-2"
              >
                Save
              </button>
              <button
                onClick={() => setEditingAddress(null)}
                className="text-white bg-red-500 hover:bg-red-700 p-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressList;
