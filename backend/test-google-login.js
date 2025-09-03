import mongoose from "mongoose";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config();

// ---------- MongoDB Test ----------
const MONGO_URI = process.env.MONGO_URI;
mongoose.set("strictQuery", false);

mongoose
    .connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch((err) => {
        console.error("❌ MongoDB connection failed:", err.message);
        process.exit(1);
    });

// ---------- Google Token Test ----------
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Replace this with a real credential from your frontend GoogleLogin
const TEST_GOOGLE_TOKEN = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjJkN2VkMzM4YzBmMTQ1N2IyMTRhMjc0YjVlMGU2NjdiNDRhNDJkZGUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI3MjA2MDU2MzcxMDQtOWM0bWIzdW9vbThlM2I3NTR2amZmNTBuaDRkNTNodGsuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI3MjA2MDU2MzcxMDQtOWM0bWIzdW9vbThlM2I3NTR2amZmNTBuaDRkNTNodGsuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDE1ODgwOTQ2MDc2NDMzODUyMTUiLCJlbWFpbCI6InVrcmFpbmV0aXVraGFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5iZiI6MTc1NjgzNTU4NSwibmFtZSI6Ikpvc2VwaGluZSBOemlva2EiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jS1pqNFJKSGx0RmhrOWdueUNRMEJzbmlRMjI1S2FmUU9SdnhVRGdvbEdXeF9KZHM0clE9czk2LWMiLCJnaXZlbl9uYW1lIjoiSm9zZXBoaW5lIiwiZmFtaWx5X25hbWUiOiJOemlva2EiLCJpYXQiOjE3NTY4MzU4ODUsImV4cCI6MTc1NjgzOTQ4NSwianRpIjoiMTgxZjQzNzllNDAyM2U3MTI2Y2EzYThmYjVkODRhZDM3YmRhZGQxMiJ9.cXaoUhsOIMlHpJR0wrFk7Q33lqnbXeczpGKJOSBQgsQLh_4jxS - eVouWEfftNfnTb356k_2BgZUmlAeyGXv2mjgZXxSOdrD7UM_DIP6p5cBGaU0W - TUoLhhKdiUAsolJDdZHTQgpzMYKtt0WCxPgHL85hHZz8aqHnJQrsMsuk_8D2aen6f7ihLXNZrHsEtWGt8yu9Qk - 8wqcku_taeZZSFezff2icb7GLWHqCKVKNnczNHqAQhQMV5yXvzkAUrmIGWJp7dnq5PJqUtLLKBW_ko_B26ighTGhqOb6SwC8PAf6mojet3Qfdt-yBwLewCBqC1T5jCo5lkP7Abah8avKaQ"









async function verifyGoogleToken() {
    try {
        const ticket = await client.verifyIdToken({
            idToken: TEST_GOOGLE_TOKEN

            
,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        console.log("✅ Google token verified successfully:");
        console.log(payload);
    } catch (err) {
        console.error("❌ Google token verification failed:", err.message);
    } finally {
        mongoose.connection.close();
    }
}

verifyGoogleToken();
