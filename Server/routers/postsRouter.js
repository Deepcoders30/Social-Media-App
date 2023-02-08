const router=require('express').Router();
const postsController=require("../controllers/postsController.js");
const requireUser=require("../middlewares/requireuser.js")


router.get("/all", requireUser, postsController.getAllPostsController);
router.post("/", requireUser, postsController.createPostController);
router.post("/like", requireUser, postsController.likeAndunlikePost);



module.exports=router;