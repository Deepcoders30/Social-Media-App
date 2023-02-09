const User=require("../models/Users.js");
const Post=require("../models/Posts.js");
const {success, error}=require("../utils/responseWrapper.js");



const followOrUnfollowUser = async (req, res)=>{
try{
  const userIdToFollow = req.body;
  const currentUserId=req._id;

  const userToFollow=await User.findById(userIdToFollow);
  const curUser=await User.findById(currentUserId);
  if(!userToFollow){
        return res.send(error(484, "User to Follow not found"));
  }

  if(currentUserId===userIdToFollow){
    return res.send(error(409, "User cannot follow themselves"));
  }

  if(curUser.followings.includes(userIdToFollow)){//Already Followed
       const followingIndex=curUser.followings.indexOf(userIdToFollow);
       curUser.followings.splice(followingIndex, 1);    

       const followerIndex = userToFollow.followers.indexOf(curUser);
       userToFollow.followers.splice(followerIndex, 1);

       await userToFollow.save();
       await curUser.save();

       return res.send(success(200, "User Unfollowed"));
  }
  else{
    userToFollow.followers.push(currentUserId);
    curUser.followings.push(userIdToFollow);

    await userToFollow.save();
    await curUser.save();

       return res.send(success(200, "User Followed"));
  }
}catch(e){
  res.send(error(500, e.message));
}
   
}


const getPostsOfFollowing = async (req, res)=>{
    const currentUserId=req._id;

    const curUser=await User.findById(currentUserId);
    const posts=await Post.find({
        'owner':{
           '$in':curUser.followings
        }
    })

    return res.send(success(200, posts))
}

module.exports={followOrUnfollowUser, getPostsOfFollowing};