const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
_id:{type:mongoose.Schema.Types.ObjectId,required:true}, 
userName:{type:String,required:true},
email:{type:String,required:true},
password:{type:String,required:true},
followrequest:[{type:String}],
followers:[{type:String}],
following:[{type:String}]
})

//model creation
const usermodel=mongoose.model('user',userSchema);

module.exports={usermodel}