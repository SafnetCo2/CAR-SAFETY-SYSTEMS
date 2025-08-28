import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Redirect root "/" to "/login" */}
                <Route path="/" element={<Navigate to="/login" />} />

                <Route path="/login" element={<Login />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
