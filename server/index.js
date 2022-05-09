import express from 'express'
import db from './config/db.js'
import router from './router/index.js'
import cors from 'cors'

const app = express()

try {
    await db.authenticate()
    console.log('Database Connected')
} catch (err) {
    console.error(err)
}

app.use(cors())

app.use(express.json({limit: '50mb'}))

app.use(router)

app.listen(5000, ()=>{
    console.log('Server is running')
})