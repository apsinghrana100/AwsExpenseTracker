const Sequelize=require('sequelize');
const connection=require('../util/connection');

const user=connection.define('tbluserdetail',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull: false,
        primaryKey:true
    },
    username:Sequelize.STRING,
    useremailid:{
        type:Sequelize.STRING,
    },
    userpass:Sequelize.STRING,
    ispremium:{
       type:Sequelize.INTEGER,
       defaultValue:0
    },
    totalexpense:{
        type:Sequelize.BIGINT,
        defaultValue:0
    }


});

module.exports=user;