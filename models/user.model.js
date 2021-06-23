const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
_id:{type:mongoose.Schema.Types.ObjectId,required:true},
name:{type:String}, 
userName:{type:String,required:true},
email:{type:String,required:true},
password:{type:String,required:true},
followrequestgot:[],
followrequestsent:[],
followers:[],
following:[],
notification:[{type:String}]
})

//model creation
const usermodel=mongoose.model('user',userSchema);

module.exports={usermodel}