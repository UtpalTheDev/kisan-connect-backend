const express=require("express");
const router=express.Router();
const { extend } = require("lodash");
const {usermodel}=require("../models/user.model.js")

router.route('/:userName')
 .get(async (req, res) => {
   try{
     const userName=req.params.userName
     const {userId}=req;
     const regex =  new RegExp("^"+userName,'g');
     console.log("log",userName);

      const userarr=await usermodel.find({userName:regex}).select("_id userName")
     res.status(200).json(userarr)
   }
   catch (error){
     res.status(500).json({success:500,message:"unable to get userdata",errormessage:error.message})
   }
  
})
module.exports=router