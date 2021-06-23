const mongoose=require('mongoose');
const userefSchema=new mongoose.Schema({
					userID: {type:String,required:true},
					userName: {type:String,required:true}
})
const postSchema=new mongoose.Schema({

				_id:mongoose.Schema.Types.ObjectId,
				caption: {type:String},
				likes: [{type:String,required:true}],
				user: userefSchema,
        date:{type:Date,required:true}
			
})

//model creation
const postmodel=mongoose.model('post',postSchema);

module.exports={postmodel}