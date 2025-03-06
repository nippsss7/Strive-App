import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';  // Corrected import
import userRoute from './routes/user.route.js';
import postRoute from './routes/post.route.js';

dotenv.config();

const app = express();


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


app.options("*", cors());


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Backend is working!",
        success: true
    });
});


app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    connectDB();
    console.log(`Server listening at port ${PORT}`);
});
