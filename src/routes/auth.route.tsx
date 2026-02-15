
import { Router } from "express";
import { forgotPasswordController, hydration, loginController,  RefreshTokenController,  ResetPasswordController, signupController } from '../controllers/auth.controller.js';



const route = Router();


route.post('/signUp', signupController);



route.post('/login', loginController);


route.post('/forgot-password', forgotPasswordController);

route.post('/reset-password/:token', ResetPasswordController);


// refresh Token 

route.post('/refresh-token', RefreshTokenController);


// hydration Endpoint

route.get('/me', hydration)






export default route;   




