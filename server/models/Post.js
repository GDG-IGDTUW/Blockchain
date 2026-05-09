/* Defines the MongoDB schema for social media posts.
Each Post belongs to a user and may contain likes and comments.  */

import mongoose from 'mongoose';

const postSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    location: String,
    description: String,

    //  Image uploaded with the post
    picturePath: String,

    // User profile picture shown on post
    userPicturePath: String,
    likes: {
      type: Map,
      of: Boolean,
    },
    // 👇 FIX: Using simple Array type to avoid validation errors
    comments: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }    // Automatically adds createdAt & updatedAt
);

postSchema.index({ description: 'text' });

const Post = mongoose.model('Post', postSchema);

export default Post;
