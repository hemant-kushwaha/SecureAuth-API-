const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema ({
    aadhaar_No: {
    type: String,
    // required: true,
    unique: true,
    minlength: 12
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  date_of_birth: {
    type: Date,
    // required: true,
    default: Date.now()
  },
  gender: {
    type: String,
    // enum: ["Male", "Female", "Other"]
    validate(v){
        if(! ["Male", "Female", "Other"].includes(v))
        throw new Error ("Invlaid genetr")
    }
     
    
  },
  email: {
    type: String,
    lowercase: true,
    immutable:true
  },
  password:{
    type:String,
    required: true
  }
},{
    strict:"throw",
    timestamps: true
})

userSchema.methods.getAccessToken = function (){
   return jwt.sign({_id:this._id,emailID:this.email},process.env.SECRET_KEY,{expiresIn:"2m"})
   //this points to the created object -> the one who called it
}

userSchema.methods.getRefreshToken = function () {
  return jwt.sign({ _id: this._id },process.env.REFRESH_SECRET,{ expiresIn: "10m" });
};

userSchema.methods.verifyPassword = async function (userPassword){
  const ans = await bcrypt.compare(userPassword,this.password)
  return ans
}
const User = mongoose.model("user",userSchema,"User");

module.exports = User;