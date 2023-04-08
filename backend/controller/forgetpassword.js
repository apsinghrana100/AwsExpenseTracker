
console.log('------------------------------------------------');
const sequelize=require('sequelize');
const Sequelize=require('../util/connection');
const bcrpt=require('bcrypt');
const expensemodule=require('../module/expenstable');
const tbluserdetail=require('../module/usertable');
const tblforgetpass=require('../module/ForgotPasswordRequests');
const authen = require('../middleware/auth');
const session = require('express-session'); 
const uuid=require('uuid');
const jwt=require('jsonwebtoken');
const { and } = require('sequelize');

console.log("********");
console.log(uuid.v4());
let storeuuid=uuid.v4();
console.log("********");

require('dotenv').config();


function detailencryption(id)// this function through we are encryption aur data with some special keys(secret key)
{
    return jwt.sign({userid:id},'sekreteky');
}

exports.forgetpassword=(async(req,res,next)=>{
    try {
        const data= await tbluserdetail.findAll({where:{useremailid:req.body.Emaild}}) // its return array of object
        console.log(data[0].id);
        console.log(data.length);
        const Sib=require('sib-api-v3-sdk');
        const client=Sib.ApiClient.instance

        const apiKey = client.authentications['api-key'];
        // apiKey.apiKey ='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';
        apiKey.apiKey ='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';
        console.log('------------------------------------------------');
        // console.log(process.env.API_KEY);
        // "xsmtpsib-e9b7bd55e81f06db7a5934d24fb925c9fa39ca3c973f41ed3c023b2d45dfc694-X1UdRZLgVY2mQG5w";
        
        const tranEmailApi = new Sib.TransactionalEmailsApi();
        
        const sender = {
          email :req.body.Emaild,
        }
        
        const receivers = [
          {
            email :'apsinghrana100@gmail.com',
          },
        ]
        

        if(data.length>0)
        {
           await tblforgetpass.create({
            id:storeuuid,
            tbluserdetailId:data[0].id,
            isActive:true
        });
            console.log("data found");
            tranEmailApi.sendTransacEmail({
              sender,
              to: receivers,
              subject: "Reset Password",
              textContent: "Send a reset password mail",
              htmlContent: `<a href="http://localhost:4000/Resetpassword?param1=${storeuuid}">Click here to process</a>`,
      
          }).then(response=>{
                return res.status(200).json({message:"Message send successfully",Userid:data[0].id});

              })
        }else{
          return res.status(400).json({message:"Something went wrong"});
        }

        // res.end();
    } catch (error) {
      return res.status(400).json({message:error});
    }
});


  exports.checkcreaditialUrl=(async (req,res)=>{
    try {
      //  res.redirect(`http://127.0.0.1:5500/fronted/resetpasswordform.htm`);
      console.log("hello ajay");
      // res.redirect("C:/Users/Abhijit singh/Desktop/javascrit/FullexpenseTrackerNodejs/fronted/resetpasswordform.htm")
      console.log(req.query.param1)
        const isValidRequestCheck=await tblforgetpass.findAll({where:{id:req.query.param1}});
        console.log(isValidRequestCheck.length);
        if(isValidRequestCheck.length > 0 && isValidRequestCheck[0].isActive===true)
        {

            tblforgetpass.update({
              isActive:false
            },{where:{id:req.query.param1}});
          console.log('i amm forget password');
          
            res.redirect(`http://127.0.0.1:5500/fronted/resetpasswordform.htm`);
        }else{
          // alert("Link is not valid ");
          console.log("Link is not valid ");
        }
    } catch (error) {
      console.log(error);
    //  alert(error);
    }
    console.log("i am reset password calling"+req.query.param1);
    res.end();
  })

  exports.updatepassword=(async(req,res)=>{
    console.log("i am updatepassword calling");
    console.log(req.params.id); 
    console.log("userpass"+req.body.newpass);
    const passowrd= req.body.newpass;
    const saltround=10;
    try {
      bcrpt.hash(passowrd,saltround, async(err,hash)=>{
        const ouput= await  tbluserdetail.update({ userpass: hash}, { where: { id: req.params.id } })
        console.log("output"+ouput);
               return res.json(true);
      })
          
  } catch (error) {
    console.log("errpr+"+error);
      return res.json(false);
      
  }

  })