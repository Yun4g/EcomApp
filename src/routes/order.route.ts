import express, { Router } from "express";
import { orderController } from "../controllers/order.controller";
import { paymentWebHook } from "../paymentWebhook/paystackWebHook";

const route = Router();

route.post('/', orderController);
route.post('/webhook/paystack', express.raw({ type: "application/json" }), paymentWebHook);

export default route;