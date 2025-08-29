import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import "../assets/CSS/login.css";

export default function Signup() {
    const [user, setUser] = useState(null); // Google user
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Manual signup
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        setLoading(true);
        try {
            const token = "signup-token"; // replace with backend API
            localStorage.setItem("token", token);
            alert(`Account created for ${name}`);
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            alert("Signup failed");
        } finally {
            setLoading(false);
        }
    };

    // Google signup
    const handleGoogleSignup = (credentialResponse) => {
        try {
            const decoded = JSON.parse(
                atob(credentialResponse.credential.split(".")[1])
            );
            setUser(decoded);
            localStorage.setItem("token", credentialResponse.credential);
            alert(`Signed up as ${decoded.name}`);
            navigate("/dashboard");
        } catch (err) {
            console.error("Google signup failed:", err);
            alert("Google signup failed");
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>{user ? `Welcome, ${user.name}` : "Signup"}</h2>

                {!user && (
                    <>
                        {/* Manual signup form */}
                        <form onSubmit={handleSubmit} className="login-form">
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
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
                                autoComplete="new-password"
                            />
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                autoComplete="new-password"
                            />
                            <button type="submit" disabled={loading}>
                                {loading ? "Creating account..." : "Signup"}
                            </button>
                        </form>

                        {/* Google signup button */}
                        <div className="google-login" style={{ margin: "20px 0" }}>
                            <p>Or signup with Google:</p>
                            <GoogleLogin
                                onSuccess={handleGoogleSignup}
                                onError={() => alert("Google signup failed")}
                            />
                        </div>

                        <p className="signup-link">
                            Already have an account? <Link to="/login">Login</Link>
                        </p>
                    </>
                )}

                {user && (
                    <div className="google-user-info">
                        {user.picture && (
                            <img
                                src={user.picture}
                                alt={user.name}
                                style={{ borderRadius: "50%", width: "100px", marginBottom: "10px" }}
                            />
                        )}
                        <h3>{user.name}</h3>
                        <p>{user.email}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
