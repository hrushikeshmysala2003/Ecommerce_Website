const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        maxLength: [30, "Name cannot exceed 30 chars"],
        minLength: [4, "Name should be of atleast 4 characters"]
    },
    email: {
        type: String,
        required: [true, "Please enter your Email"],
        unique: true,
        validate: [ validator.isEmail , "Please enter a valid email" ]
    },
    password: {
        type: String,
        require: [true, "Please enter a password"],
        minLength: [8, "Password should be atleast 8 chars long"],
        select: false
    },
    avatar: {
        
        public_id:{
            type: String,
            required: true
        },
        url:{
            type: String,
            required: true
        }
        
    },
    role: {
        type: String,
        default: "user",
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,

});

// Here we used function keyword beacuse we will use this keyword
userSchema.pre("save", async function(next){
    // this condition ensures not to rehash the password if its not updated 
    if(!this.isModified("password")){
        next();
    }


    this.password = await bcrypt.hash(this.password, 10)
})

// JWT Token  : like login karne ke baad jo power aana hai voh ayegi

userSchema.methods.getJWTToken = function (){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    });
}


// Compare Password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}


// Generating Password Reset token
userSchema.methods.getResetPasswordToken = function(){
    // Generating token
    const resetToken = crypto.randomBytes(20).toString("hex")

    // Hashing and adding resetPassword Token to userSchema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;

}




module.exports = mongoose.model("User", userSchema);