// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../assets/CSS/dashboard.css";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// Icons
import {
    FaBars,
    FaTimes,
    FaTachometerAlt,
    FaUsers,
    FaCar,
    FaRoute,
    FaBell,
    FaCog,
    FaSignOutAlt,
} from "react-icons/fa";

// Navbar component
import Navbar from "../components/Navbar";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({
        users: 0,
        trips: 0,
        vehicles: 0,
        alerts: 0,
    });
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData) {
            setUser(userData);
        } else {
            setUser({ name: "Manual User", email: "manual@example.com" });
        }

        const fetchStats = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };

                const users = await API.get("/api/users", config);
                const trips = await API.get("/api/trips", config);
                const vehicles = await API.get("/api/vehicles", config);
                const alerts = await API.get("/api/alerts", config);

                setStats({
                    users: users.data.length,
                    trips: trips.data.length,
                    vehicles: vehicles.data.length,
                    alerts: alerts.data.length,
                });
                setLastUpdated(new Date().toLocaleString());
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

    const chartData = {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [
            {
                label: "Trips",
                data: [5, 12, 8, 15],
                borderColor: "#4e73df",
                backgroundColor: "rgba(78,115,223,0.2)",
            },
        ],
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">Car Safety Systems</div>
                    <button
                        className="sidebar-toggle"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                <ul className="sidebar-menu">
                    <li><FaTachometerAlt /> Dashboard</li>
                    <li><FaUsers /> Users</li>
                    <li><FaCar /> Vehicles</li>
                    <li><FaRoute /> Trips</li>
                    <li><FaBell /> Alerts</li>
                    <li><FaCog /> Settings</li>
                    <li onClick={handleLogout} className="logout"><FaSignOutAlt /> Logout</li>
                </ul>
            </aside>

            {/* Main Content */}
            <div className={`main-content ${sidebarOpen ? "shifted" : ""}`}>
                {/* Navbar */}
                <Navbar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    onSearch={(query) => console.log("Search query:", query)}
                    suggestionsData={["Users", "Trips", "Vehicles", "Alerts", "Settings", "Drivers"]}
                />

                <div className="dashboard-body">
                    <div className="cards-container">
                        <div className="card">Users: {stats.users}</div>
                        <div className="card">Trips: {stats.trips}</div>
                        <div className="card">Vehicles: {stats.vehicles}</div>
                        <div className="card">Alerts: {stats.alerts}</div>
                    </div>

                    <div className="chart-container">
                        <h3>Trips This Month</h3>
                        <Line data={chartData} />
                    </div>

                    <div className="premium-feature">
                        <h3>Premium Feature</h3>
                        <p>Unlock advanced analytics and alerts</p>
                        <button>Upgrade Now</button>
                    </div>

                    <footer className="footer">
                        &copy; {new Date().getFullYear()} Car Safety Systems. All rights reserved.
                        {lastUpdated && (
                            <div className="last-updated">Last Updated: {lastUpdated}</div>
                        )}
                    </footer>
                </div>
            </div>
        </div>
    );
}
