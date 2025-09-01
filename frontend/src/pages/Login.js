import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import API from "../api/api";
import "../assets/CSS/login.css";

export default function Login() {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // ---------- Manual login ----------
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await API.post("/api/auth/login", { email, password });
            const { user, accessToken, refreshToken } = res.data;

            // Save tokens and user info
            localStorage.setItem("token", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("user", JSON.stringify(user));

            setUser(user);
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    // ---------- Google login ----------
    const handleGoogleLogin = async (response) => {
        console.log("Google credential:", response.credential);

        try {
            const res = await API.post("/api/auth/google-login", {
                credential: response.credential,
            });

            const { user, accessToken, refreshToken } = res.data;

            // Save tokens and user info
            localStorage.setItem("token", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("user", JSON.stringify(user));

            setUser(user);
            navigate("/dashboard");
        } catch (err) {
            console.error("Google login failed:", err);
            alert(err.response?.data?.message || "Google login failed");
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>{user ? `Welcome, ${user.name}` : "Login"}</h2>

                {!user && (
                    <>
                        <form onSubmit={handleSubmit} className="login-form">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="username"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                            />
                            <button type="submit" disabled={loading}>
                                {loading ? "Logging in..." : "Login"}
                            </button>
                        </form>

                        <div className="google-login">
                            <p>Or login with Google:</p>
                            <GoogleLogin
                                onSuccess={handleGoogleLogin}
                                onError={() => alert("Google login failed")}
                            />
                        </div>

                        <p className="signup-link">
                            Don’t have an account? <Link to="/register">Signup</Link>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
