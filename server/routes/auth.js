// Handles authentication-related routes like login.

import express from 'express';
import { login } from '../controllers/auth.js';
import { registerValidator, loginValidator, userIdValidator } from "../validators/userValidator.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post('/login', loginValidator, validate, login);

export default router;
