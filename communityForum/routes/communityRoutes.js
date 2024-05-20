const express = require("express");
const router = express.Router();
const {
  createPost,
  fetchPosts,
  fetchPostById,
  addCommentToPost,
  deletePost
} = require("../controllers/postController");

const {
  createGroup,
  fetchGroupPosts,
  addMemberToGroup,
  removeUserFromGroup,
  deleteGroup,
  fetchGroups,
} = require("../controllers/groupController");

const {
  addReport,
  fetchReports,
  fetchReportById
} = require("../controllers/reportController");

router.post("/createPost", createPost);
router.get("/fetchPosts", fetchPosts);
router.get("/fetchPost/:id", fetchPostById);
router.post("/addCommentToPost/:postId", addCommentToPost);
router.delete("/deletePost/:postId", deletePost);

router.post("/addGroup", createGroup);
router.get("/fetchGroups", fetchGroups);
router.get("/fetchGroupPosts/:id", fetchGroupPosts);
router.post("/addGroupMember", addMemberToGroup);
router.post("/removeUser", removeUserFromGroup);
router.delete("/deleteGroup/:id", deleteGroup);


router.post("/addReport", addReport);
router.get("/fetchReports", fetchReports);
router.get("/fetchReport/:reportId", fetchReportById);

module.exports = router;
