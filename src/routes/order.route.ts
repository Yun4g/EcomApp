import express, { Router } from "express";
import { orderController } from "../controllers/order.controller";
import { paymentWebHook } from "../paymentWebhook/paystackWebHook";

const route = Router();

route.post('/payments', orderController);
route.post('/webhook/paystack', paymentWebHook);
export default route;