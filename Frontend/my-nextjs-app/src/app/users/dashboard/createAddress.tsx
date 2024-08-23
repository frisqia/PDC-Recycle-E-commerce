"use client";
import React, { useEffect, useState } from "react";
import { instanceWithAuth } from "@/utils/auth";

interface Province {
  id: number;
  province: string;
}

interface District {
  district: string;
  id: number;
  province_id: number;
}

interface AddressesModalProps {
  onClose: () => void;
  userId: number;
}

const CreatedAddress: React.FC<AddressesModalProps> = ({ onClose, userId }) => {
  const [addressLine, setAddressLine] = useState("");
  const [addressType, setAddressType] = useState("");
  const [temporaryProvinceId, setTemporaryProvinceId] = useState<number | null>(
    null
  );
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(
    null
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [rtRw, setRtRw] = useState("");
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [filteredDistricts, setFilteredDistricts] = useState<District[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProvincesAndDistricts() {
      try {
        const provResp = await instanceWithAuth.get(`locations/provinces`);
        if (provResp.status !== 200)
          throw new Error(`failed to fetch provinces`);
        const provData: Province[] = await provResp.data;
        setProvinces(provData);

        const disResp = await instanceWithAuth.get(`locations/districts`);
        if (disResp.status !== 200) throw new Error(`failed to fetch district`);
        const disData: District[] = await disResp.data;
        setDistricts(disData);
        setFilteredDistricts(disData);
      } catch (error: any) {
        setError(error.message || "Something went wrong");
      }
    }

    fetchProvincesAndDistricts();
  }, []);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = parseInt(e.target.value, 10);
    setTemporaryProvinceId(provinceId);
    const filtered = districts.filter(
      (district) => district.province_id === provinceId
    );
    setFilteredDistricts(filtered);
  };

  const handleCreateAddress = async () => {
    try {
      const res = await instanceWithAuth.post(`addresses/create`, {
        user_id: userId,
        address_line: addressLine,
        address_type: addressType,
        district_id: selectedDistrictId,
        phone_number: phoneNumber,
        postal_code: postalCode,
        province_id: temporaryProvinceId,
        receiver_name: receiverName,
        rt_rw: rtRw,
        is_active: 1,
      });
      if (res.status! == 200) throw new Error("Failed to create address");
      onClose();
    } catch (error: any) {
      setError(error.message || "Failed to create address");
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 shadow-lg max-w-lg mx-4 max-h-[50vh] overflow-auto">
        <div className="flex justify-between items-center">
          <h2>Your Address</h2>
          <h3 className="mt-4 text-lg font-bold">Add New Address</h3>
        </div>
        <div>
          <div className="mb-2">
            <label className="block">Address Line:</label>
            <input
              type="text"
              value={addressLine}
              onChange={(e) => setAddressLine(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block">Address Type:</label>
            <input
              type="text"
              value={addressType}
              onChange={(e) => setAddressType(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block">Province:</label>
            <select
              value={temporaryProvinceId ?? ""}
              onChange={handleProvinceChange}
              className="border p-2 w-full"
            >
              <option value="">Select Province</option>
              {provinces.map((prov) => (
                <option key={prov.id} value={prov.id}>
                  {prov.province}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="block">District:</label>
            <select
              value={selectedDistrictId ?? ""}
              onChange={(e) =>
                setSelectedDistrictId(parseInt(e.target.value, 10))
              }
              className="border p-2 w-full"
            >
              <option value="">Select District</option>
              {filteredDistricts.map((dis) => (
                <option key={dis.id} value={dis.id}>
                  {dis.district}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="block">Phone Number:</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block">Postal Code:</label>
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block">Receiver Name:</label>
            <input
              type="text"
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block">RT/RW:</label>
            <input
              type="text"
              value={rtRw}
              onChange={(e) => setRtRw(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div className="flex gap-2">
            <button
              className="bg-custom-green hover:bg-custom-green/80 text-white p-2 rounded mt-4"
              onClick={handleCreateAddress}
            >
              Add Address
            </button>
            <button
              className="text-white bg-red-600 hover:bg-red-600/80 p-2 rounded mt-4"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatedAddress;
