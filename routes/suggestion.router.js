const express=require("express");
const mongoose=require('mongoose');
const router=express.Router();
const {usermodel}=require("../models/user.model.js")

router.route('/follow')
 .get(async (req, res) => {
   try{
     const {userId}=req;
     let followSuggestion=await usermodel.find({_id:{$ne:userId}}).select("_id userName");
     res.status(200).json(followSuggestion);
   }
   catch (error){
     res.status(500).json({success:500,message:"unable to get userdata",errormessage:error.message})
   }
  
})

module.exports=router;