const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
userName:{type:String,required:true},
email:{type:String,required:true},
password:{type:String,required:true}
})

//model creation
const usermodel=mongoose.model('user',userSchema);

module.exports={usermodel}