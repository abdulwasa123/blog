const Post = require("../models/postModel");

// **GET** all posts (Public) - Modified to show posts from all users
const getAllPosts = async (req, res) => {
    try {
        // Find all posts, sorted by newest, and populate user info for post association
        const posts = await Post.find().sort({ createdAt: -1 }).populate("user", "username").sort({ createdAt: -1 }); 
        // Render posts on the homepage with user information (added association)
        res.render("HomePage.ejs", { posts: posts });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching posts.");
    }
};

const myPosts = async(req, res) => {
    try {
        // Assuming req.user contains the logged-in user's info
        const userId = req.user.id; // Get the logged-in user's ID
    
        // Find all posts from the logged-in user, sorted by newest, and populate user info
        const posts = await Post.find({ user: userId }).sort({ createdAt: -1 }).populate("user", "username");
    
        // Render posts on the homepage with user information
        res.render("MyPosts.ejs", { posts: posts });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching posts.");
    }
};

// **GET** the create post page (Private) - Only logged-in users can access this page
const createPost = (req, res) => {
    res.render("CreatePost.ejs");
};

// **POST** submit a new post (Private) - Modified to associate the post with the logged-in user
const submitPost = async (req, res) => {
    const { title, content, author } = req.body;
    
    try {
        // Create a new post associated with the logged-in user (modification)
        const newPost = new Post({ title, author, content, user: req.user }); // Ties post to user ID
        await newPost.save(); // Save the post to MongoDB
        res.redirect("/"); // Redirect back to the homepage
        console.log("post submitted/created");
        
    } catch (err) {
        console.log(err);
        res.status(500).send("Error saving post.");
    }
};

// **GET** a single post by ID (Public) - Anyone can view the post
const viewPost = async (req, res) => {
    try {
        // Find post by ID and populate user information (added user info)
        const post = await Post.findById(req.params.id).populate("user", "username");
        if (!post) {
            return res.status(404).send("Post not found");
        }
        res.render("ViewPost.ejs", { post: post });
    } catch (err) {
        console.log(err)
        res.status(500).send("Error fetching post.");
    }
};

// **GET** render the edit post page (Private) - Modified to allow only the post's owner to edit
const editPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send("Post not found");
        }

        // Ensure only the owner of the post can edit it (modification)
        if (post.user.toString() !== req.user) {
            return res.status(403).send("Not authorized to edit this post.");
        }
        res.render("EditPost.ejs", { post: post });
    } catch (err) {
        console.log(err)
        res.status(500).send("Error fetching post.");
    }
};

// **POST** update post (Private) - Modified to allow only the post's owner to update
const updatePost = async (req, res) => {
    const { title, content, author } = req.body;
    
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send("Post not found");
        }

        // Ensure only the owner of the post can update it (modification)
        if (post.user.toString() !== req.user) {
            return res.status(403).send("Not authorized to update this post.");
        }

        // Update the post's title and content
        post.title = title;
        post.content = content;
        post.author = author;
        await post.save(); // Save the updated post to MongoDB
        res.redirect(`/view/${post._id}`); // Redirect to the updated post's view
    } catch (err) {
        console.log(err);
        res.status(500).send("Error updating post.");
    }
};

// **DELETE** post (Private) - Modified to allow only the post's owner to delete
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send("Post not found");
        }

        // Ensure only the owner of the post can delete it (modification)
        if (post.user.toString() !== req.user) {
            return res.status(403).send("Not authorized to delete this post.");
        }

        await post.deleteOne(); // Delete the post from MongoDB
        res.redirect("/my-posts"); // Redirect to the my posts page after deletion
    } catch (err) {
        console.log(err)
        res.status(500).send("Error deleting post.");
    }
};

module.exports = {
    getAllPosts,  // Get all posts
    myPosts,
    createPost,   // Render create post page
    submitPost,   // Submit a new post
    viewPost,     // View a specific post
    editPost,     // Edit a post
    updatePost,   // Update a post
    deletePost    // Delete a post
};
 
// // get or view all posts
//     const getAllPosts = async (req,res) =>{
//     try {
//         const posts = await Post.find().sort({ createdAt: -1 }); // Find all posts, sort by newest
//         res.render("HomePage.ejs", { posts: posts }); //add the title author and content (the data) to the homepage
//     } catch (err) {
//         res.status(500).send("Error fetching posts.");
//     }      
// };

// // render the create post page
// const createPost = (req,res) =>{
//     res.render("CreatePost.ejs")
// };

// // route to submit post 
// const submitPost = async (req, res) => {
//     const { title, author, content } = req.body;

//     try {
//         const newPost = new Post({ title, author, content });
//         await newPost.save(); // Save the post to MongoDB
//         res.redirect("/"); // Redirect back to the homepage when submit button is clicked
//     } catch (err) {
//         res.status(500).send("Error saving post.");
//     }
// };

// // Route to view each/specific post by id
// const viewPost = async (req, res) => {
//     try {
//         const post = await Post.findById(req.params.id); // Find post by id
//         if (!post) {
//             return res.status(404).send("Post not found");
//         }
//         res.render("ViewPost.ejs", { post: post });
//     } catch (err) {
//         res.status(500).send("Error fetching post.");
//     }
// };

// // Route to render the edit post form
// const editPost = async (req, res) => {
//     try {
//         const post = await Post.findById(req.params.id); // Find post by id
//         if (!post) {
//             return res.status(404).send("Post not found");
//         }
//         res.render("EditPost.ejs", { post: post });
//     } catch (err) {
//         res.status(500).send("Error fetching post.");
//     }
// };

// // Handle the post update
// const updatePost = async (req, res) => {
//     const { title, author, content } = req.body;
//     try {
//         const updatedPost = await Post.findByIdAndUpdate(
//             req.params.id,
//             { title, author, content },
//             { new: true } // Return the updated document
//         );
//         if (!updatedPost) {
//             return res.status(404).send("Post not found");
//         }
//         res.redirect("/"); // Redirect to the home page
//     } catch (err) {
//         res.status(500).send("Error updating post.");
//     }
// };

// // delete a post
// const deletePost = async (req,res) =>{
//     try {
//         const deletedPost = await Post.findByIdAndDelete(req.params.id);
//         if (!deletedPost) {
//             return res.status(404).send("Post not found");
//         }
//         res.redirect("/"); // Redirect to the homepage after deletion
//     } catch (err) {
//         res.status(500).send("Error deleting post.");
//     }
// };

// module.exports = {
//     getAllPosts,
//     createPost,
//     submitPost,
//     viewPost,
//     editPost,
//     updatePost,
//     deletePost
// }