const {error, success}=require("../utils/responseWrapper");
const Post=require("../models/Posts.js");
const User=require("../models/Users.js")


const createPostController= async (req, res)=>{

    try{
        const {caption}=req.body;
        
        if(!caption){
            return res.send(error(400, "Caption is required"))
        }

        const owner=req._id;
    
        const post=await Post.create({
            caption,
            owner
        });

        const user=await User.findById(req._id);

        user.posts.push(post._id);
        await user.save();

        return res.send(success(201, post));
        
    }catch(e){
       console.log(e)
    }
}


const likeAndunlikePost = async (req, res)=>{
    console.log(req._id)
    try{
    const {postId}=req.body;
    const currentUserId=req._id;

    const post=await Post.findById(postId); 

    if(!post){
        return res.send(error(404, "Post not found"));
    }

    if(post.Likes.includes(currentUserId)){
        const index=post.Likes.indexOf(currentUserId);
        post.Likes.splice(index, 1);

        await post.save();
        return res.send(success(200, "Post unliked"));
    }
    else{
        post.Likes.push(currentUserId);
        await post.save();
        return res.send(success(200, "Post liked"));
    }

}catch(e){
    res.send(error(500, e.message));
}

}

const updatePostController = async (req, res)=>{

try{
    const {postId, caption}=req.body;
    const curUserId=req._id;

    const post=await Post.findById(postId);

    if(!post){
        return res.send(error(404, "Post not found"));  
    }

    if(post.owner.toString() !== curUserId){
        return res.send(error(403, "Only owners can update their posts"));
    }

    if(caption){
        post.caption=caption;
    }

    await post.asve();

    return res.semd(success(200, post));
}catch(e){
    return res.send(error(500, e.message));
}


}

const deletePost = async (req, res)=>{
  try{
    const {postId}=request.body;
    const currentUserId=req._id;

    const post=await Post.findById(postId);
    const curUser=await User.findById(currentUserId);

    if(!post){
        return res.send(error(404, "Post not found"));  
    }

    if(post.owner.toString() !== curUserId){
        return res.send(error(403, "Only owners can delete their posts"));
    }

    const index=curUser.posts.indexOf(postId);
    curUser.posts.splice(index, 1);

    await curUser.save();
    await post.remove();

    return res.send(success(200, "post Deleted Successfully"));
  }catch(e){
    res.send(error(500, e.message));
  }

    
}



module.exports={createPostController, likeAndunlikePost, updatePostController, deletePost};

