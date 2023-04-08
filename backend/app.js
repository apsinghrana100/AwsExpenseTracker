const express=require('express');
const session = require('express-session');
const app=express();
const bodyperser=require('body-parser');

const cors=require('cors')
app.use(cors());
app.use(bodyperser.urlencoded({extended:true}));
app.use(bodyperser.json());

const sequelize=require('./util/connection');
const routerlogin=require('./router/signupmodule');
const routerexpense=require('./router/expense');
const routepremium=require('./router/premium');
const routepassword=require('./router/password');

const usertbl=require('./module/usertable');
const expenstbl=require('./module/expenstable');
const order=require('./module/ordertbl');
const forgetpassword=require('./module/ForgotPasswordRequests');
const downloadmodule=require('./module/downloadfilerecord');


const authen=require('./middleware/auth');
 app.use(routerlogin);
 app.use(routerexpense);
 app.use(routepremium);
app.use(routepassword);



usertbl.hasMany(expenstbl);
expenstbl.belongsTo(usertbl);
// usertbl.hasMany(expenstbl, { foreignKey: 'id' });
// expenstbl.belongsTo(usertbl, { foreignKey: 'tbluserdetailId' });
usertbl.hasMany(order);
order.belongsTo(usertbl);

usertbl.hasMany(forgetpassword);
forgetpassword.belongsTo(usertbl);   

usertbl.hasMany(downloadmodule);
downloadmodule.belongsTo(usertbl);

sequelize.sync().then((result)=>{
    app.listen(process.env.PortNumber || 4000);
}).catch(error=>{
    console.log(error);
});

