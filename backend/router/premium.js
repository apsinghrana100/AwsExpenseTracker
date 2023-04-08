const express=require('express');
const router=express.Router();
const controller=require('../controller/premiumC');
const authen=require('../middleware/auth');

 router.get('/purchasepremium',authen.authenticate,controller.premiumcontroller);
  router.put('/updatepremium',authen.authenticate,controller.updatepremiumcontroller);
  router.put('/premiumstatus',authen.authenticate,controller.paymentfailed);

//  router.get('/purchasepremium',(req,res,next)=>{
//     console.log("i am  here hidden");
//     next();
//  });

module.exports=router;