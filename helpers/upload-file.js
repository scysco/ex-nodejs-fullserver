const path = require('path');
const {v4:uuidv4} = require('uuid');

const uploadFile = (files, allowedExtensions = ['png','jpg','jpeg','gif'], folder = '') =>{
    return new Promise((resolve,reject) =>{
        const {file} = files;

        const extension = file.name.split('.').pop();


        if(!allowedExtensions.includes(extension)){
            return reject('invalid extension')
        }

        const serverName = uuidv4() + '.'+extension;
        const uploadPath = path.join(__dirname,'../uploads',folder,serverName);

        file.mv(uploadPath,(err)=>{
            if (err) {
                return reject(err);
            }
            resolve(serverName);
        });
    });
    
}

module.exports = {
    uploadFile
}