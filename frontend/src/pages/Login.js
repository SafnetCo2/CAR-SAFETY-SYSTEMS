import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import "../assets/CSS/login.css"; // import your CSS file

export default function Login() {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Manual login
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = "manual-login-token"; // replace with real API call
            localStorage.setItem("token", token);
            alert(`Logged in as ${email}`);
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            alert("Login failed");
        } finally {
            setLoading(false);
        }
    };

    // Google login
    const handleGoogleLogin = (credentialResponse) => {
        try {
            const decoded = JSON.parse(
                atob(credentialResponse.credential.split(".")[1])
            );
            setUser(decoded);
            localStorage.setItem("token", credentialResponse.credential);
            alert(`Logged in as ${decoded.email}`);
            navigate("/dashboard");
        } catch (err) {
            console.error("Google login failed:", err);
            alert("Google login failed");
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>{user ? `Welcome, ${user.name}` : "Login"}</h2>

                {!user && (
                    <>
                        {/* Manual login form */}
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

                {user && (
                    <div className="google-user">
                        {user.picture && <img src={user.picture} alt={user.name} />}
                        <h3>{user.name}</h3>
                        <p>{user.email}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
