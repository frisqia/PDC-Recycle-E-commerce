"use client";
import React, { useEffect, useState } from "react";
import Loading from "@/app/components/loading/loading";
import NavbarPage from "@/app/components/navbar";
import CreatedAddress from "./createAddress";
import AddressList from "./listAddress";
import UpdatePersonal from "./UpdatePersonal";
import Link from "next/link";
import { instanceWithAuth } from "@/utils/auth";



interface UserProfile {
  id: number;
  fullname: string;
  username: string;
  email: string;
  phone_number: string;
  image_url: string | null;
  balance: number;
}

interface ApiResponse {
  user: UserProfile;
}

export default function UserDashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNewAddressesModal, setShowNewAddressesModal] = useState(false);
  const [showAddressesList, setShowAddressesList] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null); 
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function fetchUserProfile() {
      try {

        const res = await instanceWithAuth.get("users/me");
        if (res.status !== 200) throw new Error('failed get profile users');
        const data: ApiResponse =await res.data
        setProfile(res.data.user); 
      } catch (error: any) {
        console.error(error.message || "Ada yang salah");
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, []);

  
  const handleImageUpload = async () => {
    if (!imageFile) return;

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64String = reader.result?.toString().split(",")[1]; 

      try {
        setUploading(true);

        const res = await instanceWithAuth.put("users/update/image", {
            image_base64: [base64String],
          });
  
          if (res.status !== 200) throw new Error("Failed to update image");
  
          const result = res.data;


        
        setProfile((prev) => prev && { ...prev, image_url: result.image_url });
      } catch (error: any) {
        console.error("Error message:" ,error.message || "Failed to uploud image");
      } finally {
        setUploading(false);
      }
    };

    reader.onerror = () => {
      console.error("Error reading file");
      setUploading(false);
    };

    reader.readAsDataURL(imageFile); 
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const openNewAddressesModal = () => {
    setShowNewAddressesModal(true);
  };

  const closeNewAddressesModal = () => {
    setShowNewAddressesModal(false);
  };

  const openAddressesList = () => {
    setShowAddressesList(true);
  };

  const closeAddressesList = () => {
    setShowAddressesList(false);
  };

  if (loading) {
    return <Loading />;
  }

  if (!profile) {
    return <div>No profile data</div>;
  }

  return (
    <>
      <NavbarPage />
      <div className="min-h-screen flex flex-col items-center justify-center bg-custom-light-blue  py-[25vh] md:py-[35vh] lg:py-[40vh] px-[5vw] md:px-[10vw] lg:[15vw] ">
        <div className="bg-white w-full max-w-4xl p-8 rounded-lg shadow-md">
          <div className="flex justify-between">
            <div className="grid mb-8">
              <h2 className="text-2xl font-bold mb-4">My Profile</h2>
              <p className="text-gray-600 mb-6">
                Manage and protect your account
              </p>
            </div>
            <div className="grid">
              <label className="font-medium">
                Saldo: Rp. {profile.balance.toLocaleString()}
              </label>

              <p> email: {profile.email}</p>
              <p> phone: {profile.phone_number}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4 flex flex-col items-center justify-center">
              <p className="">{profile.username}</p>
              {profile.image_url && (
                <img
                src={profile.image_url}
                alt="profile"
                className="w-32 h-32 rounded-full border bg-white  shadow-lg"
              />
              )}

              <div className="text-center">
                <label htmlFor="image-upload" className="block font-medium">
                  Upload New Profile Photo
                </label>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="border p-2 mt-2 rounded-md w-full"
                />
                <button
                  className={`p-2 bg-custom-green hover:bg-custom-green/80 text-white rounded-lg mt-4 ${
                    uploading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={handleImageUpload}
                  disabled={!imageFile || uploading}
                >
                  {uploading ? "Uploading..." : "Update Image"}
                </button>
              </div>
            </div>
            <UpdatePersonal
              email={profile.email}
              phoneNumber={profile.phone_number}
              password=""
            />

            <div className="space-y-4"></div>
          </div>
            
          <div className="flex justify-end space-x-4">
            <Link href={'/users/purchase'} className="p-2 bg-custom-green hover:bg-custom-green/80 text-white rounded-lg" >purchase</Link>
            <button
              className="p-2 bg-custom-green hover:bg-custom-green/80 text-white rounded-lg"
              onClick={openAddressesList}
            >
              Address List
            </button>
            <button
              className="p-2 bg-custom-green hover:bg-custom-green/80 text-white rounded-lg"
              onClick={openNewAddressesModal}
            >
              Create New Address
            </button>
          </div>
        </div>
      </div>

      {showNewAddressesModal && profile && (
        <CreatedAddress onClose={closeNewAddressesModal} userId={profile.id} />
      )}
      {showAddressesList && <AddressList onClose={closeAddressesList} />}
    </>
  );
}
