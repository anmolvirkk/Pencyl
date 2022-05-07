import { Sequelize } from "sequelize"
import db from "../config/db.js"

const {DataTypes} = Sequelize

const Project = db.define('projects', {
    id: {
        type: DataTypes.TEXT,
        primaryKey: true
    },
    project: {
        type: DataTypes.JSON
    }
}, {
    freezeTableName: true,
    timestamps: false
})

export default Project