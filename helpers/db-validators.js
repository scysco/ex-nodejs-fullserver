
const { Category, Product, Role} = require('../models');

const isValidRole = async(role='') =>{
    const roleExists = await Role.findOne({role});
    if(!roleExists){
            throw new Error(`role type ${role} does not exist`);
    }
}

const existsEmail = async(mail='') => {
    const existEmail = await User.findOne({mail});
    if(existEmail){
        throw new Error(`the email: ${mail} currently exists`);
    }
}
const existsUserById = async(id='') => {
    const existsUserById = await User.findById(id);
    if(!existsUserById){
        throw new Error(`the user: ${id} does not exist`);
    }
}

const existsCategoryById = async(id='') => {
    const existsCategoryById = await Category.findById(id);
    if(!existsCategoryById){
        throw new Error(`the category: ${id} does not exist`);
    }
}

const existsProductById = async(id='') => {
    const existsProductById = await Product.findById(id);
    if(!existsProductById){
        throw new Error(`the product: ${id} does not exist`);
    }
}

module.exports = {
    isValidRole,
    existsEmail,
    existsUserById,
    existsCategoryById,
    existsProductById,
}