import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import Post from "../models/posts.model.js";
import Comment from "../models/comments.model.js";


import bcrypt from "bcrypt";




export const activeCheck = async (req, res) => {

  return res.status(200).json({ message: "RUNNING", });
}
  


export const createPost = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const post = new Post({
      userId: user._id,
      body: req.body.body,
     // media: req.file != undefined ? req.file.filename : "",
     media: req.file ? `uploads/${req.file.filename}` : "",
      fileType: req.file != undefined ? req.file.mimetype.split("/")[1] : "",
    })

    await post.save();

    return res.status(200).json({ message: "Post created" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}



export const getAllPosts = async (req, res) => {

  try {
    const posts = await Post.find()
    .populate("userId", "name email username profilePicture")
    return res.json({posts});

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}


export const deletePost = async (req, res) => {

  const { token, post_id } = req.body;

  try {
    const user = await User.findOne({ token: token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

      const post = await Post.findOne({ _id: post_id });

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      if (post.userId.toString() !== user._id.toString()) {
        return res.status(401).json({ message: "not authorized" });
      }

      await Post.deleteOne({ _id: post_id });

      return res.status(200).json({ message: "Post deleted" });
    
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }



export const commentPost = async (req, res) => {
  const { token, post_id, body } = req.body;

  try {
    const user = await User.findOne({ token: token }).select("_id");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = new Comment({
      userId: user._id,
      postId: post._id,
      body: body,
    });

    await newComment.save();

    return res.status(200).json({ message: "Comment added" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}



export const get_comments_by_post = async (req, res) => {
  const { post_id } = req.body;

  try {

    const comments = await Comment.find({ postId: post_id })
      .populate("userId", "name username profilePicture");

    return res.status(200).json({ comments });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

 

  export const delete_comment_of_user = async (req, res) => {

    const { token, comment_id } = req.body;

    try {
      const user = await User.findOne({ token: token }).select("_id");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const comment = await Comment.findOne({ _id: comment_id });

      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      if (comment.userId.toString() !== user._id.toString()) {
        return res.status(401).json({ message: "not authorized" });
      }

      await Comment.deleteOne({ _id: comment_id });

      return res.status(200).json({ message: "Comment deleted" });

    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }


export const increment_likes = async (req, res) => {
  const { post_id, user_id } = req.body;

  try {
    const post = await Post.findOne({ _id: post_id });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user already liked this post
    if (post.likedBy.includes(user_id)) {
      return res.status(400).json({ message: "You have already liked this post." });
    }

    post.likes = post.likes + 1;
    post.likedBy.push(user_id);
    await post.save();

    return res.status(200).json({ message: "Like incremented", likes: post.likes });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

