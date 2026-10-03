const { JsonWebTokenError } = require("jsonwebtoken");

const ErrorHandling=async (err,req,res,next)=>{
  if(err.code===11000){
    return res.status(409).json({
      success:false,
      message:'Data You  Are Entered Is Already Exists'
    })
  }
  if(err.name==='ValidationError'){
    const errors={};
    Object.keys(err.errors).forEach((key)=>{
      errors[key]=err.errors[key].message;
    })
    return res.status(400).json({
      success:false,
      message:errors
    })
  }
  if(err.name==='CastError'){
    return res.status(400).json({
      success:false,
      message:'Invalid ID or DataType'
    })
  }
  if(err.name==='JsonWebTokenError'){
    return res.status(401).json({
      success:false,
      message:'Invalid token'
    })

  }
  if(err.name==='TokenExpiredError'){
    return res.status(401).json({
      success:false,
      message:'Token Expired'
    })
  }
  if (err.code === "LIMIT_FILE_SIZE") {
  return res.status(400).json({
    success: false,
    message: "File size must be less than 5 MB"
  });
}
return res.status(err.status || 500).json({
  success: false,
  message: err.message || "Internal Server Error"
});
}
module.exports=ErrorHandling;