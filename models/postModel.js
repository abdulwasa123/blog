const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        author: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            required: true,
            default: Date.now
        },
        publishDate: {
            type: Date,
            default: Date.now // Optional: Auto-set publishDate
        },
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User',
            required: true
        },
        //image upload schema objects here
        name: {
            type: String, 
            required: true 
        },
        image: { 
            type: Buffer, 
            required: true 
        },
        contentType: { 
            type: String, 
            required: true 
        }
    });

const Post = mongoose.model("Post", postSchema);

module.exports = Post;