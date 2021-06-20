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
router.route('/details')
 .get(async (req, res) => {
   try{
     const {userId}=req;
     const userdata=await usermodel.findOne({_id:userId}).select("followrequestsent followrequestgot followers following");
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
     
     const userdata=await usermodel.findOne({_id:userId});

     const followerdata=await usermodel.findOne({_id:followerId});
     const isrequested=followerdata.followrequestgot.find(item=>item._id===userId);
     if(isrequested)
     {
       
       followerdata.followrequestgot=followerdata.followrequestgot.filter(item=>item._id!==userId)
       await followerdata.save();
       userdata.followrequestsent=userdata.followrequestsent.filter(item=>item._id!==followerId);
       await userdata.save();
       return res.status(200).json({message:"follow request removed",followrequestsent:userdata.followrequestsent})
     }
     followerdata.followrequestgot.push({_id:userId,userName:userdata.userName});
     await followerdata.save();
     userdata.followrequestsent.push({_id:followerId,userName:followerdata.userName});
     await userdata.save();
     res.status(200).json({message:"follow request send",followrequestsent:userdata.followrequestsent})
   }
   catch (error){
     console.log(error)
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
     userdata.followers.push({_id:requesterId,userName:requesterdata.userName});
     userdata.followrequestgot=userdata.followrequestgot.filter(item=>item._id!==requesterId);
     await userdata.save();
     requesterdata.following.push({_id:userId,userName:userdata.userName});
     await requesterdata.save();
     res.status(200).json({message:"request accepted"})
   }
   catch (error){
     res.status(500).json({success:500,message:"unable to accept",errormessage:error.message})
   }
  
})
router.route('/notification')
 .get(async (req, res) => {
   try{
     const {userId}=req;
     
     const userdata=await usermodel.findOne({_id:userId});

     res.status(200).json(userdata.notification)
   }
   catch (error){
     res.status(500).json({success:500,message:"unable to fetch notification",errormessage:error.message})
   }
  
})
module.exports=router;