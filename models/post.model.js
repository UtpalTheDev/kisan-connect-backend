const mongoose=require('mongoose');
const userefSchema=new mongoose.Schema({
					userID: {type:String,required:true},
					name: {type:String,required:true}
})
const postSchema=new mongoose.Schema({

				_id:mongoose.Schema.Types.ObjectId,
				caption: {type:String},
				likes: [{type:String,required:true}],
				user: userefSchema,

			
})

//model creation
const postmodel=mongoose.model('post',postSchema);

module.exports={postmodel}