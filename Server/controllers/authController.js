const User=require("../models/Users.js");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const {error, success}=require("../utils/responseWrapper")



const signupController = async (req, res)=>{
      try {
       
        const {name, email, password}=req.body;   

        if(!email || !password || !name){
            // return res.status(400).send("All fields are required");
            return res.send(error(400, "All fields are required"));
        }

        const oldUser=await User.findOne({email}); 
        if(oldUser){
            return res.send(error(409, "User already exists"));
        }

        const hashedPassword=await bcrypt.hash(password, 10); 

        const user=await User.create({
            name,
            email,
            password:hashedPassword
        })
    
     
        
        // return res.status(201).json({user});

        return res.send(success(201, "User Created"));
      
      } catch (e) {
         res.send(error(500, e.message));
      }
}


const loginController = async (req, res)=>{
    try {
        const {email, password}=req.body;   

        if(!email || !password){
            return res.send(error(400, "All fields are required"));
        }

        const user=await User.findOne({email}).select("+password"); 
        if(!user){
            return res.send(error(404, "User not registered"));
        }
     
        const matched=await bcrypt.compare(password, user.password);
        if(!matched){
            return res.send(error(403, "Incorrrect Password"));
        }

        const accessToken=generateAccessToken({_id:user._id});

        const refreshToken=generateRefreshToken({_id:user._id});

        res.cookie('jwt', refreshToken, {
            httpOnly:true,
            secure:true 
        });

        // return res.status(201).json({accessToken}); 
        return res.send(success(201, {accessToken}));
    } catch (error) {
    console.log(error);
    }
};



//Internal functions
const generateAccessToken=(data)=>{
    return jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {expiresIn: "15m"});
   
}

const generateRefreshToken=(data)=>{
    return jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {expiresIn: "1y"});
   
}

//This API will check refresh token validity and generate a new Access Token.

const refreshAccessTokenController=async (req, res)=>{
    const cookies=req.cookies;
   
    if(!cookies.jwt){   
        return res.send(error(401, "Refresh Token in cookie is Required"));
    }

    const refreshToken=cookies.jwt;
    try {
        const decoded=jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY);
       
       
        const _id=decoded._id;
        const accessToken=generateAccessToken({_id});


        return res.send(success(201, {accessToken}));
    }
    catch (error) {
        return res.send(error(401, "Invalid refresh token"));
    }
}

const logoutController = async (req, res)=>{
    try {
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true,
        })
        return res.send(success(200, 'user logged out'))
    } catch (e) {
        return res.send(error(500, e.message));
    }
}


module.exports={signupController, loginController, refreshAccessTokenController, logoutController};

