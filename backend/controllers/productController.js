const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");
// Create Product ---admin
exports.createProduct = catchAsyncErrors(async (req, res) => {

    req.body.user = req.user.id 


    const product = await Product.create(req.body);

        res.status(201).json({
            sucess: true,
            product
        })
})


// Get all Products 
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
    const resultPerPage = 5;
    const productCount = await Product.countDocuments();
    const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage)
    // const products = await Product.find(); 
    const products = await apiFeatures.query;
    res.status(200).json({
        success: true,
        products,
        productCount
    })
})

exports.getProductDetatils = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if(!product){
        // return res.status(500).json({
        //     success: false,
        //     message: "Product not found"
        // })
        return next(new ErrorHandler("Product not found", 404));
    }
    res.status(200).json({
        success:true,
        product
    })
})


// Update product --admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if(!product){
        return res.status(500).json({
            success:false,
            message: "Product Not Found"
        })
        
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators:true
        
    })
    res.status(200).json({
        success: true,
        product
    })
})

// Delete Product
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if(!product){
        return res.status(500).json({
            success: false,
            message: "Product not found"
        })
    }
    await Product.findByIdAndDelete(req.params.id)
    res.status(200).json({
        success:true,
        message: "Product deleted Successfully"
    })
})
