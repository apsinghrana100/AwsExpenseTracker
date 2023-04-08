const Sequelize=require('sequelize');
const sequelize = require('../util/connection');
const connection=require('../util/connection');


const forgetPasswordRequest=connection.define('forgetPasswordRequest',{
    id:{
        type: Sequelize.STRING,
        allowNull:false,
        primaryKey: true 
    },
    isActive:Sequelize.BOOLEAN,
});

module.exports=forgetPasswordRequest;