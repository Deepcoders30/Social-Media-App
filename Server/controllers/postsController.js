const { error, success } = require("../utils/responseWrapper");
const Post = require("../models/Posts.js");
const User = require("../models/Users.js");
const { mapPostOutput } = require("../utils/Utils");
const cloudinary = require("cloudinary").v2;

const createPostController = async (req, res) => {
  try {
    const { caption, postImg } = req.body;

    if (!caption || !postImg) {
      return res.send(error(400, "Caption and Post Image is required"));
    }

    const cloudImg = await cloudinary.uploader.upload(postImg, {
      folder: "postImg",
    });

    const owner = req._id;

    const post = await Post.create({
      caption,
      owner,
      image: {
        publicId: cloudImg.public_id,
        url: cloudImg.url,
      },
    });

    const user = await User.findById(req._id);

    user.posts.push(post._id);
    await user.save();

    return res.send(success(201, { post }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const likeAndunlikePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const currentUserId = req._id;

    const post = await Post.findById(postId).populate("owner");

    if (!post) {
      return res.send(error(404, "Post not found"));
    }

    if (post.Likes.includes(currentUserId)) {
      const index = post.Likes.indexOf(currentUserId);
      post.Likes.splice(index, 1);
    } else {
      post.Likes.push(currentUserId);
    }
    await post.save();

    return res.send(success(200, { post: mapPostOutput(post, req._id) }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const updatePostController = async (req, res) => {
  try {
    const { postId, caption } = req.body;
    const curUserId = req._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.send(error(404, "Post not found"));
    }

    if (post.owner.toString() !== curUserId) {
      return res.send(error(403, "Only owners can update their posts"));
    }

    if (caption) {
      post.caption = caption;
    }

    await post.save();

    return res.semd(success(200, post));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const deletePost = async (req, res) => {
  try {
    const { postId } = request.body;
    const currentUserId = req._id;

    const post = await Post.findById(postId);
    const curUser = await User.findById(currentUserId);

    if (!post) {
      return res.send(error(404, "Post not found"));
    }

    if (post.owner.toString() !== curUserId) {
      return res.send(error(403, "Only owners can delete their posts"));
    }

    const index = curUser.posts.indexOf(postId);
    curUser.posts.splice(index, 1);

    await curUser.save();
    await post.remove();

    return res.send(success(200, "post Deleted Successfully"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

module.exports = {
  createPostController,
  likeAndunlikePost,
  updatePostController,
  deletePost,
};
