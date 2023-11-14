const User = require("../models/userModel");

const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const verifyToken = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req?.headers?.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);

        const user = await User.findById(decoded?.id);
        req.user = user;
        req.id = decoded.id;
        next();
      }
    } catch (error) {
      throw new Error("Not authorized token expired,Please Login");
    }
  } else {
    throw new Error("There is no token present");
  }
});
// const refreshToken=asyncHandler(async(req,res,next)=>{
//     const cookies=req.headers.cookie;
//     const previousToken=cookies.split("=")[1]
//     if(!previousToken){
//         return res.status(400).json({message:"Couldn't find token"})
//     }
//     jwt.verify(previousToken,process.env.JWT_SECRET_TOKEN,(err,data)=>{
// if(err) return  res.status(403).json({message:"AUthentication failed"})
// res.clearCookie(`${data.id}`)
// req.cookies[`${data.id}`]=""
//     })
//   })

module.exports = { verifyToken };
