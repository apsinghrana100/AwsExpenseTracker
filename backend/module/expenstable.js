const Sequelize=require('sequelize');
const connection=require('../util/connection');

const expenstable=connection.define('expensetbl',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    expense:Sequelize.INTEGER,
    choice:Sequelize.STRING,
    description:Sequelize.STRING
});

module.exports=expenstable;