import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import loginUser from "../api/api";
import setToken from "../utils/auth";
import "../assets/CSS/login.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // handle form login
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await loginUser({ email, password });
            setToken(data.token);
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            alert("Login failed");
        } finally {
            setLoading(false);
        }
    };

    // handle google login
    const handleGoogleLogin = async (credentialResponse) => {
        try {
            const googleToken = credentialResponse.credential;
            // send token to backend
            const res = await fetch("/api/auth/google-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ googleToken }),
            });

            const data = await res.json();
            if (res.ok) {
                setToken(data.token);
                navigate("/dashboard");
            } else {
                alert(data.message || "Google login failed");
            }
        } catch (err) {
            console.error(err);
            alert("Google login failed");
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>Welcome Back</h2>

                {/* form */}
                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        type="email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        required autoComplete="username"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        required autoComplete="current-password"
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? <span className="spinner"></span> : "Login"}
                    </button>
                </form>

                {/* google login button */}
                <div className="google-login">
                    <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={() => alert("Google login Failed")}
                    />
                </div>

                <p className="signup-link">
                    Don’t have an account? <Link to="/register">Signup</Link>
                </p>
            </div>
        </div>
    );
}
