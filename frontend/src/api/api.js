// src/api/api.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL?.trim() || "http://localhost:5000";

const API = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
    withCredentials: false, // only true if backend uses cookies
});

export default API;
