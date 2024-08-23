"use client";
import React, { useState } from "react";
import accessToken from "@/app/token-sementara/config";
import { Formik } from "formik";
import { instanceWithAuth } from "@/utils/auth";

interface UpdatePersonalProps {
  email: string;
  phoneNumber: string;
  password: string;
}

export default function UpdatePersonal({ email, phoneNumber, password }: UpdatePersonalProps) {
  const [newEmail, setNewEmail] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState(password);
  const [requestType, setRequestType] = useState<"change_email" | "change_phone_number" | "change_password">("change_email");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleUpdate = async () => {
    if (!currentPassword) {
      alert("Password wajib diisi.");
      return;
    }

    setLoading(true);

    const body: any = {
      password: currentPassword,
      request_type: requestType,
    };

    if (requestType === "change_email") {
      body.new_email = newEmail;
    } else if (requestType === "change_phone_number") {
      body.new_phone_number = newPhoneNumber;
    } else if (requestType === "change_password") {
      body.new_password = newPassword;
    }

    try {

        const res = await instanceWithAuth.put("users/update", body ,{
            headers: {
                'Content-Type': 'application/json',
              },
        });
        if (res.status !== 200) throw new Error('failed get update profile')
            setSuccessMessage("Data berhasil diperbarui")
    //   const res = await fetch("http://127.0.0.1:5000/api/users/update", {
    //     method: "PUT",
    //     headers: {
    //       Authorization: `Bearer ${accessToken}`,
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(body),
    //   });

    //   if (!res.ok) throw new Error("Gagal memperbarui data");

    //   setSuccessMessage("Data berhasil diperbarui");
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-bold">Update Personal Info</h3>

      <div className="mb-4">
        <label className="block mb-1">Request Type</label>
        <select
          value={requestType}
          onChange={(e) => setRequestType(e.target.value as any)}
          className="border p-2 rounded-md w-full"
        >
          <option value="change_email">Change Email</option>
          <option value="change_phone_number">Change Phone Number</option>
          <option value="change_password">Change Password</option>
        </select>
      </div>

      {requestType === "change_email" && (
        <div className="mb-4">
          <label className="block mb-1">New Email</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="border p-2 rounded-md w-full"
            placeholder="Enter new email"
          />
        </div>
      )}

      {requestType === "change_phone_number" && (
        <div className="mb-4">
          <label className="block mb-1">New Phone Number</label>
          <input
            type="tel"
            value={newPhoneNumber}
            onChange={(e) => setNewPhoneNumber(e.target.value)}
            className="border p-2 rounded-md w-full"
            placeholder="Enter new phone number"
          />
        </div>
      )}

      {requestType === "change_password" && (
        <div className="mb-4">
          <label className="block mb-1">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border p-2 rounded-md w-full"
            placeholder="Enter new password"
          />
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-1">Current Password</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="border p-2 rounded-md w-full"
          placeholder="Enter your current password"
        />
      </div>

      <button
        onClick={handleUpdate}
        disabled={loading}
        className={`p-2 bg-custom-green hover:bg-custom-green/80 text-white rounded-lg ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Updating..." : "Update"}
      </button>

      {successMessage && <p className="mt-4 text-green-500">{successMessage}</p>}
    </div>
  );
}
