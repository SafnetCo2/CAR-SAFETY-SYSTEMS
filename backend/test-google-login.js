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
const TEST_GOOGLE_TOKEN = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjJkN2VkMzM4YzBmMTQ1N2IyMTRhMjc0YjVlMGU2NjdiNDRhNDJkZGUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI3MjA2MDU2MzcxMDQtOWM0bWIzdW9vbThlM2I3NTR2amZmNTBuaDRkNTNodGsuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI3MjA2MDU2MzcxMDQtOWM0bWIzdW9vbThlM2I3NTR2amZmNTBuaDRkNTNodGsuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTYyMTkzODg0MTQwMzMwODYwMDYiLCJlbWFpbCI6ImtpbW15am11ZW5pQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYmYiOjE3NTY2MzY0MTQsIm5hbWUiOiJKb3NlcGhpbmUgTnppb2thIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0lrYWl4R0l6OU1Nd1hDMG90eEV6bnI1Mnc0SnNYWmRTSXJrc2JSbGhrMnpSM241Zz1zOTYtYyIsImdpdmVuX25hbWUiOiJKb3NlcGhpbmUiLCJmYW1pbHlfbmFtZSI6Ik56aW9rYSIsImlhdCI6MTc1NjYzNjcxNCwiZXhwIjoxNzU2NjQwMzE0LCJqdGkiOiIxMzkyMWJjMDk5MWM0ZjlhZTZiZTQ3NjYxNmQ5M2E4N2I0NGM5YmYwIn0.nwk0-jK4 - UR9xYbqrkjQIX54zsGxhilI1EIXvwmLg8dNTuHcI1A7gNSdG_yJ4TwTP1v1PS7i862e5YtI_OubLacT9utzb3_TPeU13VbIOUcRIg32iLBQksII3YM5Aij70YI6aOfuqJTJmDI8WVH7UEuA2Op - hG9E9WzfUWXRLynmM9Yhc5ntmsTVSw9dm2zo1tp33bMfKhin3Vv8iewajpUCJp9RhH2b0jqvPsgOPWa3g3lae - 5UVJfdi4FPRX8lRVa0RUcp6C4mMjtXPgbt - TYzxVV3dejcP9vrYLTw5OsSQNMgy41Eb_0ww_HXpS32VvClU7g2QplqLvmsRkqSuQ";

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
