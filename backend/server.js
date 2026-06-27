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
    "http://localhost:5173",
    "http://localhost:5174",
    "https://strive-app-frontend.onrender.com"
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

// app.options('*', cors({
//     origin: allowedOrigins,
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"]
// }));

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

    // // ✅ Ensure Express is fully initialized
    // setTimeout(() => {
    //     if (!app._router) {
    //         console.error("🚨 ERROR: Express router is not initialized.");
    //         return;
    //     }

    //     console.log("🔍 Debugging Routes...");
    //     app._router.stack.forEach((middleware) => {
    //         if (middleware.route) { 
    //             console.log(`✅ Route: ${middleware.route.path}`);
    //         } else if (middleware.name === 'router') {
    //             middleware.handle.stack.forEach((handler) => {
    //                 if (handler.route) {
    //                     console.log(`✅ Route: ${handler.route.path}`);
    //                 }
    //             });
    //         }
    //     });
    //     console.log("✅ Finished route debugging.");
    // }, 500); // ✅ Delay execution to ensure Express initializes

});
