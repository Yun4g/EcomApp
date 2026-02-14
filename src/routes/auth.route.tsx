import { render } from '@react-email/components';

import { Router } from "express";
import { pool } from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JwtPayload, User } from "../types/authType.js";
import SendEmailUi from '../utils/react-email-starter/emails/SendEmail.js';
import SendEmail from '../lib/sendEmail.js';
import { loginController, signupController } from '../modules/auth/auth.controller.js';



const route = Router();


route.post('/signUp', signupController);



route.post('/login', loginController);


route.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).send('Email is required');
    }

    const ExistingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (ExistingUser.rows.length === 0) {
      return res.status(400).json({ message: "user with the given email does not exists" })
    }

    const link = {
      url: "http://localhost:3000/reset-password",
      text: "Reset Password"
    }
    const html = await render(
      <SendEmailUi
        heading="Welcome to Our Service"
        message="example.com is excited to have you on board. Please verify your email to get started."
        link={link}
        footer="If you did not sign up for this account, please ignore this email." />
    )
    await SendEmail(email, "Reset Password", html);

    return res.status(200).json({ message: "Password reset email sent" });

  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
});

route.post('/reset-password/:token', async (req, res) => {
  const { email, newPassword } = req.body;
  const { token } = req.params;

  try {

    if (!email || !newPassword) {
      return res.status(400).send('Email and new password is required');
    }

    if (token) {
      return res.status(400).send('token is required');
    }

    const ExistingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (ExistingUser.rows.length > 0) {
      return res.status(400).json({ message: "user with the given email does not exists" })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query("UPDATE users SET password = $1 WHERE email = $2", [hashedPassword, email]);
    return res.status(200).json({ message: "Password reset successfully" });

  } catch(error) {
      return res.status(500).send('Internal Server Error');
  }

})


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