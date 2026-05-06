// This file initializes the app, configures middleware, and sets up core routes and error handlers.

import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

/* Route imports */
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import searchRoutes from './routes/search.js';
import profileRoutes from "./routes/profile.js";

/* Controller imports */
import { register } from './controllers/auth.js';
import { createPost } from './controllers/posts.js';

/* Middleware */
import { verifyToken } from './middleware/auth.js';

/* Database models */
import User from './models/User.js';
import Post from './models/Post.js';

/* Initial dummy data (for development only) */
import { users, posts } from './data/index.js';

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();


// Middleware to parse JSON and URL-encoded request bodies. This allows us to read data sent from frontend in POST/PUT requests.
app.use(express.json());
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

//  Helmet adds important HTTP security headers to protect against common vulnerabilities.
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

// Middleware: Logs incoming requests (method, url, response time)
app.use(morgan('common'));


// Middleware: Enables CORS for cross-origin requests
app.use(cors());

// Serves uploaded images from public/assets folder
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// FILE UPLOAD CONFIGURATION 
// Multer is used for handling file uploads. This stores images in /public/assets directory.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/assets');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });


/* ROUTES WITH FILES */
app.post('/auth/register', upload.single('picture'), register);
app.post('/posts', verifyToken, upload.single('picture'), createPost);

// Mount API routes from routes folder
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/search', searchRoutes);
app.use("/api/profile", profileRoutes);

/* DATABASE CONNECTION 

 Connects backend to MongoDB Atlas
 If connection succeeds → Server starts
 If fails → Error is logged
 */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) =>
    console.log(
      `Failed to connect to MongoDB. Check MONGO_URL and database availability. Error: ${error.message}`
    )
  );
