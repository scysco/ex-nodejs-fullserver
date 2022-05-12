const { response,request } = require('express');
const {Product} = require('../models');


const getProducts = async(req,res = response) => {
    const{limit = 5, skip = 0} = req.query;

    const [total, products] = await Promise.all([
        Product.countDocuments({status:true}),
        Product.find({status:true})
                            .populate('user','name')
                            .populate('category','name')
                            .limit(Number(limit))
                            .skip(Number(skip))
    ]);

    res.json({total,products});
}

const getProduct = async (req = request, res = response) => {
    const {id} = req.params;
    const product = await Product.findById(id)
                                    .populate('user','name')
                                    .populate('category','name');
    res.status(201).json(product);
}

const postProduct = async(req,res = response) => {
    const name = req.body.name.toUpperCase();
    const ProductDB = await Product.findOne({name});
    if(ProductDB){
        return res.status(400).json({
            msg: `Product ${ProductDB.name} already exists`
        });
    }

    const {price,description} = req.body;

    const data = {
        name,
        price,
        description,
        user: req.user._id,
        category: req.category._id
    }
    const product = await new Product(data);

    await product.save();

    res.status(201).json(product);
}

const putProduct = async(req,res = response) => {
    
    const {id} = req.params;

    const name = req.body.name.toUpperCase();
    const ProductDB = await Product.findOne({name});
    if(ProductDB){
        return res.status(400).json({
            msg: `Product ${ProductDB.name} already exists`
        });
    }

    const {price,description} = req.body;

    const data = {
        name,
        price,
        description,
        user: req.user._id,
        category: req.category._id
    }
    const product = await Product.findByIdAndUpdate(id,data,{new:true});
    res.json(product);
}

const deleteProduct = async(req, res = response) => {
    const {id} = req.params;

    const product = await Product.findByIdAndUpdate(id,{status:false});
    const authenticatedUser = req.user;
    
    res.json({
        product,
        authenticatedUser
    });
}



module.exports = {
    postProduct,
    getProducts,
    getProduct,
    putProduct,
    deleteProduct,
}