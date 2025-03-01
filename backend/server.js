import React from 'react'
import express, { urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { connect } from 'mongoose'
import connectDB from './utils/db.js'
import userRoute from './routes/user.route.js'
import postRoute from './routes/post.route.js'

dotenv.config({});

const app = express();

const allowedOrigins = [
    'http://localhost:5173',  // Local development frontend
    'https://strive-app-frontend.onrender.com'  // Deployed frontend
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

app.options("*", cors(corsOptions));

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    return res.status(200).json({
        message: "coming from backend",
        success: true
    })
})

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//calling our APIs -->
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server listening at port ${PORT}`)
})