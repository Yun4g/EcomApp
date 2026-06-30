import express from 'express';
import cookieParser from 'cookie-parser'
import cors from 'cors';
import dotenv from 'dotenv';
import pgSession from 'connect-pg-simple';
import { pool } from './db/db.js'; 
import authRoute from './routes/auth.route.js';
import ProductRoute from './routes/product.route.js'
import orderRoute from "./routes/order.route.js"
import { fetchProduct } from './utils/product.js';
import passport from 'passport';
import "./config/passport.js"
import session from 'express-session'
import { DebugQuery } from './repository/auth.repository.js';
import { AuthMiddleware } from './middleware/authMiddleware.js';
import limiter from './middleware/rateLimiter.js';
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './config/swagger'


dotenv.config();

const server = express();



server.use('/api/webhook/paystack', express.raw({ type: 'application/json' }));


server.use(express.json());
server.use(cookieParser()) 
server.use(cors({
  origin: '*',
  methods: ["POST", "GET", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true
}));




const PgStore = pgSession(session);

server.use(
  session({
    store: new PgStore({
      pool,
      tableName: 'session',
      createTableIfMissing: true 
    }),
    secret: process.env.SESSION_KEY as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' 
    }
  })
);
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
server.use(passport.initialize());
server.use(passport.session());

 
 

fetchProduct();

 const existingUser = async () => {
      const user = await DebugQuery();
      console.log( "Existing User:", user);
 }

  existingUser();
// Routes 
server.use('/api', limiter, authRoute)
server.use('/api', AuthMiddleware, limiter,  ProductRoute)
server.use('/api', AuthMiddleware, limiter, orderRoute)

server.use('/dashboard',  async (req, res) => {
  return res.send('Welcome to the Dashboard');

})

server.use('/loginPage',  async (req, res) => {
  return res.send('Welcome to the Login Page');
})

server.get('/', async (req, res) => {
  return res.send('Welcome to the server');
});

server.get('/dashboard', AuthMiddleware, async (req, res) => {
    res.status(200).json({ message: 'Welcome to the dashboard' });
})

server.get('/health', async (req, res) => {
  return res.status(200).json({ message: 'Server is healthy' });
});

server.get('/reset-password/:id', async (req, res) => {
  return res.send('Reset password');
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
