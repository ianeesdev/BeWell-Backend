const User = require("../models/userModel");
const Group = require("../models/groupModel");
const Post = require("../models/postModel");

class PostService {
  async createPost(isAnonymous, text, image, author, groupId) {
    try {
      const groupIdObject = await Group.findOne({ _id: groupId }, { _id: 1 });

      const createdPost = await Post.create({
        isAnonymous,
        text,
        image,
        author,
        group: groupIdObject, // Assign groupId if provided, or leave it null for personal account
      });

      // Update User model
      await User.findByIdAndUpdate(author, {
        $push: { posts: createdPost._id },
      });

      if (groupIdObject) {
        // Update Group model
        await Group.findByIdAndUpdate(groupIdObject, {
          $push: { posts: createdPost._id },
        });
      }

      return this.fetchPosts();
    } catch (error) {
      throw new Error(`Failed to create post: ${error.message}`);
    }
  }

  async fetchPosts() {
    try {
      const postsQuery = Post.find({ parentId: { $in: [null, undefined] } })
        .sort({ createdAt: "desc" })
        .populate({
          path: "author",
          model: User,
        })
        .populate({
          path: "group",
          model: Group,
        })
        .populate({
          path: "comment", // Populate the comment field
          populate: {
            path: "author", // Populate the author field within children
            model: User,
            select: "_id name parentId",
          },
        });

      const posts = await postsQuery.exec();

      return posts;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  }

  async fetchPostById(postId) {
    try {
      const post = await Post.findById(postId)
        .populate({
          path: "author",
          model: User,
          select: "_id username name image",
        }) // Populate the author field with _id and username
        .populate({
          path: "group",
          model: Group,
          select: "_id name image",
        }) // Populate the group field with _id and name
        .populate({
          path: "comment", // Populate the comment field
          populate: [
            {
              path: "author", // Populate the author field within comment
              model: User,
              select: "_id username name parentId image", // Select only _id and username fields of the author
            },
            {
              path: "comment", // Populate the comment field within comment
              model: Post, // The model of the nested comments(assuming it's the same "Post" model)
              populate: {
                path: "author", // Populate the author field within nested comment
                model: User,
                select: "_id username name parentId image", // Select only _id and username fields of the author
              },
            },
          ],
        })
        .exec();

      return post;
    } catch (err) {
      console.error("Error while fetching post:", err);
      throw new Error("Unable to fetch post");
    }
  }

  async addCommentToPost(postId, commentText, userId) {
    try {
      // Find the original post by its ID
      const originalPost = await Post.findById(postId);

      if (!originalPost) {
        throw new Error("Post not found");
      }

      // Create the new comment thread
      const commentPost = new Post({
        text: commentText,
        author: userId,
        parentId: postId, // Set the parentId to the original post's ID
      });

      // Save the comment thread to the database
      const savedCommentPost = await commentPost.save();

      // Add the comment thread's ID to the original thread's children array
      originalPost.comment.push(savedCommentPost._id);

      // Save the updated original post to the database
      await originalPost.save();
      // Return the newly created comment thread

      return savedCommentPost;
    } catch (err) {
      console.error("Error while adding comment:", err);
      throw new Error("Unable to add comment");
    }
  }

  async deletePost(postId) {
    try {
      // Find the post by ID
      const post = await Post.findById(postId);

      if (!post) {
        throw new Error("Post not found");
      }

      // Delete all comments associated with the post
      await this.deleteComments(post.comment);

      // Delete the post itself
      await post.deleteOne();

      return true;
    } catch (error) {
      throw new Error(`Failed to delete post: ${error.message}`);
    }
  }

  async deleteComments(commentIds) {
    try {
      // Delete all comments recursively
      for (const commentId of commentIds) {
        const comment = await Post.findById(commentId);
        if (comment) {
          await this.deleteComments(comment.comment); // Delete child comments first
          await comment.remove(); // Then delete the comment itself
        }
      }
    } catch (error) {
      throw new Error(`Failed to delete comments: ${error.message}`);
    }
  }
}

module.exports = new PostService();
