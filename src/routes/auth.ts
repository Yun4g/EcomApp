
import { Router } from "express";
import { pool } from "../db/db.js";



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
        error: 'A user with this email already exists.'  
      });
    }

    const newUser = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, password]
    );
   return res.json({message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ 
      error: 'An error occurred while creating the user.' 
    });
  }
});


export default route;   