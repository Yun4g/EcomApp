import { Router } from "express";
import { GetProductController } from "../controllers/product.controller";

const route = Router();

route.get('/products', GetProductController);

export default route;