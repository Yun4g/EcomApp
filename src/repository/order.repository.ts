import { pool } from "../db/db";





export const getPaymentReference = async () => {
    const reference = await pool.query('SELECT paymentReference FROM orders');
    console.log(reference);
    return reference.rows[0];
}


export const createOrder = async (userId: string, reference: string, amount: number, ) => {
     const order = await pool.query('INSERT INTO orders (user_id, paymentReference, total_price) VALUES ($1, $2, $3) RETURNING *', [userId, reference, amount]);
     return order.rows[0];
}


 export const createOrderItemDetails = async (orderId: string, productId: string, quantity: number) => {
        const orderItemDetails = await pool.query('INSERT INTO order_item_details (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *', [orderId, productId, quantity]);
        return orderItemDetails.rows[0];
}


export const addBillingDetails = async ( user_id: string, order_id: string, company_address: string, street_address: string, city: string, phoneNumber: string, email:string) => {
        const billingDetails = await pool.query('INSERT INTO billing_details (user_id, order_id, company_address, street_address, city, phone_number, email) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [user_id, order_id, company_address, street_address, city, phoneNumber, email]);
        return billingDetails.rows[0];
}