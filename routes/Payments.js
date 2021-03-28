const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
var User = require('../models/User');
const Razorpay = require("razorpay");
const crypto = require('crypto')


const instance = new Razorpay({
  key_id: process.env.RAZORPAY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

router.post('/orders',(req,res)=>{
  const options = {
    amount: 50000, // amount in smallest currency unit
    currency: "INR",
    receipt: "receipt_order_74394",
};

  instance.orders.create(options)
    .then((order)=>{
      if(order){
        res.json({
          order,
          msg:"Success",
          status:true
        })
      }else{
        res.json({
          msg:"Error",
          status:false
        })
      }
    })
})

router.post('/success',(req,res)=>{
  // console.log(req.body)
  const {
    orderCreationId,
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature,
} = req.body.data
  // console.log(razorpaySignature)
  // generated_signature = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
  const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
  shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
  const digest = shasum.digest("hex");
  // console.log(digest)

  if (digest !== razorpaySignature)
      return res.status(400).json({ msg: "Transaction not legit!" });

  res.json({
      msg: "success",
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      status:true
  });
})



module.exports = router;
