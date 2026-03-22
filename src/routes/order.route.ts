import { Router } from "express";
import { orderController } from "../controllers/order.controller";

const route = Router();

route.post('/', orderController);

export default route;