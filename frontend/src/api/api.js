// src/api/api.js
import axios from "axios";

// Replace with your deployed backend URL
const API_BASE = "https://car-safety-systems-1.onrender.com";

const API = axios.create({
    baseURL: API_BASE,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: false, // set true only if backend uses cookies
});

export default API;
