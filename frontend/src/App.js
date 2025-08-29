// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup"; // import your signup page
import Dashboard from "./pages/Dashboard"; // import dashboard page

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Redirect root "/" to "/login" */}
                <Route path="/" element={<Navigate to="/login" />} />

                {/* Login page */}
                <Route path="/login" element={<Login />} />

                {/* Signup page */}
                <Route path="/register" element={<Signup />} />

                {/* Dashboard page */}
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Catch-all route for unmatched paths */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
