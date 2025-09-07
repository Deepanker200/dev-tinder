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

paymentRouter.post("/payment/webhook", async (req, res) => {
    try {
        console.log("=== WEBHOOK CALLED ===");
        console.log("Event:", req.body.event);

        const webhookSignature = req.get("X-Razorpay-Signature");
        console.log("Webhook Signature:", webhookSignature);

        const isWebhookValid = validateWebhookSignature(
            JSON.stringify(req.body),
            webhookSignature,
            process.env.RAZORPAY_WEBHOOK_SECRET
        );

        if (!isWebhookValid) {
            console.log("Invalid Webhook Signature");
            return res.status(400).json({ msg: "Webhook signature is invalid" });
        }
        console.log("Valid Webhook Signature");

        // Only process captured payments
        if (req.body.event !== "payment.captured") {
            console.log("Event not payment.captured, ignoring");
            return res.status(200).json({ msg: "Event ignored" });
        }

        // Update payment status in DB
        const paymentDetails = req.body.payload.payment.entity;
        console.log("Looking for payment with orderId:", paymentDetails.order_id);

        const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
        
        if (!payment) {
            console.log("ERROR: Payment not found in database");
            return res.status(404).json({ msg: "Payment not found" });
        }

        console.log("Payment found:", payment._id);
        payment.status = paymentDetails.status;
        await payment.save();
        console.log("Payment status updated to:", paymentDetails.status);

        // Update user as premium
        console.log("Looking for user with ID:", payment.userId);
        const user = await User.findOne({ _id: payment.userId });
        
        if (!user) {
            console.log("ERROR: User not found in database");
            return res.status(404).json({ msg: "User not found" });
        }

        console.log("User found:", user.emailId || user.email);
        console.log("User BEFORE update:", {
            isPremium: user.isPremium,
            membershipType: user.membershipType
        });

        // Update user fields
        user.isPremium = true;
        user.membershipType = payment.notes?.membershipType;

        // Save user with error handling
        const savedUser = await user.save();
        
        console.log("User AFTER update:", {
            isPremium: savedUser.isPremium,
            membershipType: savedUser.membershipType
        });
        console.log("✅ User successfully updated as premium");

        return res.status(200).json({ msg: "Webhook processed successfully" });

    } catch (err) {
        console.error("❌ WEBHOOK ERROR:", err);
        return res.status(500).json({ msg: err.message });
    }
});

paymentRouter.get("/premium/verify",userAuth,async(req,res)=>{
    const user=req.user;

    if(user.isPremium){
        return res.json({isPremium:true})
    }
    return res.json({isPremium:false})
})

module.exports = paymentRouter;
