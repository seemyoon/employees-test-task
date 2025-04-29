import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config()

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
});

const Employee = sequelize.define('Employee', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    position: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    hireDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    hours: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    rate: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    salary: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
});

sequelize.sync()
    .then(() => console.log('Database synced'))
    .catch(err => console.error('Error syncing database', err));

export { sequelize, Employee };