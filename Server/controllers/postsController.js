const {error, success}=require("../utils/responseWrapper");
const Post=require("../models/Posts.js");
const User=require("../models/Users.js")



const getAllPostsController=async (req, res)=>{
    console.log(req._id)
    res.send(success(200, "These are all the posts"));
}

const createPostController= async (req, res)=>{

    try{
        const {caption}=req.body;
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





module.exports={getAllPostsController, createPostController, likeAndunlikePost};

