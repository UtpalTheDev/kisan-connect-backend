const express=require("express");
const bcrypt=require("bcrypt");
const mongoose=require("mongoose");
const router=express.Router();
const bodyParser=require("body-parser");
const {usermodel}=require("../models/user.model.js")
const {signupValidation} = require("../utils/validation")
let jwt=require('jsonwebtoken');

router.route("/")
.post(async(req,res)=>{
  try{
      const {error} = signupValidation(req.body.user);
      if (error){
        return res.status(400).json({message:error.details[0].message})
      }    
      const {name,userName,password,email}=req.body.user;
      let userWithSameEmail=await usermodel.findOne({email});
      let userWithSameUserName=await usermodel.findOne({userName});

      if(!userWithSameEmail){
        if(!userWithSameUserName){
          user=await usermodel.create({_id:new mongoose.Types.ObjectId(), name,userName,password,email,bio:"i am using kisanconnect"});
          const salt=await bcrypt.genSalt(10);
          user.password=await bcrypt.hash(user.password,salt);
          await user.save();
          
          res.status(200).json({message:"success"});
        }
        res.status(400).json({message:"userName already exists"});
      }
      else{
        res.status(400).json({message:"email already exists"});
      }
      
  }
  catch(error){
    console.log(error)
    res.status(500).json({message:error});
  }
})
module.exports=router