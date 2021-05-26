const Router = require('express').Router()
const sgMail = require('@sendgrid/mail')
const bcrypt = require('bcrypt')
const User = require('../model/User.js')
const Label = require('../model/Label.js')
const Product = require('../model/Product.js')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

/**  Handles Signup Routes functionality */

Router.post("/signup", async (req, res) => {
  //  Checks weather the user is already exist.
  const existuser = await User.findOne({ "User.email": req.body.email })

  if (existuser) {
    res.statusCode = 201
    res.json({
      message: "User email is already exist ..! or You're not a verified user"
    })
    return
  }
  // ->

  //  Create a random 6 digit number
  const otp = Math.floor(100000 + Math.random() * 900000)
  // ->

  // Send's a mail to user using @sendgrid/mail module
  const email = {
    to: req.body.email, // Change to your recipient
    from: '"no-reply@Easy-buy.com"<bhuvaneshwarankumar2000@gmail.com >', // Change to your verified sender
    subject: 'Easy-buy Online Shopping ',
    text: `Your One Time Password is ${otp} `,
    html: `<strong>Your One Time Password is ${otp}</strong>`,
  }
  sgMail
    .send(email)
    .then(async () => {
      console.log('Email sent')
      const insertUser = await new User({
        "User": {
          name: req.body.name,
          email: req.body.email,
          password: await bcrypt.hash(req.body.password, 10),
          verify: {
            status: false,
            timespan: Date.now() + 300000,
            otp: otp
          }
        }
      })

      await insertUser.save()
        .then((data) => console.log(data))
        .catch((err) => console.log(err))

      res.statusCode = 202
      res.json({
        message: 'OTP has been sent to the email account verify it'
      })
    })
    .catch((error) => {
      console.error(error)
    })

})

/**  Handles Signup Routes functionality  with OTP*/

Router.post("/signup-otp", async (req, res) => {

  const user = await User.findOne({ "User.email": req.body.email })

  if (Date.now() < user.User.verify.timespan) {
    const otp = parseInt(req.body.otp)
    const dbOtp = parseInt(user.User.verify.otp)

    console.log("verified...")
    console.log(otp, "----", dbOtp)

    if (otp === dbOtp) {

      await User.updateOne({ "User.email": user.User.email }, { $set: { "User.verify.status": true } })

      res.statusCode = 201
      res.json({
        message: "OTP has been verified successfully.."
      })
    } else {
      res.statusCode = 202
      res.json({
        message: "OTP not matched.."
      })
    }
  } else {
    res.statusCode = 203
    res.json({
      message: "otp Timeout."
    })
  }

})


/**  Handles isLogged Routes functionality */

Router.post("/islogged", async (req, res) => {
  
  // Run for only once to create a label collection
  const CreateLabelCollection = async () =>{
    const products = await Product.find()
    console.log(products.length)
    const productLabel = products.map((product)=>product.plabel)
    const LabelInstance = await Label.insertMany({
      labelName : productLabel
    })
    LabelInstance.save()
  }
  // CreateLabelCollection()  

  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header('Access-Control-Allow-Credentials', 'true')

  if (req.session.isAuth === true) {
    const user = await User.findById(req.session._id)
    console.log(`${user.User.name} -> ${req.session._id} has logged In`)
    // console.log(user.User)
    res.statusCode = 201
    res.json({
      name: user.User.name,
      email: user.User.email,
      _id:req.session._id,
      loggedStatus: true,
      isSeller: user.User.isSeller || false,
      address:user.User.address,
      message: "you're already signed in"
    })
  } else {
    res.statusCode = 202
    res.json({
      loggedStatus: false,
      message: "you're not signed in"
    })
  }
})


/**  Handles Login Routes functionality */

Router.post("/login", async (req, res) => {

  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  try {
    const user = await User.findOne({ "User.email": req.body.email })
    const match = await bcrypt.compare(req.body.password, user.User.password)

    if (match) {
      req.session.isAuth = true
      req.session._id = user._id
      console.log("check session")
      res.statusCode = 201
      res.json({
        name: user.User.name,
        email: user.User.email,
        loggedStatus: true,
        _id:req.session._id,
        isSeller: user.User.isSeller || false, 
        address:user.User.address || false,
        message: "Sucessfully Logged in..."
      })
      console.log(`${user.User.name} has logged In`)
    } else {
      res.statusCode = 202
      res.json({
        loggedStatus: false,
        message: "password incorrect"
      })
    }
  }
  catch (err) {
    res.statusCode = 202
    res.json({
      loggedStatus: false,
      message: "User not Exist or You're not an valid user .."
    })
  }




})

/**  Handles Logouts Routes functionality */

Router.post("/logout", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header('Access-Control-Allow-Credentials', 'true')
  req.session.destroy()



  res.json({
    value: true
  })

})


/**  Handles SwitchToSeller Routes functionality */

Router.post('/switchtoseller', async (req, res) => {
  console.log("got a req...!:)")
  try {
    const user = await User.findById(req.session._id)
    console.log("try to switch account", user.User.email)
    user.User.isSeller = true
    user.User.address = [req.body]
    // console.log(req.body)
    await user.save()
    console.log('After adding shop address User :',user)
    res.statusCode = 200
    res.json({
      address : [...user.User.address],
      isSeller : user.User.isSeller
    })
  }
  catch (err) {
    console.log("error Caught->", err)
  }

  // res.json({ message: "Successfully executed query..." })
})

/**  Handles Forgot password Routes functionality */
Router.post('/forgotpwd', async (req, res) => {
  //  Checks weather the user is already exist.

  console.log("geting forgot pwd request", req.body.email)

  const existuser = await User.findOne({ "User.email": req.body.email })

  if (!existuser) {
    res.statusCode = 201
    res.json({
      message: "User email is Not valid"
    })
    return
  } else {

    //  Create a random 6 digit number
    const otp = Math.floor(100000 + Math.random() * 900000)
    // ->

    const email = {
      to: req.body.email, // Change to your recipient
      from: '"no-reply@Easy-buy.com"<bhuvaneshwarankumar2000@gmail.com >', // Change to your verified sender
      subject: 'Easy-buy Online Shopping - This OTP is for password reset.',
      text: `Your One Time Password is ${otp} `,
      html: `<strong>Your One Time Password is ${otp}</strong>`,
    }
    sgMail
      .send(email)
      .then(async () => {
        console.log('Email sent')
        //  const User = await User.find({"User.email" : req.body.email})
        existuser.User.verify.otp = otp
        existuser.User.verify.timespan = Date.now() + 300000
        await existuser.save()
          .then((data) => console.log(data))
          .catch((err) => console.log(err))

        console.log('done')
        res.statusCode = 202
        res.json({
          message: 'OTP has been sent to the email account verify it'
        })
      })
      .catch((error) => {
        console.error(error)
      })

  }
})

Router.post('/resetpwd', async (req, res) => {
  console.log('user confirming password', req.body)

  try {
    const existuser = await User.findOne({ "User.email": req.body.email })

    if (existuser) {
      existuser.User.password = await bcrypt.hash(req.body.password, 10)
      existuser.save()
      res.statusCode = 201
      res.json({
        message: 'Password updation was successfull.. Please login to continue'
      })
    } else {
      res.statusCode = 202
      res.json({
        message: 'User email is not valid...'
      })
    }
  }
  catch (err) {
    console.log(err)
  }
})



module.exports = Router