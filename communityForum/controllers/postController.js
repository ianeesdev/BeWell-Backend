const asyncHandler = require("express-async-handler");
const postService = require("../services/postService");

// @desc    Create a new post
// @route   POST /community/createPost
// @access  Private
const createPost = asyncHandler(async (req, res) => {
    const { isAnonymous, text, image, author, groupId } = req.body;

    try {
        const post = await postService.createPost(isAnonymous, text, image, author, groupId);
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// @desc    Fetch all posts
// @route   GET /community/fetchPosts
// @access  Public
const fetchPosts = asyncHandler(async (req, res) => {
    try {
        const posts = await postService.fetchPosts();
        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// @desc    Fetch post by ID
// @route   GET /community/fetchPost/:id
// @access  Public
const fetchPostById = asyncHandler(async (req, res) => {
    const postId = req.params.id;

    try {
        const post = await postService.fetchPostById(postId);
        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// @desc    Add comment to post
// @route   POST /community/addCommentToPost/:postId
// @access  Private
const addCommentToPost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { commentText, userId } = req.body;

    try {
        const comment = await postService.addCommentToPost(postId, commentText, userId);
        res.status(201).json(comment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = {
    createPost,
    fetchPosts,
    fetchPostById,
    addCommentToPost,
}