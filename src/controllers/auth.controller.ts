import { AuthRequest, User } from './../types/authType';

import jwt from 'jsonwebtoken';
import type { Request, Response } from "express";
import { forgotPasswordService, loginService, RefreshTokenService, ResetPasswordService, signUpService } from "../service/auth.service";
import { ApiError } from '../utils/error';
import { checkExistingUserRepo, findUserById } from '../repository/auth.repository';
import { JwtPayload } from '../types/authType';


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
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    } else {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}


export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Email and password are required.'
    });
  }


  try {
    const User = await loginService({ email, password });

    const accessToken = jwt.sign({ userId: User.id }, process.env.ACCESS_JWT_SECRET as string, { expiresIn: '1d' });
    const RefreshToken = jwt.sign({ userId: User.id }, process.env.REFRESH_JWT_SECRET as string, { expiresIn: '7d' });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie('refreshToken', RefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({ message: "Login successful", User });
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

}



export const forgotPasswordController = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "email is required" });
  }

  const existingUser = await checkExistingUserRepo(email);

  if (!existingUser) {
    return res.status(400).json({ message: "User does not exist" });
  }

  try {
    await forgotPasswordService(email);

    return res.json({ message: 'Email Reset link sent successfully' });
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }


  }
}



export const ResetPasswordController = async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;
  const { token } = req.params;

  if (!email || !newPassword) {
    return res.status(400).send('Email and new password is required');
  }

  if (token) {
    return res.status(400).send('token is required');
  }

  try {
    const verifyToken = jwt.verify(token, process.env.ACCESS_JWT_SECRET as string);
    if (verifyToken) {
      return res.status(400).json({ message: "Invalid token or expired token" })
    }

    const User = await ResetPasswordService(email, newPassword);
    return res.status(200).json({ message: "Password reset successfully", user: User });

  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ message: "Internal Server Error" })
    }
  }

}


export const RefreshPasswordController = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).send('Refresh token is required');
  }

  try {
    const accessToken = await RefreshTokenService(refreshToken);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
    })
    return res.status(200).json({ message: "token generated successfully" })
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ message: "Internal Server Error" })
    }

  }
}


export const hydration = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;

  const user = await findUserById(userId!);

  return res.json({ user });
};



export const LogoutController = async (req: Request, res: Response) => {
  try {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ message: "Internal Server Error" })
    }

  }
}