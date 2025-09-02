import fetch from "node-fetch";

const API_BASE = "http://localhost:5000"; // change to your deployed URL when testing remotely
const originsToTest = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://car-safety-systems-1.onrender.com",
    "http://evil.com"
];

const endpoints = [
    "/api/auth/login",
    "/api/auth/google-login"
];

async function testCors() {
    for (const origin of originsToTest) {
        for (const endpoint of endpoints) {
            try {
                const res = await fetch(`${API_BASE}${endpoint}`, {
                    method: "OPTIONS", // preflight request
                    headers: {
                        "Origin": origin,
                        "Access-Control-Request-Method": "POST"
                    }
                });

                console.log(`Origin: ${origin}, Endpoint: ${endpoint}, Status: ${res.status}`);
                console.log("Access-Control-Allow-Origin:", res.headers.get("access-control-allow-origin"));
            } catch (err) {
                console.error(`Origin: ${origin}, Endpoint: ${endpoint}, Error: ${err.message}`);
            }
        }
    }
}

testCors();
