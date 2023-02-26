const router=require('express').Router();
const requireUser = require('../middlewares/requireUser.js');
const UserController=require("../controllers/userController.js")


router.post("/follow", requireUser, UserController.followOrUnfollowUser);
router.get("/getPostsOfFollowing", requireUser, UserController.getPostsOfFollowing);
router.get("/getMyPosts", requireUser, UserController.getMyPosts);
router.get("/getUserPosts", requireUser, UserController.getUserPosts);
router.delete("/", requireUser, UserController.deleteMyProfile);

module.exports=router;