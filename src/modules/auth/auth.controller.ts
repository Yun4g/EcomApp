import  jwt  from 'jsonwebtoken';
import type { Request, Response } from "express";
import { checkExistingUserRepo } from "./auth.repository";
import { loginService, signUpService } from "./auth.service";


export const signupController = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      error: 'Name, email, and password are required.'
    });
  }

  try {
    const User = await signUpService({ name, email, password });

    return res.json({ message: 'User created successfully', User });

  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(401).json({ error: error.message });
    } else {
      res.status(401).json({ error: "Signup failed" });
    }
  }
}


export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Name, email, and password are required.'
    });
  }


  try {
    const User = await loginService({ email, password });

    const accessToken = jwt.sign({ userId:  User.id }, process.env.ACCESS_JWT_SECRET as string, { expiresIn: '1d' });
    const RefreshToken = jwt.sign({ userId:  User.id }, process.env.REFRESH_JWT_SECRET as string, { expiresIn: '7d' });

    res.cookie('accessToken', accessToken,{
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie('refreshToken', RefreshToken,{
      httpOnly: true,
      secure: false,
      sameSite: 'none',
       maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({ message: "Login successful", User });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(401).json({ error: error.message });
    } else {
      res.status(401).json({ error: "Login failed" });
    }
  }

}