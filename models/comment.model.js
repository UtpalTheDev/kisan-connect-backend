const mongoose=require('mongoose');
const userefSchema=new mongoose.Schema({
					userID: {type:String,required:true},
					userName: {type:String,required:true}
})
const commentSchema=new mongoose.Schema({
  		  _id:mongoose.Schema.Types.ObjectId,
        postID:{type:mongoose.Schema.Types.ObjectId, ref:'post'},
        reply:[],
				caption: {type:String},
				likes: [{type:String,required:true}],
				user: userefSchema,
        date:{type:Date,required:true}
			
})

//model creation
const commentmodel=mongoose.model('comment',commentSchema);

module.exports={commentmodel}