import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
  ref: "User",
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
    picturePath: String,
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
  { timestamps: true }
);

postSchema.index({ description: "text"  });

const Post = mongoose.model("Post", postSchema);

export default Post;