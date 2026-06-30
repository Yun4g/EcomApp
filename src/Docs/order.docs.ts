

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order and payment endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderRequest:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *         - user_id
 *         - totalPrice
 *         - companyAddress
 *         - streetAddress
 *         - city
 *         - phoneNumber
 *         - email
 *       properties:
 *         productId:
 *           type: string
 *           example: "prod_123"
 *         quantity:
 *           type: integer
 *           example: 2
 *         user_id:
 *           type: string
 *           example: "user_456"
 *         totalPrice:
 *           type: number
 *           example: 5000
 *           description: Price in Naira (will be converted to kobo automatically)
 *         companyAddress:
 *           type: string
 *           example: "123 Company Street"
 *         streetAddress:
 *           type: string
 *           example: "45 Main Avenue"
 *         city:
 *           type: string
 *           example: "Lagos"
 *         phoneNumber:
 *           type: string
 *           example: "08012345678"
 *         email:
 *           type: string
 *           example: "customer@example.com"
 *
 *     OrderResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Order placed successfully
 *         reference:
 *           type: string
 *           example: "7PVGX8MEk85tgeEpVDtD"
 *           description: Paystack transaction reference
 *         payment_url:
 *           type: string
 *           example: "https://checkout.paystack.com/7PVGX8MEk85tgeEpVDtD"
 *           description: URL to redirect user to complete payment
 *
 *     WebhookRequest:
 *       type: object
 *       properties:
 *         event:
 *           type: string
 *           example: "charge.success"
 *           description: Paystack webhook event type
 *         data:
 *           type: object
 *           properties:
 *             reference:
 *               type: string
 *               example: "7PVGX8MEk85tgeEpVDtD"
 *             status:
 *               type: string
 *               example: "success"
 *             amount:
 *               type: integer
 *               example: 500000
 *               description: Amount in kobo
 *             metadata:
 *               type: object
 *               properties:
 *                 productId:
 *                   type: string
 *                 quantity:
 *                   type: integer
 *                 user_id:
 *                   type: string
 *                 totalPrice:
 *                   type: number
 *                 companyAddress:
 *                   type: string
 *                 streetAddress:
 *                   type: string
 *                 city:
 *                   type: string
 *                 phoneNumber:
 *                   type: string
 *                 email:
 *                   type: string
 */

/**
 * @swagger
 * /order/payments:
 *   post:
 *     summary: Initialize a payment and place an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderRequest'
 *           example:
 *             productId: "prod_123"
 *             quantity: 2
 *             user_id: "user_456"
 *             totalPrice: 5000
 *             companyAddress: "123 Company Street"
 *             streetAddress: "45 Main Avenue"
 *             city: "Lagos"
 *             phoneNumber: "08012345678"
 *             email: "customer@example.com"
 *     responses:
 *       200:
 *         description: Order placed and Paystack payment initialized successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *             example:
 *               message: Order placed successfully
 *               reference: "7PVGX8MEk85tgeEpVDtD"
 *               payment_url: "https://checkout.paystack.com/7PVGX8MEk85tgeEpVDtD"
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: all fields are required
 *       500:
 *         description: Internal server error or Paystack API failure
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */

/**
 * @swagger
 * /order/webhook/paystack:
 *   post:
 *     summary: Paystack webhook handler
 *     tags: [Orders]
 *     description: |
 *       This endpoint receives webhook events from Paystack.
 *       It should NOT be called directly — it is only for Paystack's servers.
 *       Paystack sends a signature in the `x-paystack-signature` header for verification.
 *     parameters:
 *       - in: header
 *         name: x-paystack-signature
 *         required: true
 *         schema:
 *           type: string
 *         description: HMAC SHA512 signature from Paystack for request verification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WebhookRequest'
 *           examples:
 *             charge_success:
 *               summary: Successful payment event
 *               value:
 *                 event: "charge.success"
 *                 data:
 *                   reference: "7PVGX8MEk85tgeEpVDtD"
 *                   status: "success"
 *                   amount: 500000
 *                   metadata:
 *                     productId: "prod_123"
 *                     quantity: 2
 *                     user_id: "user_456"
 *                     totalPrice: 5000
 *                     companyAddress: "123 Company Street"
 *                     streetAddress: "45 Main Avenue"
 *                     city: "Lagos"
 *                     phoneNumber: "08012345678"
 *                     email: "customer@example.com"
 *     responses:
 *       200:
 *         description: Webhook received and processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Webhook received
 *       400:
 *         description: Invalid webhook signature
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid signature
 *       500:
 *         description: Internal server error
 */