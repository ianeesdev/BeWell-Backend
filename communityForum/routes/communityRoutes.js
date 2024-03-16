const express = require("express");
const router = express.Router();
const {
  createPost,
  fetchPosts,
  fetchPostById,
  addCommentToPost,
} = require("../controllers/postController");
const {
  createGroup,
  fetchGroupPosts,
  addMemberToGroup,
  removeUserFromGroup,
  deleteGroup,
} = require("../controllers/groupController");

router.post("/createPost", createPost);
router.get("/fetchPosts", fetchPosts);
router.get("/fetchPost/:id", fetchPostById);
router.post("/addCommentToPost/:postId", addCommentToPost);

router.post("/addGroup", createGroup);
router.get("/fetchGroupPosts/:id", fetchGroupPosts);
router.post("/addGroupMember", addMemberToGroup);
router.post("/removeUser", removeUserFromGroup);
router.delete("/deleteGroup/:id", deleteGroup);

module.exports = router;
