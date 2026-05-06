/* andles all user-related operations:
  - Fetch user profile
  - Fetch friends list
  - Search users
  - Add or remove friends
 */

import User from '../models/User.js';

// Fetch a user profile by ID
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Unable to load the user profile. Please try again later.' });
  }
};

// Fetch all friends of a user
export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
     if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Fetch all friend documents
    const friends = await Promise.all(
      user.friends.map((friendId) => User.findById(friendId))
    );

    // Return only safe public fields
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(500).json({ msg: "Unable to load this user's friends list."});
  }
};

/* SEARCH USER :  Search users by first name or last name */
export const getUserBySearch = async (req, res) => {
  try {
    const { query } = req.params;

    // If the query is empty, return an empty array
    if (!query) return res.status(200).json([]);

    // Search for users where firstName OR lastName matches the query
    // $regex: query -> matches partial strings
    // $options: "i" -> makes it Case Insensitive (e.g., "Vivek" matches "vivek")
    const users = await User.find({
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
      ],
    });

    res.status(200).json(users);
  } catch (err) {
    res.status(404).json({msg : 'Unable to search users at the moment.'});
  }
};

/* UPDATE : Add or remove a friend from user's friend list */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);
    if (!user || !friend) {
      return res.status(404).json({
        success: false,
        message: 'User or friend not found.',
      });
    }

    //  If friend already exists → remove   , Else → add
    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    // Return updated friends list
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(500).json({ msg: 'Unable to update the friends list. Please try again later.' });
  }
};
