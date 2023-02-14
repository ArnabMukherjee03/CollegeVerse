const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const favicon =  require('serve-favicon');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcrypt');
const {check, validationResult, cookie} = require('express-validator');


require("./Db/database");
require("./Db/passport")
const User = require("./models/user");
const { collection } = require('./models/user');

const saltRounds = 10;

const app = express();


app.set('view engine','ejs');
app.set('views','../templates/views');
app.set("trust proxy", 1);

// console.log(__dirname+'../../')


app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
app.use(express.static("../public"));
app.use(favicon(__dirname+'../../public/images/favicon.ico'))

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl : process.env.MONGO_URL,
        collectionName : "sessions",
    })
    // cookie: {secure:true}
}));
app.use(passport.initialize());
app.use(passport.session());


//  Pass Authentication
app.use(function(req,res,next){
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
})


// Index Page
app.get("/",(req,res)=>{
    res.render("index");
})


// About Us Page
app.get("/aboutus",(req,res)=>{
    res.render("about");
});


// Acces to use a page after Login
const checkauth = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }

    res.render("signin",{message:"You have to Login to access this Page"});
}

// Resources Page
app.get("/resources",checkauth,(req,res)=>{
    res.render("resources");
});

// Sign In Page

// Get Request
app.get("/SignIn",(req,res)=>{
    res.render("signin",{message: null,error: null});
});

// Post Request
app.post("/SignIn",[

],passport.authenticate("local",{
    failureRedirect:"/SignIn",
    successRedirect:"/",
})
   
)


// Sign Up Page

// Get Request
app.get("/SignUp",(req,res)=>{
    res.render("signup");
});
// Post Request
app.post("/SignUp",
[
check('fullname','This username must be 3+ charecters long')
.exists()
.isLength({min:3}),
check('username')
.custom((value) => {
    return User.findOne({ username: value }).then((user) => {
      if (user) {
        return Promise.reject('Email already exists');
      }
    })})
.isEmail()
.normalizeEmail()
.withMessage("Email is not valid"),
check('password').custom((password, { req }) => {
    if (password !== req.body.confirmpassword) {
      throw new Error('Password and Confirm password not matching');
    }else{
        return true;
    }
})
.isStrongPassword(
    {
        minLength: 6, 
        minLowercase: 1, 
        minUppercase: 1, 
        minSymbols: 1
    }).withMessage('Password is too weak.')
]
,async(req,res)=>{
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const alert = errors.array()
            res.render('Signup',{
                alert
            });
        }else{  
        const user = await User.findOne({username: req.body.username});
        if(user) return res.status(400).send("User Already Exist");
        bcrypt.hash(req.body.password, saltRounds, async(err,hash)=>{
            const newUser = new User({
                fullname : req.body.fullname,
                username: req.body.username,
                password : hash,
                confirmpassword: hash
            });
            await newUser.save();
        res.status(201).redirect("/SignIn");
        });
      }
    }catch(error){
        console.log(error);
    }
})

// Log Out

app.get("/Logout",(req,res)=>{
    try {
        req.logOut((err)=>{
            if(err){
                return next(err);
            }
            res.redirect("/");
        })
    } catch (error) {
        
    }
});

// BCA PAGE
app.get("/bca",checkauth,(req,res)=>{
    res.render("bca");
})
// Bhm Page
app.get("/bhm",checkauth,(req,res)=>{
    res.render("bhm");
})
// Bba Page
app.get("/bba",checkauth,(req,res)=>{
    res.render("bba");
})


app.get("*",(req,res)=>{
    res.send("Error Page");
})

// Exports Module
module.exports = app;
