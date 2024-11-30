const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");
const myPostsMiddleware = require("../middleware/myPostsMiddleware");

const Post = require("../models/postModel");
const User = require("../models/userModel");

const multer = require('multer'); //lib for image upload

// Configure Multer
const storage = multer.memoryStorage(); // Store image in memory
const upload = multer({ storage });


router.get("/", myPostsMiddleware, postController.getAllPosts);

router.get('/images/:id', myPostsMiddleware, postController.getImages);

// router.get("/", myPostsMiddleware, postController.getAllprofileImages);

// router.get('/profile-images/:id', myPostsMiddleware, postController.getProfileImages);

router.get("/my-posts", myPostsMiddleware, postController.myPosts);

router.get("/create", authMiddleware, postController.createPost);

router.post("/submit-post", upload.single("image"), authMiddleware,  async (req, res) => {
    const { title, content, author } = req.body;
    
    try {
        // Create a new post associated with the logged-in user (modification)
        const newPost = new Post({ 
            title,
            author,
            content, 
            name: req.file.originalname, 
            image: req.file.buffer, 
            contentType: req.file.mimetype, 
            user: req.user 
        }); // Ties post to user ID
        console.log(newPost)
        console.log("request:", req.file)
        console.log("File uploaded Succesfully");
        await newPost.save(); // Save the post to MongoDB
        res.redirect("/"); // Redirect back to the homepage
        console.log("post submitted/created");
        
    } catch (err) {
        console.log(err);
        res.status(500).send("Error saving post.");
    }
});

// upload profile picture
router.post("/upload-profile-pic", upload.single("profile-pic"), authMiddleware,  async (req, res) => {    
    try {
        const userId = req.user._id; // Assuming user is authenticated and `req.user` exists

        console.log("User Id:", req.user._id)
    
        // Find the user and update their profile picture
        const user = await User.findOne( userId );

        if (!user) return res.status(404).send('User not found');
    
        user.profilePicture = {
          data: req.file.buffer, // Save image data
          contentType: req.file.mimetype,
        };
        console.log("request:", req.file)
    
        await user.save();
        res.redirect("/");
        console.log('Profile picture updated successfully!');
      } catch (err) {
        console.error(err);
        res.status(500).send('Error updating profile picture');
      }
});

router.get('/profile-picture/:userId', myPostsMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user || !user.profilePicture) {
        return res.status(404).send('Profile picture not found');
      }
  
      res.set('Content-Type', user.profilePicture.contentType);
      res.send(user.profilePicture.data);
    } catch (err) {
      res.status(500).send('Error fetching profile picture');
    }
  });
 
// Route to view each/specific post by id
router.get("/view/:id", postController.viewPost);

// Route to render the edit post form
router.get("/edit/:id", authMiddleware, postController.editPost);

// Handle the post update
router.put("/update-post/:id", authMiddleware, postController.updatePost); // i made changes here not yet tested

router.delete("/delete-post/:id", authMiddleware, postController.deletePost);

module.exports = router;