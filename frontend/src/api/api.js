// src/api/api.js
import axios from "axios";

// Set API base URL depending on environment
const API_BASE =
    process.env.NODE_ENV === "production"
        ? "https://car-safety-systems.onrender.com" // Replace with your actual Render backend URL
        : "http://localhost:5000"; // Local backend during development

// Create Axios instance
const API = axios.create({
    baseURL: API_BASE,
    headers: {
        "Content-Type": "application/json",
    },
});

export default API;
