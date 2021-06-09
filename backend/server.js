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
const user = require('./routes/user')
const comment = require('./routes/comment.js')
const cart = require('./routes/cart.js')
const placeOrder = require('./routes/placeOrder.js')
const CompareList = require('./routes/CompareList')

/* Module Importing Section End */

/* ------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------ */

const app = express()

// console.log("ooooo",process.env.DATABASE_URL)


const store = new MongoStore({
        uri :process.env.DATABASE_URL,
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
        origin : process.env.CORS_ORIGIN,
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
app.use('/user',user)
app.use('/comment',comment)
app.use('/cart',cart)
app.use('/place-order',placeOrder)
app.use('/comparelist',CompareList)
app.get("/",(req,res)=>{
        console.log("Everything's looks good to go..!")
})
    

/* ------------------------------------------------------------------------------------------ */


// Initiate the Server
app.listen(process.env.PORT,()=> console.log('Server is listening 8080'))

// Export section




