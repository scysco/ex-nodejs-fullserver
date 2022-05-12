const bcryptjs = require("bcryptjs");
const { response } = require("express");
const { json } = require("express/lib/response");
const { generateJWT } = require("../helpers/generate-jwt");
const { googleVerify } = require("../helpers/google-verify");
const User = require("../models/user");

const login = async(req,res = response) =>{
    const{mail,password} = req.body;
    
    try {
        //verify email
        const user = await User.findOne({mail});
        if(!user){
            return res.status(400).json({
                msg:'username or password are incorrect - mail' 
            });
        }
        //verify user status
        if(!user.status){
            return res.status(400).json({
                msg:'username or password are incorrect - status' 
            });
        }
        //verify password
        const isValidPassword = bcryptjs.compareSync(password, user.password);
        if(!isValidPassword){
            return res.status(400).json({
                msg:'username or password are incorrect - password' 
            });
        }
        //generate JWT
        const token = await generateJWT(user.id);


        res.json({
            user,
            token
        });    
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'something went wrong'}); //return
    }
}

const googleSignIn = async(req,res = response) =>{
    const {id_token} = req.body;

    try {
        const {name,img,mail} = await googleVerify(id_token);

        let user = await User.findOne({mail});
        if(!user){
            const data = {
                name,
                mail,
                password: ':P',
                img,
                google: true
            };
            user = new User(data);
            await user.save();
        }

        if(!user.status){
            return res.status(401).json({
                msg: 'Unauthorized'
            })
        }
        
        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        });
    } catch (error) {
        res.status(400).json({
            ok:false,
            msg: 'invalid token'
        })
    }
}


module.exports = {
    login,
    googleSignIn
}