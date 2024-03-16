const User = require("../models/userModel");
const Group = require("../models/groupModel");
const Post = require("../models/postModel");

class GroupService {
  // Create Group Service
  async createGroup(name, image, bio, createdById) {
    try {
      // Find the user with the provided unique id
      const user = await User.findOne({ _id: createdById });

      if (!user) {
        throw new Error("User not found"); // Handle the case if the user with the id is not found
      }

      const newGroup = new Group({
        name,
        image,
        bio,
        createdBy: user._id, // Use the mongoose ID of the user
      });

      const createdGroup = await newGroup.save();

      // Update User model
      user.groups.push(createdGroup._id);
      await user.save();

      return createdGroup;
    } catch (error) {
      // Handle any errors
      console.error("Error creating group:", error);
      throw error;
    }
  }

  async fetchGroupPosts(id) {
    try {
      const groupPosts = await Group.findById(id).populate({
        path: "posts",
        model: Post,
        populate: [
          {
            path: "author",
            model: User,
            select: "name image id",
          },
          {
            path: "comment",
            model: Post,
            populate: {
              path: "author",
              model: User,
              select: "image _id",
            },
          },
        ],
      });

      return groupPosts;
    } catch (error) {
      // Handle any errors
      console.error("Error fetching group posts:", error);
      throw error;
    }
  }

  async addMemberToGroup(groupId, memberId) {
    try {
      // Find the group by its unique id
      const group = await Group.findOne({ _id: groupId });

      if (!group) {
        throw new Error("Group not found");
      }

      // Find the user by their unique id
      const user = await User.findOne({ _id: memberId });

      if (!user) {
        throw new Error("User not found");
      }

      // Check if the user is already a member of the group
      if (group.members.includes(user._id)) {
        throw new Error("User is already a member of the group");
      }

      // Add the user's _id to the members array in the group
      group.members.push(user._id);
      await group.save();

      // Add the group's _id to the groups array in the user
      user.groups.push(group._id);
      await user.save();

      return group;
    } catch (error) {
      // Handle any errors
      console.error("Error adding member to group:", error);
      throw error;
    }
  }

  async removeUserFromGroup(userId, groupId) {
    try {
      const userIdObject = await User.findOne({ id: userId }, { _id: 1 });
      const groupIdObject = await Group.findOne({ id: groupId }, { _id: 1 });

      if (!userIdObject) {
        throw new Error("User not found");
      }

      if (!groupIdObject) {
        throw new Error("Group not found");
      }

      // Remove the user's _id from the members array in the group
      await Group.updateOne(
        { _id: groupIdObject._id },
        { $pull: { members: userIdObject._id } }
      );

      // Remove the group's _id from the groups array in the user
      await User.updateOne(
        { _id: userIdObject._id },
        { $pull: { groups: groupIdObject._id } }
      );

      return { success: true };
    } catch (error) {
      // Handle any errors
      console.error("Error removing user from group:", error);
      throw error;
    }
  }

  async deleteGroup(groupId) {
    try {
      // Find the group by its ID and delete it
      const deletedGroup = await Group.findOneAndDelete({
        id: groupId,
      });

      if (!deletedGroup) {
        throw new Error("Group not found");
      }

      // Delete all posts associated with the group
      await Post.deleteMany({ group: groupId });

      // Find all users who are part of the group
      const groupUsers = await User.find({ groups: groupId });

      // Remove the group from the 'groups' array for each user
      const updateUserPromises = groupUsers.map((user) => {
        user.groups.pull(groupId);
        return user.save();
      });

      await Promise.all(updateUserPromises);

      return deletedGroup;
    } catch (error) {
      console.error("Error deleting group: ", error);
      throw error;
    }
  }
}

module.exports = new GroupService();
