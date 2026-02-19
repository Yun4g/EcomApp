import { Request, Response } from "express";
import { GetProduct } from "../repository/product.repositroy"
import { ApiError } from "../utils/error";



export const GetProductController = async (req: Request, res: Response) => {

    try {
        const getProduct = await GetProduct();
        return res.status(200).json({
            message: "Product fetched successfully",
            getProduct
        });
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({ error: error.message });
        } else {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }


}