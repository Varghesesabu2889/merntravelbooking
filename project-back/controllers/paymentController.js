// paymentController.js

import dotenv from 'dotenv';
import stripe from 'stripe';

dotenv.config();

const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

// Controller function to create a payment intent
const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body; // Amount to charge, you can pass this from the frontend

    const paymentIntent = await stripeClient.paymentIntents.create({
      amount,
      currency: 'usd', // Change this to your desired currency
    });

    res.status(200).json({ client_secret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Payment intent creation error:', error.message);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
};

export { createPaymentIntent };
