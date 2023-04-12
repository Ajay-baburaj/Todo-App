import express from 'express'
const app = express()
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import nocache from 'nocache'
import router from './routes/index.js'
import appendHeader from './middlewares/addHeader.js'
import swaggerUI from 'swagger-ui-express'
import swaggerDocument from './swagger.json' assert { type: 'json' };




mongoose.connect(`${process.env.connectionString}Todo-list`,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log("database connect succesfully")
}).catch((err)=>{
    console.log(err.message)
})


app.set('views','./views')
app.set('view engine', 'ejs')

app.use(express.json())
app.use(cookieParser())
app.use(nocache())
app.use(express.urlencoded({ extended: true }))
app.use(appendHeader)
app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(swaggerDocument))


app.use('/',router)


app.listen(process.env.PORT|| '4000',()=>{
    console.log(`port is running ${process.env.PORT}`)
})
