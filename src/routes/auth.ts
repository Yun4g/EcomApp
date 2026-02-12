
import { Router } from "express";
import { pool } from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../types/authType.js";






const route = Router();


route.post('/signUp', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      error: 'Name, email, and password are required.'
    });
  }

  try {
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )
    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        error: ' user with this email already exists.'
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, hashedPassword]
    );

   const {password:_ , ...User } = newUser.rows[0]


    return res.json({ message: 'User created successfully', User});
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      error: 'An error occurred while creating the user.'
    });
  }
});



route.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).send('Email and password are required');
    }
    const User = await pool.query<User>("SELECT * FROM users WHERE email = $1", [email]);
    const ExistingUser = User.rows[0];

    if (!ExistingUser) {
      return res.status(400).json({ message: "user with the given email does not exists" })
    }

    const isValidPassword = await bcrypt.compare(password, ExistingUser.password );

    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid password' });
    }
 
    const accessToken = jwt.sign({ userId: ExistingUser.id }, process.env.ACCESS_JWT_SECRET as string, { expiresIn: '1d' });
    const RefreshToken = jwt.sign({ userId: ExistingUser.id }, process.env.REFRESH_JWT_SECRET as string, { expiresIn: '1d' });


    res.cookie("Accestoken", accessToken, {
       httpOnly: true,
       secure: false,
       sameSite: "none",
       maxAge: 24 * 60 * 60 * 1000
    })

    
    res.cookie("RefreshToken", RefreshToken , {
       httpOnly: true,
       secure: false,
       sameSite: "none",
       maxAge: 24 * 60 * 60 * 1000
    })


    return res.status(200).json({message: "user logged in succesfully"})


  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
})


export default route;   