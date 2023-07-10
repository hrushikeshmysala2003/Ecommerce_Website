const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const User = require("../models/userModel");

exports.registerUser = catchAsyncErrors( async(req, res, next) => {
    const {name, email, password} = req.body;

    const user = await User.create({
        name, email, password,
        avatar: {
            public_id:"This is a sample id",
            url:"profileUrl"
        }
    });
    // console.log(user);
    // const token = user.getJWTToken();
    // return res.status(201).json({
    //     success: true,
    //     user,
    // })
    sendToken(user, 201, res)

} )

exports.loginUser = catchAsyncErrors( async (req, res, next) => {
    const { email, password} = req.body;

    // checking if given password and email both
    if (!email || !password){
        return next(new ErrorHandler("Please Enter Email and Password", 400))
    }

    const user = await User.findOne({email: email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatched = user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    // const token = user.getJWTToken();
    // res.status(200).json({
    //     success: true,
    //     user,
    //     token
    // })
    sendToken(user, 200, res)
} )

// Logout User
exports.logout = catchAsyncErrors( async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: "Logged Out"
    })
} )

exports.forgotPassword = catchAsyncErrors( async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});

    if(!user){
        return next(new ErrorHandler("User Not found", 401))

    }

    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken()

    await user.save({validateBeforeSave: false}) 

    const resetpasswordUrl = `http://localhost/api/v1/password/reset/${resetToken}`
} )