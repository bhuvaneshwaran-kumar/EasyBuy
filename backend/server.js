require('dotenv').config()
/* Module Importing Section Starts */
// Third-party module import section
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// Module that handle session.
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)

// Developer module import section
const authenticate = require("./routes/authenticate.js")
const product = require('./routes/product')
        /* Module Importing Section End */

/* ------------------------------------------------------------------------------------------ */

        /* Configuration Starts */
// Configuring CORS
var corsOptions = {
    origin: 'http://localhost:3000/*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }  
        /* Configuration Ends */

/* ------------------------------------------------------------------------------------------ */

const app = express()

// console.log("ooooo",process.env.DATABASE_URL)


const store = new MongoStore({
        uri :process.env.DATABASE_URL ,
        collection : 'mySession',
        expires: 1000 * 60 * 60 * 24 * 30
    })
store.on('error',(err)=>console.log(err))


 
/* Connecting to database  */

mongoose.connect(process.env.DATABASE_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useCreateIndex:true
})
.then(()=>console.log('Connected'))
.catch((err)=>console.log('error'))






/* ------------------------------------------------------------------------------------------ */

        /* Middlewares Starts */
// Third-party middleware
app.use(cors({
        origin : "http://localhost:3000",
        methods : ['GET','POST','PUT','DELETE'],
        credentials : true
}))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

    
app.use(session({
        secret : 'Keyboard cat',
        store : store,
        resave: false,
        saveUninitialized: true
    }))
    


// Developer middleware
app.use('/authenticate',authenticate)
app.use('/product',product)
app.get("/",(req,res)=>{
        console.log("geting req...")
})
    

/* ------------------------------------------------------------------------------------------ */


// Initiate the Server
app.listen(8080,()=>{
    console.log('Server is listeing 8080')
})

// Export section




