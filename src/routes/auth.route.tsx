import { render } from '@react-email/components';

import { Router } from "express";
import { pool } from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JwtPayload, User } from "../types/authType.js";
import SendEmailUi from '../utils/react-email-starter/emails/SendEmail.js';
import SendEmail from '../lib/sendEmail.js';
import { forgotPasswordController, hydration, loginController,  RefreshTokenController,  ResetPasswordController, signupController } from '../controllers/auth.controller.js';



const route = Router();


route.post('/signUp', signupController);



route.post('/login', loginController);


route.post('/forgot-password', forgotPasswordController);

route.post('/reset-password/:token', ResetPasswordController);


// refresh Token 

route.post('/refresh-token', RefreshTokenController);


// hydration Endpoint

route.get('/me', hydration)






export default route;   




