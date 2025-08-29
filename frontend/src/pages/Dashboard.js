// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api"; // axios instance
import "../assets/CSS/Dashboard.css"

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({ users: 0, trips: 0, vehicles: 0, alerts: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        try {
            const decoded = JSON.parse(atob(token.split(".")[1]));
            setUser({
                name: decoded.name,
                email: decoded.email,
                picture: decoded.picture,
            });
        } catch {
            setUser({ name: "Manual User", email: "manual@example.com" });
        }

        // Fetch stats from backend
        const fetchStats = async () => {
            try {
                const [usersRes, tripsRes, vehiclesRes, alertsRes] = await Promise.all([
                    API.get("/users"),
                    API.get("/trips"),
                    API.get("/vehicles"),
                    API.get("/alerts"),
                ]);
                setStats({
                    users: usersRes.data.length,
                    trips: tripsRes.data.length,
                    vehicles: vehiclesRes.data.length,
                    alerts: alertsRes.data.length,
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
                <div className="sidebar-logo">Car Safety Systems</div>
                <ul className="sidebar-menu">
                    <li>Dashboard</li>
                    <li>Users</li>
                    <li>Vehicles</li>
                    <li>Trips</li>
                    <li>Alerts</li>
                    <li>Settings</li>
                    <li onClick={handleLogout} className="logout">Logout</li>
                </ul>
            </aside>

            {/* Main content */}
            <div className="main-content">
                {/* Navbar */}
                <nav className="navbar">
                    <div className="navbar-user">
                        {user.picture && <img src={user.picture} alt={user.name} className="user-avatar" />}
                        <span>{user.name}</span>
                    </div>
                </nav>

                {/* Dashboard body */}
                <div className="dashboard-body">
                    <h1>Welcome, {user.name}!</h1>
                    <p>Email: {user.email}</p>

                    {/* Stats cards */}
                    <div className="cards-container">
                        <div className="card">Users: {stats.users}</div>
                        <div className="card">Vehicles: {stats.vehicles}</div>
                        <div className="card">Trips: {stats.trips}</div>
                        <div className="card">Alerts: {stats.alerts}</div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="footer">
                    &copy; {new Date().getFullYear()} Car Safety Systems. All rights reserved.
                </footer>
            </div>
        </div>
    );
}
