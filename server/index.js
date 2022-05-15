import express from 'express'
import router from './router/index.js'
import cors from 'cors'

const app = express()

app.use(cors())

app.use(express.json({limit: '50mb'}))

app.use(router)

app.listen(process.env.PORT || 5000, ()=>{
    console.log('Server is running')
})