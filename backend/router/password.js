const express=require('express');
const router=express.Router();
const controller=require('../controller/forgetpassword');
const authen=require('../middleware/auth');

router.post('/changepassword',controller.forgetpassword);
router.get('/Resetpassword',controller.checkcreaditialUrl);
router.put('/setnewpassword/:id',controller.updatepassword);

module.exports=router;