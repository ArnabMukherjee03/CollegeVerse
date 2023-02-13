const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required:true
    },
    confirmpassword:{
        type: String,
        required:true
    }
});

const User = mongoose.model("User",registrationSchema);
module.exports = User;