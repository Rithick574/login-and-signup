const mongoose=require('mongoose');
require('dotenv').config();


mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

.then(()=>{
    console.log('DB connected......!!!');
})
.catch((err)=>{
    console.log('Not connected to the DB......');
})

const schema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
})

const login=new mongoose.model('login',schema);


module.exports=login;


