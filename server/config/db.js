import { Sequelize } from "sequelize"

const db = new Sequelize('projects', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

export default db