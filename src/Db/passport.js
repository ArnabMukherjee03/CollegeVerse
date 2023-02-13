const User = require("../models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
// const { use } = require("passport");

passport.use(
    new LocalStrategy(async(username,password,done)=>{
        try {
            const user = await User.findOne({username:username});
            if(!user){
                return done(null,false,{error:"Invalid Details"});
            }
            if(!bcrypt.compare(password,user.password)){
                return done(null,false,{message:"Incorrect Password"});
            }
            return done(null,user);
        } catch (error) {
            return done(err);
        }
    })
)


passport.serializeUser((user,done)=>{
    done(null,user.id);
})

passport.deserializeUser(async(id,done)=>{
    try{
        const user = await User.findById(id);
        done(null,user);
    }catch(error){
        done(error, false);
    }
})