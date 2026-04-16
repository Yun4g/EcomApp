import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoute from './routes/auth.route.js';
import ProductRoute from './routes/product.route.js'
import orderRoute from "./routes/order.route.js"
import { fetchProduct } from './utils/product.js';
import passport from 'passport';
import "./config/passport.js"
import session from 'express-session'


dotenv.config();

const server = express();

server.use(express.json());
server.use(cors({
  origin: '*',
  methods: ["POST", "GET", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true
}));


server.use(
  session({
    secret: process.env.SESSION_KEY as string,
    resave: false,
    saveUninitialized: false
  })
)

server.use(passport.initialize());
server.use(passport.session());

 



fetchProduct();



// Routes 
server.use('/api', authRoute)
server.use('/api', ProductRoute)
server.use('/api/orders', orderRoute)

server.use('/dashboard',  async (req, res) => {
  return res.send('Welcome to the Dashboard');
})

server.use('/login',  async (req, res) => {
  return res.send('Welcome to the Login Page');
})

server.get('/', async (req, res) => {
  return res.send('Welcome to the server');
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
