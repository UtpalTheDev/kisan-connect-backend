const express=require("express");
const mongoose=require('mongoose');
const router=express.Router();
const { extend } = require("lodash");
const {postmodel}=require("../models/post.model.js")
const {commentmodel}=require("../models/comment.model.js")
const {usermodel}=require("../models/user.model.js")

router.route('/')
 .get(async (req, res) => {
   try{
     const {userId}=req;
     console.log(userId)
     const userdata= await usermodel.findOne({_id:userId});
     console.log(userdata.following)
     const query=postmodel.find({"user.userID":{$in:userdata.following}})
     const posts=await query.exec();
     res.status(200).json(posts)
   }
   catch (error){
     console.log(error)
     res.status(500).json({success:500,message:"unable to get posts",errormessage:error.message})
   }
  
})
.post(async(req, res) => {
  try{
     const {userId}=req;
     let {postobj}=req.body;
     let post=await postmodel.create({_id:new mongoose.Types.ObjectId(),...postobj});
     let userdata=await usermodel.findOne({_id:userId})
     
     let query=await usermodel.updateMany({_id:{$in:userdata.followers}},{$push:{"notification":`${userdata.userName} added a new post`}});
     
  res.json({success:true,post})
  }
  
  catch (error){
    console.log("error",error)
    res.status(500).json({success:false,message:"unable to add posts",errormessage:error.message})
  }
})

router.route("/likes")
.post(async(req, res) => {
  try{
      const {userId}=req;
     let {postID,name}=req.body;
     
     let post=await postmodel.findOne({_id:postID});
    //  console.log(post)
     if(!post.likes.find(item=>item===userId))
     {
       console.log("enter")
       post.likes.push(userId);
       post=await post.save();
       let postOwnerData=await usermodel.findOne({_id:post.user.userID});
       postOwnerData.notification.push(`${name} liked your post`)
       await postOwnerData.save();
       return res.json({success:true,post})
     }
     
    else{
      post.likes=post.likes.filter(item=>item!==userID);
      post= await post.save();
      console.log(post)
      return res.json({success:true,post})

    }
  }
  
  catch (error){
    console.log(error)
    res.status(500).json({success:false,message:"unable to add posts",errormessage:error.message})
  }
})

router.route("/comment/:id")
.get(async(req,res)=>{
  try{
     let {id}=req.params;
     console.log(id);
     let comment= await commentmodel.find({postID:id});
     console.log(comment);
     res.status(200).json({success:true,comment});
  }
  catch(error){
    console.log(error);
    res.status(500).json({success:false,message:"unable to get comment",errormessage:error.message})
  }
})

router.route("/comment")
.post(async(req, res) => {
    try{
     const {userId}=req;
     let {commentobj}=req.body;
     let comment=await commentmodel.create({_id:new mongoose.Types.ObjectId(),...commentobj});
     let postData=await postmodel.findOne({_id:comment.postID});
     let postOwnerData=await usermodel.findOne({_id:postData.user.userID});
     postOwnerData.notification.push(`${comment.user.name} commented on your post`)
    await postOwnerData.save();
     res.json({success:true,comment})
  }
  
  catch (error){
    
    res.status(500).json({success:false,message:"unable to add comment",errormessage:error.message})
  }
})

router.route("/comment/reply")
.post(async(req, res) => {
    try{
     const {userId}=req;
     let {commentreplyobj}=req.body;
     let {commentID}=commentreplyobj;
     let comment= await commentmodel.findOne({_id:commentID})
     let commentreply=comment.reply.push({_id:new mongoose.Types.ObjectId(),...commentreplyobj})
     await  comment.save();
     res.json({success:true,commentreply})
  }
  
  catch (error){
    
    res.status(500).json({success:false,message:"unable to add posts",errormessage:error.message})
  }
})
module.exports=router