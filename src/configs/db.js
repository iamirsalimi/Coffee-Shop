const mongoose = require("mongoose")

const connectToDB = async () => {
    try{
        if(mongoose.connections[0].readyState){
            return false;
        }

        await mongoose.connect('mongodb://localhost:27017/Coffee-Shop')
        
        console.log('connected to DB successfully :)')
    } catch(err) {
        console.log('err on DB connection' , err)
    }
}

export default connectToDB