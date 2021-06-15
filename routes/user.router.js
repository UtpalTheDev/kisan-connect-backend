const express=require("express");
const router=express.Router();
const { extend } = require("lodash");
const {usermodel}=require("../models/user.model.js")

router.route('/')
 .get(async (req, res) => {
   try{
     const {userId}=req;
     const userdata=await usermodel.findOne({_id:userId}).select('_id userName email');
     res.status(200).json(userdata)
   }
   catch (error){
     res.status(500).json({success:500,message:"unable to get userdata",errormessage:error.message})
   }
  
})
router.route('/follow')
 .post(async (req, res) => {
   try{
     const {userId}=req;
     const {followerId}=req.body;
     const followerdata=await usermodel.findOne({_id:followerId});
     isrequested=followerdata.followrequest.find(item=>item===userId);
     if(isrequested)
     {
       followerdata.followrequest=followerdata.followrequest.filter(item=>item!==userId)
       await followerdata.save();
       return res.status(200).json({message:"follow request removed"})
     }
     followerdata.followrequest.push(userId);
     await followerdata.save();
     res.status(200).json({message:"follow request send"})
   }
   catch (error){
     res.status(500).json({success:500,message:"unable to send or cancel request",errormessage:error.message})
   }
  
})
router.route('/follow_request_action')
 .post(async (req, res) => {
   try{
     const {userId}=req;
     const {requesterId}=req.body;
     const userdata=await usermodel.findOne({_id:userId});
     const requesterdata= await usermodel.findOne({_id:requesterId});
     userdata.followers.push(requesterId);
     userdata.followrequest=userdata.followrequest.filter(item=>item!==requesterId);
     await userdata.save();
     requesterdata.following.push(userId);
     await requesterdata.save()


     
     res.status(200).json({message:"request accepted"})
   }
   catch (error){
     res.status(500).json({success:500,message:"unable to accept",errormessage:error.message})
   }
  
})
module.exports=router;