import { render } from '@react-email/components';

import { Router } from "express";
import { pool } from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JwtPayload, User } from "../types/authType.js";
import SendEmailUi from '../utils/react-email-starter/emails/SendEmail.js';
import SendEmail from '../lib/sendEmail.js';
import { forgotPasswordController, loginController, ResetPasswordController, signupController } from '../controllers/auth.controller.js';



const route = Router();


route.post('/signUp', signupController);



route.post('/login', loginController);


route.post('/forgot-password', forgotPasswordController);

route.post('/reset-password/:token', ResetPasswordController);


// refresh Token 

route.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).send('Refresh token is required');
  }


  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET as string) as JwtPayload;
    const userId = decoded.userId;
    const User = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);

    if (User.rows.length > 0) {
      const accessToken = jwt.sign({ userId }, process.env.ACCESS_JWT_SECRET as string, { expiresIn: '1d' })
      return res.status(200).json({ message: "token regenerated succefully", accessToken })
    }
  } catch (error) {
    return res.status(500).send('Internal Server Error');
  }
});


// hydration Endpoint

route.get('/me', async (req, res) => {
       
})






export default route;   




// [7:59 PM, 2/12/2026] Sir Golden (Supervisor): I see that you implement handlers on your routes. Would nearer if your separate the handlers as controllers
// [7:59 PM, 2/12/2026] Sir Golden (Supervisor): Also, you have your queries in your handlers
// [8:00 PM, 2/12/2026] Sir Golden (Supervisor): Imagine you want to switch to MySQL or another db. It will require you to make a lot of edits.
// [8:00 PM, 2/12/2026] Sir Golden (Supervisor): You can create a repository for your db queries and then use them across your code base.
// [8:08 PM, 2/12/2026] Sir Golden (Supervisor): Extract the handlers from the route to be controllers.

// The controller should only handle validation and whitelisting. It should call a service.

// Extract core logic to a service.  please explain what he means and how i can implement this