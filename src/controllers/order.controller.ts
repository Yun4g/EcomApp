import { Request, Response } from "express";



export const orderController = async (req: Request, res: Response) => {

    //   (price / 100).toFixed(2)
    try {
        res.status(200).json({ message: "Order placed successfully" })
    } catch (error) {
          res.status(500).json({ error: "Internal Server Error" });
    }
}
