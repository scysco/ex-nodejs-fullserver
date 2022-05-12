const { response } = require("express");
const { User, Category, Product } = require("../models");
const {ObjectId} = require('mongoose').Types

const allowedCollections = [
    'users',
    'categories',
    'products',
    'roles',
];


const searchUsers = async (term = '', res = response) =>{
    const isMongoId = ObjectId.isValid(term);
    if(isMongoId){
        const user = await User.findById(term);
        return res.json({
            results:(user)?[user]:[]
        });
    }
    const regexp = new RegExp(term,'i');
    const users = await User.find({ //count
        // $or : [{name:regexp, status:true},{mail:regexp, status:true}]
        $or : [{name:regexp},{mail:regexp}],
        $and: [{status:true}]
    });
    res.json({
        results: users
    });
}

const searchCategories = async (term = '', res = response) =>{
    const isMongoId = ObjectId.isValid(term);
    if(isMongoId){
        const category = await Category.findById(term);
        return res.json({
            results:(category)?[category]:[]
        });
    }
    const regexp = new RegExp(term,'i');
    const categories = await Category.find({name:regexp, status:true});
    res.json({
        results: categories
    });
}
const searchProducts = async (term = '', res = response) =>{
    const isMongoId = ObjectId.isValid(term);
    if(isMongoId){
        const product = await Product.findById(term).populate('category','name');
        return res.json({
            results:(product)?[product]:[]
        });
    }
    const regexp = new RegExp(term,'i');
    const products = await Product.find({name:regexp, status:true}).populate('category','name');
    res.json({
        results: products
    });
}

const search  = (req,res = response) => {
    const {collection, term} = req.params;

    if(!allowedCollections.includes(collection)){
        return res.status(400).json({
            msg: `Allowed collections are: ${allowedCollections}`
        });
    }


    switch (collection) {
        case 'users':
            searchUsers(term,res);
            break;
        case 'categories':
            searchCategories(term,res);
            break;
        case 'products':
            searchProducts(term,res);
            break;
    
        default:
            res.status(500).json({
                msg:'unimplemented search'
            });
    }
}

module.exports = {
    search
}