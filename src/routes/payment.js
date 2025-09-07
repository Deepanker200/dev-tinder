const express = require("express");
const crypto = require("crypto");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const { membershipAmount } = require("../utils/constants");
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');
const User = require("../models/user");


paymentRouter.post("/payment/create", userAuth, async (req, res) => {
    try {

        const { membershipType } = req.body;
        const { firstName, lastName, emailId } = req.user

        const order = await razorpayInstance.orders.create({
            amount: membershipAmount[membershipType] * 100,
            currency: "INR",
            receipt: "receipt#1",
            payment_capture: 1,  // 1 = auto-capture, 0 = manual
            notes: {
                firstName,
                lastName,
                emailId,
                membershipType: membershipType
            }
        })

        //Save it in my Database
        console.log(order);

        const payment = new Payment({
            userId: req.user._id,
            orderId: order.id,
            status: order.status,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            notes: order.notes
        });

        const savedPayment = await payment.save();

        //Return back my order details to frontend
        res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });

    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
})

paymentRouter.post(
    "/payment/webhook",
    express.raw({ type: "application/json" }), // use raw body for signature verification
    async (req, res) => {
        try {
            console.log("Webhook Called");

            const webhookSignature = req.get("X-Razorpay-Signature");
            console.log("Webhook Signature", webhookSignature);

            const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
            const body = req.body.toString(); // raw body as string

            // Validate webhook signature
            const expectedSignature = crypto
                .createHmac("sha256", secret)
                .update(body)
                .digest("hex");

            if (webhookSignature !== expectedSignature) {
                console.log("Invalid Webhook Signature");
                return res.status(400).json({ msg: "Webhook signature is invalid" });
            }

            console.log("Valid Webhook Signature");

            // Parse JSON payload
            const payload = JSON.parse(body);
            const paymentDetails = payload.payload.payment.entity;

            // Update payment in DB
            const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
            if (!payment) {
                return res.status(404).json({ msg: "Payment record not found" });
            }

            payment.status = paymentDetails.status;
            await payment.save();
            console.log("Payment saved");

            // Update user as premium
            const user = await User.findById(payment.userId);
            if (user) {
                user.isPremium = true;
                user.membershipType = paymentDetails.notes.membershipType;
                await user.save();
                console.log("User updated as premium");
            }

            return res.status(200).json({ msg: "Webhook received successfully" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ msg: err.message });
        }
    }
);

paymentRouter.get("/premium/verify", userAuth, async (req, res) => {
    const user = req.user;

    if (user.isPremium) {
        return res.json({ isPremium: true })
    }
    return res.json({ isPremium: false })
})

module.exports = paymentRouter;
