const Sequelize=require('sequelize');
require('dotenv').config();

const sequelize=new Sequelize(process.env.MYSQL_DATABASE_NAME,process.env.MYSQL_USERNAME,process.env.MYSQL_PASSWORD,
{
    dialect:'mysql',
    host:process.env.hostname
});

module.exports=sequelize;