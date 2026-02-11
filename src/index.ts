import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { pool } from './db/db.js';

dotenv.config();

const server = express();

server.use(express.json());
server.use(cors({
  origin: '*',
  methods: ["POST", "GET", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true
}));

server.use(bodyParser.json());

// Routes

server.get('/', async (req, res) => {
    try {
        const testTime = await pool.query('SELECT NOW()');
        res.json({ message: 'Welcome to the E-commerce API', serverTime: testTime.rows[0].now });
    } catch (error) {
       return res.status(500).json({ error: 'An error occurred while processing the request.' });
    }
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

