const express=require("express");
const mongoose=require('mongoose');
const router=express.Router();
const { extend } = require("lodash");
const {postmodel}=require("../models/post.model.js")
const {commentmodel}=require("../models/comment.model.js")


router.route('/')
 .get(async (req, res) => {
   try{
     const {userId}=req;
     console.log(userId)
     const posts=await postmodel.find({});
     res.status(200).json(posts)
   }
   catch (error){
     res.status(500).json({success:500,message:"unable to get posts",errormessage:error.message})
   }
  
})
.post(async(req, res) => {
  try{
     const {userId}=req;
     let {postobj}=req.body;
     let post=await postmodel.create({_id:new mongoose.Types.ObjectId(),...postobj})
  res.json({success:true,post})
  }
  
  catch (error){
    
    res.status(500).json({success:false,message:"unable to add posts",errormessage:error.message})
  }
})

router.route("/likes")
.post(async(req, res) => {
  try{
    //  const {userId}=req;
     let {postID,userID}=req.body;
     
     let post=await postmodel.findOne({_id:postID});
    //  console.log(post)
     if(!post.likes.find(item=>item===userID))
     {
       console.log("enter")
       post.likes.push(userID);
       post=await post.save();
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
     console.log(commentobj)
     let comment=await commentmodel.create({_id:new mongoose.Types.ObjectId(),...commentobj})
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