const asyncHandler = require("express-async-handler");
const groupService = require("../services/groupService");

// @desc    Create a new group
// @route   POST /community/addGroup
// @access  Private
const createGroup = asyncHandler(async (req, res) => {
    const { name, image, bio, createdById } = req.body;
  
    try {
      const group = await groupService.createGroup( name, image, bio, createdById);
      res.status(201).json(group);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
});


// @desc    Fetch group posts
// @route   GET /community/fetchGroupPosts/:id
// @access  Private
const fetchGroupPosts = asyncHandler(async (req, res) => {
    const groupId = req.params.id;

    try {
        const groupPosts = await groupService.fetchGroupPosts(groupId);
        res.status(200).json(groupPosts);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// @desc    Add member to group
// @route   POST /community/addGroupMember
// @access  Private
const addMemberToGroup = asyncHandler(async (req, res) => {
    const { groupId, memberId } = req.body;

    try {
        const group = await groupService.addMemberToGroup(groupId, memberId);
        res.status(200).json(group);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// @desc    Remove user from group
// @route   POST /community/removeUser
// @access  Private
const removeUserFromGroup = asyncHandler(async (req, res) => {
    const { userId, groupId } = req.body;

    try {
        const result = await groupService.removeUserFromGroup(userId, groupId);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// @desc    Delete group
// @route   DELETE /community/deleteGroup/:id
// @access  Private
const deleteGroup = asyncHandler(async (req, res) => {
    const groupId = req.params.id;

    try {
        const deletedGroup = await groupService.deleteGroup(groupId);
        res.status(200).json(deletedGroup);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


module.exports = {
    createGroup,
    fetchGroupPosts,
    addMemberToGroup,
    removeUserFromGroup,
    deleteGroup
}