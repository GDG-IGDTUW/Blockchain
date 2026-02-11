/* MongoDB schema for application users.
Stores profile information, authentication data, and social connections. */

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },

    // Profile picture path
    picturePath: {
      type: String,
      default: '',
    },
    friends: {
      type: Array,
      default: [],
    },
    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number,   // Total impressions on user's posts
  },
  { timestamps: true }     // Adds createdAt and updatedAt fields
);

UserSchema.index({
  firstName: 'text',
  lastName: 'text',
  email: 'text',
});

const User = mongoose.model('User', UserSchema);
export default User;
