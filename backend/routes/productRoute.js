const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetatils } = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles} = require("../middleware/auth");
const router = express.Router();

router.route("/products").get(getAllProducts);

router.route("/product/new").post( isAuthenticatedUser,  authorizeRoles("admin"), createProduct);

router.route("/product/:id").put( isAuthenticatedUser,  authorizeRoles("admin"), updateProduct);

router.route("/product/:id").delete( isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

router.route("/product/:id").get(getProductDetatils);

module.exports = router;