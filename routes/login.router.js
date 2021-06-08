const express=require("express");
const router=express.Router();
const bcrypt=require("bcrypt");
const bodyParser=require("body-parser");
const {usermodel}=require("../models/user.model.js")
const {loginValidation}=require("../utils/validation")
let jwt=require('jsonwebtoken');
router.route("/")
.post(async(req,res)=>{
  try{
      const {error} = loginValidation(req.body.user);
      if (error){
        return res.status(400).json({message:error.details[0].message})
      }    
      const {email,password}=req.body.user;
      let user=await usermodel.findOne({email});
      if(user){
        const validpassword=await bcrypt.compare(password,user.password);
        if(validpassword){
          let token=jwt.sign({userId:user._id},process.env.Secret);
          token=`Bearer ${token}`;          
          res.status(200).json({message:"success",token});
        }
        else{
          res.status(400).json({ error: "Email or password is wrong" });
        }
      }
      else {
      res.status(401).json({ error: "User does not exist" });
    }

      
  }
  catch(error){
    res.status(500).json({message:error});
    console.log(error);
  }
})

module.exports=router