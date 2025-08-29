// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api"; // your axios instance
import "../assets/CSS/Dashboard.css";

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({ users: 0, trips: 0, vehicles: 0, alerts: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const decoded = JSON.parse(atob(token.split(".")[1]));
            setUser({
                name: decoded.name,
                email: decoded.email,
                picture: decoded.picture,
            });
        } catch (err) {
            setUser({ name: "Manual User", email: "manual@example.com" });
        }

        // fetch stats from backend
        const fetchStats = async () => {
            try {
                const users = await API.get("/users");
                const trips = await API.get("/trips");
                const vehicles = await API.get("/vehicles");
                const alerts = await API.get("/alerts");
                setStats({
                    users: users.data.length,
                    trips: trips.data.length,
                    vehicles: vehicles.data.length,
                    alerts: alerts.data.length,
                });
            } catch (err) {
                console.error("Failed to fetch stats:", err);
            }
        };

        fetchStats();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (!user) return null;

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-logo">SaaS App</div>
                <ul className="sidebar-menu">
                    <li>Dashboard</li>
                    <li>Profile</li>
                    <li>Settings</li>
                    <li onClick={handleLogout} style={{ cursor: "pointer", color: "red" }}>
                        Logout
                    </li>
                </ul>
            </aside>

            {/* Main content */}
            <div className="main-content">
                {/* Navbar */}
                <nav className="navbar">
                    <div className="navbar-user">
                        {user.picture && (
                            <img src={user.picture} alt={user.name} className="user-avatar" />
                        )}
                        <span>{user.name}</span>
                    </div>
                </nav>

                {/* Dashboard Body */}
                <div className="dashboard-body">
                    <h1>Welcome, {user.name}!</h1>
                    <p>Email: {user.email}</p>

                    <div className="cards-container">
                        <div className="card">Users: {stats.users}</div>
                        <div className="card">Trips: {stats.trips}</div>
                        <div className="card">Vehicles: {stats.vehicles}</div>
                        <div className="card">Alerts: {stats.alerts}</div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="footer">
                    &copy; {new Date().getFullYear()} SaaS App. All rights reserved.
                </footer>
            </div>
        </div>
    );
}
