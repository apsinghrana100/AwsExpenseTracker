const Sequelize=require('sequelize');
const connection=require('../util/connection');

const order=connection.define('ordertbl',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    paymentid:Sequelize.STRING,
    orderid:Sequelize.STRING,
    status:Sequelize.STRING
});

module.exports=order;