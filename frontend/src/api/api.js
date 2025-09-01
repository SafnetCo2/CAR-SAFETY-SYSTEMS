// src/api/api.js
import axios from "axios";

const API_BASE =
    process.env.NODE_ENV === "production"
        ? "https://car-safety-systems.onrender.com"
        : "http://localhost:5000";

const API = axios.create({
    baseURL: API_BASE,
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach access token to requests
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

// Response interceptor: handle expired access token
API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response &&
            error.response.status === 401 &&
            error.response.data.message.includes("Token expired") &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem("refreshToken");
                const { data } = await axios.post(`${API_BASE}/api/auth/refresh-token`, { refreshToken });
                localStorage.setItem("token", data.token);
                originalRequest.headers["Authorization"] = `Bearer ${data.token}`;
                return axios(originalRequest);
            } catch (err) {
                // redirect to login or clear storage
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                window.location.href = "/login";
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);


export default API;
