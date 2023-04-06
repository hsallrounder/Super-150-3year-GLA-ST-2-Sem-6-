const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Review = require("../models/Review");
const {isLoggedIn} = require("../middleware")


// get all products
router.get("/products", async(req,res)=>{

   const products =  await Product.find({});

    res.render("./products/product" , {products})

})


// get forms to create a new product
router.get("/products/new", async(req,res)=>{

     res.render("./products/new")
 
 })


 //create a new product
 router.post("/products", async(req,res)=>{

    const {name , img , desc , price} = req.body;

    await Product.create({name , img , desc , price});

    req.flash("success" , "your product has been created sucessfully")

     res.redirect("/products")

 })

 router.post("/products/user/cart",(req, res) => {
   const productId = req.body.productId;
   let cart = req.session.cart || {};
   cart[productId] = (cart[productId] || 0) + 1;
   req.session.cart = cart;
   res.redirect('/products/user/cart');
 })

router.get("/products/user/cart",async (req, res) => {
   const cart = req.session.cart || {};
  const productIds = Object.keys(cart);
  const products = await Product.find({ _id: { $in: productIds } });
  const cartItems = products.map(product => {
    const quantity = cart[product._id];
    const name = product.name;
    const price = product.price * quantity;
    const img = product.img;
    const desc = product.desc;
    const id = product._id;
    return { product, quantity, price, img, desc, name, id};
  });
  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

  // Render the cart page with the list of items in the cart and the total price
  res.render('products/cart', { cartItems, totalPrice });
})

 //buynow a single product
 router.get("/products/:productid", isLoggedIn ,  async(req,res)=>{

    const {productid} = req.params;

        const product = await Product.findById(productid).populate("review");


        res.render("./products/buynow", {product})
  
 })


 // get the edit form
 router.get("/products/:productid/edit" ,isLoggedIn, async(req, res)=>{

        const {productid} = req.params;

        const product = await Product.findById(productid);

   res.render("./products/edit" , {product})

 })


 //update a product
 router.patch("/products/:productid" , async(req,res)=>{

    const {name , img , price, desc } = req.body;

    const {productid} = req.params;

    await Product.findByIdAndUpdate(productid , { img , price , desc, name });

    req.flash("update", "your product has been updated");

   res.redirect("/products");


 })

 


 // delete a product
 router.delete("/products/:productid", async(req,res)=>{


    const {productid} = req.params;

    await  Product.findByIdAndDelete(productid);

    res.redirect("/products")

 })


module.exports = router;



// get forms to create a new product
router.get("/products/new", async(req,res)=>{

     res.render("./products/new")
 
 })


 //create a new product
 router.post("/products", async(req,res)=>{

    const {name , img , desc , price} = req.body;

    await Product.create({name , img , desc , price});

    req.flash("success" , "your product has been created sucessfully")

     res.redirect("/products")

 })


 //buynow a single product
 router.get("/products/:productid", isLoggedIn, async(req,res)=>{

    const {productid} = req.params;

        const product = await Product.findById(productid).populate("review");

        console.log(product)


        res.render("./products/buynow", {product})
  
 })


 // get the edit form
 router.get("/products/:productid/edit" , async(req, res)=>{

        const {productid} = req.params;

        const product = await Product.findById(productid);

   res.render("./products/edit" , {product})

 })


 //update a product
 router.patch("/products/:productid" , isLoggedIn, async(req,res)=>{

    const {name , img , price, desc } = req.body;

    const {productid} = req.params;

    await Product.findByIdAndUpdate(productid , { img , price , desc, name });

    req.flash("update", "your product has been updated");

   

    res.redirect("/products");


 })


 // delete a product
 router.delete("/products/:productid", async(req,res)=>{


    const {productid} = req.params;

    await  Product.findByIdAndDelete(productid);

    res.redirect("/products")

 })


module.exports = router;

