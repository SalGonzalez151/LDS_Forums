const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const User = sequielize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type:DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM("user", "moderator", "admin"),
        allowNull: false,
        defaultValue: "user",
    }
});

module.exports = User;