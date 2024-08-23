"use client";
import React, { useState } from "react";
import { instanceWithAuth } from "@/utils/auth";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

interface UpdatePersonalProps {
  email: string;
  phoneNumber: string;
  password: string;
}

export default function UpdatePersonal({ email, phoneNumber, password }: UpdatePersonalProps) {
  const [requestType, setRequestType] = useState<"change_email" | "change_phone_number" | "change_password">("change_email");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  
  const validationSchema = Yup.object({
    currentPassword: Yup.string().required("Current password is required"),
    newEmail: Yup.string()
      .email("Invalid email address")
      .nullable()  
      .when('requestType', {
        is: (value: string) => value === "change_email",
        then: (schema) => schema.required("Email is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    newPhoneNumber: Yup.string()
      .matches(/^[0-9]+$/, "Phone number must contain only numbers")
      .min(8, "Phone number must be at least 8 digits")
      .max(13, "Phone number must not exceed 13 digits")
      .nullable()  
      .when('requestType', {
        is: (value: string) => value === "change_phone_number",
        then: (schema) => schema.required("Phone number is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    newPassword: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[\W_]/, "Password must contain at least one special character")
      .nullable() 
      .when('requestType', {
        is: (value: string) => value === "change_password",
        then: (schema) => schema.required("New password is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
  });
  

  const handleUpdate = async (values: any) => {
    setLoading(true);

    const body: any = {
      password: values.currentPassword,
      request_type: requestType,
    };

    if (requestType === "change_email") {
      body.new_email = values.newEmail;
    } else if (requestType === "change_phone_number") {
      body.new_phone_number = values.newPhoneNumber;
    } else if (requestType === "change_password") {
      body.new_password = values.newPassword;
    }

    try {
      const res = await instanceWithAuth.put("users/update", body, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status !== 200) throw new Error("Failed to update profile");
      setSuccessMessage("Data successfully updated");
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

      <Formik
        initialValues={{
          newEmail: "",
          newPhoneNumber: "",
          newPassword: "",
          currentPassword: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleUpdate}
      >
        {({ isSubmitting }) => (
          <Form>
            {requestType === "change_email" && (
              <div className="mb-4">
                <label className="block mb-1">New Email</label>
                <Field
                  type="email"
                  name="newEmail"
                  className="border p-2 rounded-md w-full"
                  placeholder="Enter new email"
                />
                <ErrorMessage name="newEmail" component="div" className="text-red-500" />
              </div>
            )}

            {requestType === "change_phone_number" && (
              <div className="mb-4">
                <label className="block mb-1">New Phone Number</label>
                <Field
                  type="tel"
                  name="newPhoneNumber"
                  className="border p-2 rounded-md w-full"
                  placeholder="Enter new phone number"
                />
                <ErrorMessage name="newPhoneNumber" component="div" className="text-red-500" />
              </div>
            )}

            {requestType === "change_password" && (
              <div className="mb-4">
                <label className="block mb-1">New Password</label>
                <Field
                  type="password"
                  name="newPassword"
                  className="border p-2 rounded-md w-full"
                  placeholder="Enter new password"
                />
                <ErrorMessage name="newPassword" component="div" className="text-red-500" />
              </div>
            )}

            <div className="mb-4">
              <label className="block mb-1">Current Password</label>
              <Field
                type="password"
                name="currentPassword"
                className="border p-2 rounded-md w-full"
                placeholder="Enter your current password"
              />
              <ErrorMessage name="currentPassword" component="div" className="text-red-500" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className={`p-2 bg-custom-green hover:bg-custom-green/80 text-white rounded-lg ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Updating..." : "Update"}
            </button>

            {successMessage && <p className="mt-4 text-green-500">{successMessage}</p>}
          </Form>
        )}
      </Formik>
    </div>
  );
}
