import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';  // Corrected import
import userRoute from './routes/user.route.js';
import postRoute from './routes/post.route.js';

import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

// Convert __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ CORS Configuration
const allowedOrigins = [
    "http://localhost:5173",  // Local frontend (development)
    "https://strive-app-frontend.onrender.com"  // Deployed frontend (production)
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,  // ✅ Required for authentication cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// ✅ Database Connection
connectDB();

// ✅ API Routes (MUST BE ABOVE Frontend Serving)
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);

// ✅ Serve frontend (AFTER API Routes)
const frontendPath = path.resolve(__dirname, "./client/dist"); 
console.log("🛠️ Serving frontend from:", frontendPath);  // ✅ Debug path
console.log("🛠️ Checking if index.html exists:", path.resolve(frontendPath, "index.html"));
app.use(express.static(frontendPath));

// ✅ Redirect unknown routes to index.html (React Router Fix)
app.get("/", (req, res) => {
    const indexPath = path.resolve(frontendPath, "index.html");
    console.log("🛠️ Checking if index.html exists:", indexPath);
    console.log("🛠️ Attempting to serve:", indexPath);  // ✅ Debug index.html path
    
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error("❌ Error serving index.html:", err);
            res.status(500).send("Server error: Cannot load frontend");
        }
    });

});

// ✅ Server Listener
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server listening at port ${PORT}`);
});



//checking faulty route
// app._router.stack.forEach((middleware) => {
//     if (middleware.route) { 
//         console.log(`✅ Route: ${middleware.route.path}`);
//     } else if (middleware.name === 'router') {
//         middleware.handle.stack.forEach((handler) => {
//             if (handler.route) {
//                 console.log(`✅ Route: ${handler.route.path}`);
//             }
//         });
//     }
// });