import { Router } from "express";
import { activeCheck, commentPost, createPost } from "../controllers/posts.controller.js";
import multer from "multer";
import { getAllPosts, deletePost, get_comments_by_post, delete_comment_of_user, increment_likes } from "../controllers/posts.controller.js";
import express from "express";


const router = Router();



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})


const upload = multer({ storage: storage })


router.route('/').get(activeCheck);


router.route("/post").post(upload.single("media"), createPost);
router.route("/posts").get(getAllPosts);
router.route("/delete_post").delete(deletePost);
router.route("/increment_post_like").post(increment_likes);

router.route("/comments").post(commentPost);
router.route("/get_comments").post(get_comments_by_post);
router.route("/delete_comment").delete(delete_comment_of_user);


export default router;