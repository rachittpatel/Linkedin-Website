import axios from "axios";



//const { default: axios } = require("axios");


export const BASE_URL = "https://linkedin-website-3wtn.onrender.com";

export const clientServer = axios.create({
  baseURL: BASE_URL,
})


clientServer.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);
