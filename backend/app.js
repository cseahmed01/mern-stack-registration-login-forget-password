import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import hpp from 'hpp';
import router from './routes/api.js';
import { MONGODB_CONNECTION, PORT, MAX_JSON_SIZE, URL_ENCODED, WEB_CACHE, REQUEST_LIMIT_NUMBER, REQUEST_LIMIT_TIME } from './app/config/config.js';
import fileUpload from 'express-fileupload';

// Import the User model to create the collection if it doesn't exist
import './app/models/User.js';

const app = express();
app.use(cors({
    origin: "*",  // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],  // Allow specific methods (or use ["*"] for all methods)
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],  // Allow specific headers
    credentials: true,  // Allow credentials (cookies, authorization headers, etc.)
}));
// Global Application Middleware
app.use(cors());
app.use(express.json({ limit: MAX_JSON_SIZE }));
app.use(express.urlencoded({ extended: URL_ENCODED }));
app.use(hpp());
app.use(helmet());
app.use(cookieParser());

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));

// Rate Limiter
const limiter = rateLimit({
    windowMs: REQUEST_LIMIT_TIME,
    max: REQUEST_LIMIT_NUMBER,
});
app.use(limiter);

// Web Caching
app.set('etag', WEB_CACHE);

// MongoDB connection
mongoose.connect(MONGODB_CONNECTION, { autoIndex: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });
app.get("/",(req, res)=>{
 res.json("THIS API PAGE.")
});
// Set API Routes
app.use('/api', router);

// Set Application Storage
app.use(express.static('storage'));

// Run Your Express Back End Project
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});
