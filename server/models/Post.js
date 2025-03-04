const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Category = require("./Category");

const Post = sequelize.define("Post", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: User, key: "id"},
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Category, key: "id"},
    },
});

module.exports = Post;