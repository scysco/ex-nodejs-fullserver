const mongoose = require('mongoose');

const dbConnection = async() =>{
    try {
        // mongoose.set('returnOriginal', false);
        await mongoose.connect(process.env.MONGODB_CNN,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Database Connected!!');
        
    } catch (error) {
        console.log(error);
        throw new Error('Connection Database Error!!!');
    }

}

module.exports ={
    dbConnection,
}