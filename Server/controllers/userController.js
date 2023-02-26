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
  try{
    const currentUserId=req._id;

    const curUser=await User.findById(currentUserId);
    const posts=await Post.find({
        'owner':{
           '$in':curUser.followings
        }
    })

    return res.send(success(200, posts))
  }catch(e){
    res.send(error(500, e.message));
  }
}


const getMyPosts = async (req, res)=>{
try{
  const currentUserId = req._id;

  
  const allUserPosts = await Post.find({
    owner: currentUserId
  }).populate("L  ikes");

  res.send(success(200, {allUserPosts}))
}catch(e){
  res.send(error(500, e.message))
}
}

const getUserPosts = async (req, res)=>{
  try{
    const userId = req.body.userId;
    
    if (!userId){
      return res.send(error(400, "User Id is required"))
    }

    const allUserPosts = await Post.find({
      owner: userId
    }).populate("Likes");
  
    res.send(success(200, {allUserPosts}))
  }catch(e){
    res.send(error(500, e.message))
  }
}

const deleteMyProfile =async (req, res)=>{
try{
  const currentUserId=req._id;
  const curUser=await User.findById(currentUserId);
  
  //delete all posts
  await Post.deleteMany({
    owner: currentUserId
  })

  // removed myself from follower's followings
  curUser.followers.forEach(async followerId=>{
    const follower=await User.findById(followerId)
    const index=follower.followings.indexOf(currentUserId);
    follower.followings.splice(index, 1);
    await follower.save();
  })

  // remove myself from following's followers
  curUser.followings.forEach(async followingId=>{
    const following=await User.findById(followerId)
    const index=following.followers.indexOf(currentUserId);
    following.followers.splice(index, 1);
    await following.save(); 
  })

  //remove myself from all likes
  const allPosts=await Post.find();
  allPosts.forEach(async post=>{
    const index=post.likes.indexOf(currentUserId);
    post.like.splice(index, 1);
    await post.save();
  })

  await curUser.remove();
  
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: true
  });

  res.send(success(200, "User Deleted"));
}catch(e){
  res.send(error())
}


}


module.exports={followOrUnfollowUser, getPostsOfFollowing, getMyPosts, getUserPosts, deleteMyProfile};