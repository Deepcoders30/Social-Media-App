const router = require("express").Router();
const requireUser = require("../middlewares/requireUser.js");
const UserController = require("../controllers/userController.js");

router.post("/follow", requireUser, UserController.followOrUnfollowUser);
router.get("/getFeedData", requireUser, UserController.getPostsOfFollowing);
router.get("/getMyPosts", requireUser, UserController.getMyPosts);
router.get("/getUserPosts", requireUser, UserController.getUserPosts);
router.delete("/", requireUser, UserController.deleteMyProfile);
router.get("/getMyInfo", requireUser, UserController.getMyInfo);
router.put("/", requireUser, UserController.updateUserProfile);
router.post("/getUserProfile", requireUser, UserController.getUserProfile);

module.exports = router;
