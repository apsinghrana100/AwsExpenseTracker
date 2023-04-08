 const { json } = require('body-parser');
const Razorpay=require('razorpay');
const ordertbl=require('../module/ordertbl');
const usertbl=require('../module/usertable');

exports.premiumcontroller=async(req,res)=>{
    try {
        console.log("i am not calling1"+req.user.id);
        var razp=new Razorpay({
            key_id:process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_KEY_SECRET,
        })
        const amount=2500;

        razp.orders.create({amount,currency:'INR'},(err,order)=>{
            if(err){
                throw new Error(JSON.stringify(err));
            }
            console.log(order.id);
            ordertbl.create({
                orderid:order.id,
                status:'Pending',
                tbluserdetailId:req.user.id
            }).then(()=>{
                    console.log("success");
                    return res.status(201).json({order,key_id:razp.key_id});
                }).catch(err=>{
                    console.log("eroor"+err)
                });
    
        });

    } catch (error) {
        console.log(error);
        return res.status(403),json({message:"something went worng",error:error});
    }
};

exports.updatepremiumcontroller=async(req,res)=>{

    console.log(req.body.order_id);
     console.log(req.body.payment_id);
    try {

       const data= await ordertbl.findAll({where:{tbluserdetailId:req.user.id,orderid:req.body.order_id}});
       console.log("data"+data.length);
       if(data.length>0)
       {
        
                const updatedata= await ordertbl.update({
                    paymentid: req.body.payment_id,
                    status:'success'
                }, {
                    where: {
                        orderid:req.body.order_id
                    }
                });
               

                    if(updatedata)
                    {
                        const updateuser= await usertbl.update({
                            ispremium: 1
                        }, {
                            where: {
                                id:req.user.id
                            }
                        });

                        if(updateuser)
                        {
                            return res.status(200).json({message:"su22ccessfull"});
                        }

                        
                    }else
                    {
                        return res.status(400).json({message:"Unsuc22cessfull"});
                    }
               
            
       }else {
           throw new Error("Not a premium user");
       }

    } catch (error) {
        console.log(error);
        return res.status(400).json({message:"Uns33uccessfull"});
    }

}

exports.paymentfailed=async(req,res)=>{
try {
    console.log("payment faild"+req.body.payment_id);
    const updatedata= await ordertbl.update({
        //  paymentid: req.body.payment_id,
         status:'failed'
    }, {
        where: {
            orderid:req.body.order_id,
            tbluserdetailId:req.user.id
        }
    });
    return res.status(200).json({message:"update successfully"});
} catch (error) {
    return res.status(400).json({message:"update failed"});
}
   
};