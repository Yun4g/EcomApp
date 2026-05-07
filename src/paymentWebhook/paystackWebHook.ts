
import { Request, Response } from "express";
import { createHmac } from "node:crypto";
import { addBillingDetails, createOrder, createOrderItemDetails, getPaymentReference } from "../repository/order.repository";





export const paymentWebHook = async (req: Request, res: Response) => {
       const hash = createHmac('sha512', process.env.PAYSTACK_SECRET_KEY as string).update(JSON.stringify(req.body)).digest('hex');

        //  verify if the hash matches the signature sent by Paystack
         if (hash !== req.headers['x-paystack-signature']) {
            return res.status(400).json({ message: "Invalid signature" });
         }


         if (req.body.event ===  "charge.success") {
            // check if the transaction has been successful before
            const verifyTransaction = await getPaymentReference(req.body.data.reference);
             if (verifyTransaction) {
                return res.status(200).json({ message: "Transaction already processed" });
             }



            const { reference, amount, metadata } = req.body.data;

           const CreateOrder =  await createOrder(metadata.user_id, reference, metadata.totalPrice);   

             await createOrderItemDetails(CreateOrder.id, metadata.productId, metadata.quantity);

             await addBillingDetails(metadata.user_id, CreateOrder.id, metadata.companyAddress, metadata.streetAddress, metadata.city, metadata.phoneNumber, metadata.email)
             
           
            console.log('Payment successful:', { reference, amount, metadata });

            return res.status(200).json({ message: "Payment processed successfully" });
         } else {
            console.log('Unhandled event type:', req.body.event);
            return res.status(200).json({ message: "Event type not handled" });
            
        
         }



}