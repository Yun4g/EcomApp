import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoute from './routes/auth.route.js';


dotenv.config();

const server = express();

server.use(express.json());
server.use(cors({
  origin: '*',
  methods: ["POST", "GET", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true
}));



// Routes 
server.use('/api', authRoute)


server.get('/', async (req, res) => {
     return res.send('Welcome to the server');
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

