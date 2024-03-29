const router = require("express").Router();
const postsController = require("../controllers/postsController.js");
const requireUser = require("../middlewares/requireUser.js");

router.post("/", requireUser, postsController.createPostController);
router.post("/like", requireUser, postsController.likeAndunlikePost);
router.put("/", requireUser, postsController.updatePostController);
router.delete("/ ", requireUser, postsController.deletePost);

module.exports = router;
