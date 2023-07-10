const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, "Please Enter product name here"]
    },
    description:{
        type:String,
        required: [true, "Please enter product description"]
    },
    price:{
        type:Number,
        required: [true, "Please enter product Price"],
        maxLength: [8, "Price cannot exceed 8 characters"]
    },
    rating:{
        type:Number,
        default: 0
    },
    images:[
        {
            public_id:{
                type: String,
                required: true
            },
            url:{
                type: String,
                required: true
            }
        }
    ],
    category:{
        type: String,
        required: [true, "Please Enter Product Category"]
    },
    stock:{
        type: Number,
        required: [true, "Please Enter product stock"],
        maxLength: [4, "Stock cannot exceed 4 characters"]
    },
    numOfReviews: {
        type: Number,
        default:0
    },
    reviews: [
        {
            name:{
                type:String,
                required:true
            },
            rating:{
                type:String,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref : "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Product", productSchema);