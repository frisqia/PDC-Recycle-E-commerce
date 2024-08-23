import axios from "axios";
import "dotenv/config";

export const instance = axios.create({
  baseURL: `http://127.0.0.1:5000/api/`,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
});

export const instanceWithAuth = axios.create({
  baseURL: `http://127.0.0.1:5000/api/`,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
});

instanceWithAuth.interceptors.request.use(function (config) {
  const token: string | null = localStorage.getItem("userAccessToken");
  if (!token) {
    throw new Error("Missing Auth Token");
  }
  config.headers.Authorization =`Bearer ${token}`;
  return config;
}
);

