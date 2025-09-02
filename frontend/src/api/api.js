import axios from "axios";

const API_BASE =
    process.env.NODE_ENV === "production"
        ? "https://car-safety-system.onrender.com"
        : "http://localhost:5000";

const API = axios.create({
    baseURL: API_BASE,
    headers: {
        "Content-Type": "application/json",
    },
});

API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default API;
