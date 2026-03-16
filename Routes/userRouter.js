const express = require('express');
const userRouter = express.Router();
const userAuth = require('../Middleware/userAuth')
const User = require('../Models/User')


userRouter.get("/",userAuth,async(req,res)=>{

     try {

      
    res.send(req.user);
    
  } catch (error) {
    res.send({
      success: false,
      Error: error.message,
    });
    console.log(error.message);
  } 
})

userRouter.delete("/:id",userAuth,async(req,res)=>{

     try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.send("user deleted successfully");
    
  } catch (error) {
    res.send({
      success: false,
      Error: error.message,
    });
    console.log(error.message);
  } 
})

userRouter.patch("/",userAuth,async(req,res)=>{

     try {
        const {_id, ...updated} = req.body;
        const user = await User.findByIdAndUpdate(_id,updated,{
            runValidators:true
        });
        res.send("user updated successfully");
    
  } catch (error) {
    res.send({
      success: false,
      Error: error.message,
    });
    console.log(error.message);
  } 
})




module.exports = userRouter;