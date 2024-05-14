const express = require("express");
const router = express.Router();
const Therapist = require("../models/therapistModel");
const { protect } = require("../middleware/authMiddleware");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/create-payment-intent", protect, async (req, res) => {
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount * 100,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

// Function to transfer to therapist's bank account
async function transferToBankAccount(therapistAccountId, amount) {
  try {
    const transfer = await stripe.transfers.create({
      amount: amount,
      currency: "usd",
      destination: therapistAccountId,
    });

    console.log(transfer);
    return transfer;
  } catch (error) {
    console.error("Error transferring to bank account:", error);
    throw error;
  }
}

// Function to charge therapist's credit/debit card
async function chargeCard(cardToken, amount) {
  try {
    const charge = await stripe.charges.create({
      amount: amount,
      currency: "usd",
      source: cardToken, // Token representing the therapist's credit/debit card
    });
    console.log(charge);
    return charge;
  } catch (error) {
    console.error("Error charging card:", error);
    throw error;
  }
}

// Endpoint to handle meeting completion and payment transfer
router.post("/completeMeeting", async (req, res) => {
  const { therapistId } = req.body;

  try {
    const therapist = await Therapist.findOne({ _id: therapistId });
    if (therapist) {
      const { hourlyRate, cardNumber, stripeId } = therapist;
      if (stripeId) {
        await transferToBankAccount(stripeId, hourlyRate);
      } else {
        await chargeCard(cardNumber, hourlyRate);
      }
    }

    // Respond with success message
    res.status(200).json({ message: "Payment successful" });
  } catch (error) {
    // Handle errors
    console.error("Error completing meeting and transferring funds:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the payment" });
  }
});

module.exports = router;
