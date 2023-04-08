const express=require('express');
const router=express.Router();
const controller=require('../controller/signupcontroller');

router.post('/signuppage',controller.addpostdata);
router.post('/loginpage', controller.logincred);
module.exports=router;