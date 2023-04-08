const sequelize=require('sequelize');
const Sequelize=require('../util/connection');

const bcrpt=require('bcrypt');
const expensemodule=require('../module/expenstable');
const tbluserdetail=require('../module/usertable');
const tbldownloadFile=require('../module/downloadfilerecord');
const authen = require('../middleware/auth');
const session = require('express-session');
const { where, INTEGER } = require('sequelize');
const { json } = require('body-parser');
const S3service=require('../Services/S3services');



  
exports.downloadexpensedata=async(req,res)=>{

      const username=req.user.id;
      try {
        
            const userdata= await expensemodule.findAll({where:{tbluserdetailId:req.user.id}});
            const stingyfyuserdata=JSON.stringify(userdata);
            const filename=`Expense${username}/${new Date()}.txt`;
            console.log(userdata);
            console.log("i am download calling"+stingyfyuserdata);
            const fileurl= await S3service.uploadS3(stingyfyuserdata, filename);
            console.log(fileurl);
            await tbldownloadFile.create({
                filename:fileurl,
                // expense:"lhjh",
                downloaddate:Date(),
                tbluserdetailId:req.user.id
            });
                res.status(200).json({fileurl,success:true});
    
        } catch (error) {
            res.status(500).json({fileurl:'',success:false,err:error});
        }
};


exports.addexpense=(async(req,res,next)=>{
    console.log(req.body.expense);
    console.log(req.body.choice);
    console.log(req.body.description);
    console.log("inser"+req.user.id);
    const expensevalue=parseInt(req.body.expense);
    const t= await Sequelize.transaction();
    
    try {
         await expensemodule.create({
                expense:req.body.expense,
                // expense:"lhjh",
                choice:req.body.choice,
                description:req.body.description,
                tbluserdetailId:req.user.id
               
             }, {transaction:t})
            //  
            // const totalexp= await tbluserdetail.findAll({
            //  attributes:['totalexpense']
            //  }, {where:{id:req.user.id}});
            //  const total=totalexp[0].totalexpense + parseInt(expensevalue);
            //   console.log("totaldata "+total);

            //   await  tbluserdetail.increment('totalexpense', { by: expensevalue });

            // ;
            //   await tbluserdetail.update({totalexpense:total},
            //     {where : {id:req.user.id},transaction:t
            //   }) 
            tbluserdetail.update(
                { totalexpense: sequelize.literal(`totalexpense + ${expensevalue}`) },
                { where: { id:req.user.id},transaction:t }
              ) 
              .then( async()=>{
                 await  t.commit();
                 console.log("sucessfull");
                return res.status(200).json({userid:req.user.id,success:true,msg:"Data Insert Successfully"})
              }).catch(async(error)=>{
                 await t.rollback();
                return res.status(400).json({success:false,msg:"Something Went Wrong"});
              });

            
    } catch (error) {
       await t.rollback();
        console.log("somewent wrong in addexpense"+error);
        return res.status(400).json({success:false,msg:"Something Went Wrong"});
    }
});

exports.fetchdata=(async(req,res,next)=>{
    console.log("i am fetch daling"+req.user.id);
    console.log("i am premi"+req.user.ispremium);
    
    try {
        const limit_per_page=parseInt(req.query.param2);
        const pageNumber=parseInt(req.query.param1)
        console.log("pagenumber----------"+pageNumber); 
        console.log("rowpersize----------"+req.query.param2);
        const totalitem=expensemodule.count({where:{tbluserdetailId: req.user.id}})
        .then(async(totalitem)=>{
            
       
          const expensedata= await expensemodule.findAll({  
                where:{
                    tbluserdetailId:req.user.id
                },
               
                offset:(pageNumber-1)*limit_per_page,
                limit:limit_per_page
            });
            console.log("data_length"+expensedata.length+""+expensedata);

            if(expensedata.length>0 && expensedata!==null && expensedata!==undefined)
            {
                res.status(200).json({success:true,msg:"Record Fetch successfully",expensedata,ispremiumuser:req.user.ispremium,
            currentPage:pageNumber,
            hasNextPage:limit_per_page*pageNumber<totalitem,
            nextPage:parseInt(pageNumber)+1,
            hasPreviousPage:pageNumber>1,
            previousPage:pageNumber-1,
            lastPage:Math.ceil(totalitem/limit_per_page)
        });
   
        }else if(expensedata.length===0){
            res.status(200).json({success:false,msg:"No Record Found",expensedata,ispremiumuser:req.user.ispremium});
        }
    });
    } catch (error) {
        res.status(400).json({success:false,msg:"Something went wrong"});
        throw new Error()
    }
})


// exports.fetchdata=(async(req,res,next)=>{
//     console.log("i am fetch daling"+req.user.id);
//     console.log("i am premi"+req.user.ispremium);
//     try {
//         const expensedata=await expensemodule.findAll({where:{tbluserdetailId:req.user.id}});
//         console.log("data"+expensedata.length);
//         if(expensedata.length>0 && expensedata!==null && expensedata!==undefined)
//         {
//             res.status(200).json({success:true,msg:"Record Fetch successfully",expensedata,ispremiumuser:req.user.ispremium});
//         }else if(expensedata.length===0){
//             res.status(200).json({success:true,msg:"No Record Found",expensedata,ispremiumuser:req.user.ispremium});
//         }
//     } catch (error) {
//         res.status(400).json({success:false,msg:"Something went wrong"});
//     }
// })




exports.deletedata=(async(req,res,next)=>{ //where:{id:req.params.id,tbluserdetailId:req.user.id}
    console.log(" i am dele"+req.user.id);
    try {
        console.log(" i am dele"+req.params.id);
                const deletedata=await expensemodule.destroy({where:{id:req.params.id,tbluserdetailId:req.user.id}});

        if(deletedata)
        {
            console.log("data deleted succfully"+deletedata);
            return res.status(200).json({success:true,msg:"data deleted successfully"})
        }

    } catch (error) {
        console.log("something went wrong in delete section");
        return res.status(400).json({success:false,msg:"something went wrong in delete sections"}) 
    }
})
,
            //   [sequelize.fn('SUM', sequelize.col('expense')), 'total_expense'
exports.leaderboarddata=(async (req,res)=>{
    console.log("show leaderboard is calling");
    try {
        // const leaderedata=await tbluserdetail.findAll({
        //     attributes:['id','username',[sequelize.fn('sum',sequelize.col('expensetbls.expense')),'total_cost']],
    
        //     include:[
        //        {
        //        model:expensemodule,
        //        attributes:[]
        //     }
        //    ],
        //    group:['tbluserdetail.id'],
        //    order:[['total_cost','DESC']],
        //  });

        //   console.log("data++++++++++++++++"+leaderedata.length+leaderedata[0].id);
   
        const leaderedata=await tbluserdetail.findAll({attributes:['id','username','totalexpense'],order:[['totalexpense','DESC']]});
        // const users=await tbluserdetail.findAll();
        // const expenseses= await expensemodule.findAll();
        // const userAggregated={};

        // console.log("------"+expenseses.length);
        // expenseses.forEach(element => {
        //     if(userAggregated[element.tbluserdetailId]){
            
        //     userAggregated[element.tbluserdetailId]=userAggregated[element.tbluserdetailId]+element.expense;
        //     console.log("---------------"+userAggregated);
        //     }else{
        //         console.log("---------------"+userAggregated);
        //         userAggregated[element.tbluserdetailId]=element.expense;
        //     }
        // });

        // var userLeaderBoardDetails =[];

        //     users.forEach((user)=>{
        //         userLeaderBoardDetails.push( {name: user.username, total_cost: userAggregated[user.id] || 0 }) ;
           
        //     });
        //     console.log(userLeaderBoardDetails);
        //     userLeaderBoardDetails.sort((a, b) => b.total_cost -a.total_cost);

        // console.log("---------------"+userAggregated);
        // return res.status(200).json(userLeaderBoardDetails);

        // res.status(200).json({success:true,msg:"Record Fetch successfully"});
        // console.log("data"+leaderedata.length);
        if(leaderedata.length>0 && leaderedata!==null && leaderedata!==undefined)
        {
            console.log("totalexpense"+leaderedata[1].totalexpense);
             res.status(200).json({success:true,msg:"Record Fetch successfully",leaderedata,ispremiumuser:req.user.ispremium});
        }else if(leaderedata.length===0){
            res.status(401).json({success:true,msg:"No Record Found",leaderedata,ispremiumuser:req.user.ispremium});
        }
    } catch (error) {
        res.status(400).json({success:false,msg:"Something went wrong in showleadboards"});
    }

});




exports.downloadexpensedataAllFile=(async(req,res)=>{
    try {
        const downloadFileData = await tbldownloadFile.findAll({where:{tbluserdetailId:req.user.id}});
        res.status(200).json({success:true,downloadFileData});
    } catch (error) {
        res.status(500).json({success:false,error:error});
    }

});

exports.isPremium=async(req,res)=>{
    try {
        const isPremium= await tbluserdetail.findAll({where:{id:req.user.id}});
        console.log("is----------"+isPremium[0].ispremium);
        res.json({ispremium:isPremium[0].ispremium});
    } catch (error) {
        console.log('something went wrong');
    }
}