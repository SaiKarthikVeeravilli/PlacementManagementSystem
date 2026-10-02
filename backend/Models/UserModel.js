const mongoose=require('mongoose');
const {isEmail}=require('validator');
const bcrypt=require('bcrypt');
const userSchema=new mongoose.Schema({
  name:{
    type:String,
    required:true,
    minlength:[6,'name should contain minimum 6 characters']
  },
  email:{
    type:String,
    required:true,
    unique:true,
    validate:[isEmail,'Enter valid Email']
  },
  password: {
    type: String,
    required: true,
    minlength: [7, 'password must be atleast 7 characters']
},
  role:{
    type:String,
    enum:["student","admin"],
    default:"student"

  },
  resetPasswordToken: {
  type: String,
  default: null
},

resetPasswordExpires: {
  type: Date,
  default: null
},
notificationsEnabled: {
  type: Boolean,
  default: true
}

})
userSchema.pre("save", async function () {

  console.log("PRE SAVE START");

  if (!this.isModified("password")) {

    console.log("PASSWORD NOT MODIFIED");

    return;
  }

  console.log("PASSWORD MODIFIED");

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(
    this.password,
    salt
  );

  console.log("PASSWORD HASHED");

});
const userModel=mongoose.model('user',userSchema);
module.exports=userModel;