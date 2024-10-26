const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");
const myPostsMiddleware = require("../middleware/myPostsMiddleware");

router.get("/", myPostsMiddleware, postController.getAllPosts);

router.get("/my-posts", myPostsMiddleware, postController.myPosts);

router.get("/create", authMiddleware, postController.createPost);

router.post("/submit-post", authMiddleware, postController.submitPost);

// Route to view each/specific post by id
router.get("/view/:id", postController.viewPost);

// Route to render the edit post form
router.get("/edit/:id", authMiddleware, postController.editPost);

// Handle the post update
router.put("/update-post/:id", authMiddleware, postController.updatePost); // i made changes here not yet tested

router.delete("/delete-post/:id", authMiddleware, postController.deletePost);

module.exports = router;