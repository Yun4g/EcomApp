import axios from "axios";  
import { Request, Response } from "express";



export const orderController = async (req: Request, res: Response) => {
    const { productId, quantity, user_id, totalPrice, companyAddress, streetAddress, city, phoneNumber, email } = req.body;


    if (!productId || !quantity || !user_id || !totalPrice || !companyAddress || !streetAddress || !city || !phoneNumber || !email) {
        return res.status(400).json({ message: "all fields are required" })
    }


    try {

        const paystackRes = await axios.post('https://api.paystack.co/transaction/initialize',
            {
                email,
                amount: totalPrice * 100, // convert to kobo
                metadata: {
                    productId,
                    quantity,
                    user_id,
                    totalPrice,
                    companyAddress,
                    streetAddress,
                    city,
                    phoneNumber,
                    email
                }
            }, 
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'

            }
        }
        )

         const { authorization_url, reference } = paystackRes.data.data;


        res.status(200).json({
             message: "Order placed successfully",
             reference,
             payment_url:authorization_url
             })
    } catch (error) {
        console.log('Error placing order:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
