
import { Router } from "express";
import { forgotPasswordController, GoogleController, hydration, loginController,  RefreshTokenController,  ResetPasswordController, signupController } from '../controllers/auth.controller.js';
import passport from "passport";




const route = Router();


route.post('/signUp', signupController);



route.post('/login', loginController);


route.post('/forgot-password', forgotPasswordController);

route.post('/reset-password/:token', ResetPasswordController);


// refresh Token 

route.post('/refresh-token', RefreshTokenController);


// hydration Endpoint

route.get('/me', hydration)



route.get('/google', 
    passport.authenticate('google', { scope: ['email', 'profile'] })
);


route.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    GoogleController
)




export default route;   




