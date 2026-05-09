import { Box, InputBase, Button, useTheme, Divider } from '@mui/material';
import UserImage from './UserImage';
import FlexBetween from './FlexBetween';
import CommentItem from './CommentItem'; // Import the new reusable component
import { useSelector, useDispatch } from 'react-redux';
import { setPost } from 'state';
import { useState } from 'react';
import {
  showSuccess,
  showError,
  showInfo,
  showWarning,
} from "../utils/toast";

const Comments = ({ postId, comments }) => {
  const [text, setText] = useState(''); // State for new comment input

  const { palette } = useTheme();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);

  // 1. ADD COMMENT FUNCTION
  const handleAddComment = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/posts/${postId}/comment`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user._id, comment: text }),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('You must be logged in to add a comment.');
        }
        if (response.status === 400) {
          throw new Error('Comment cannot be empty.');
        }
        if (response.status === 500) {
          throw new Error('Server error. Please try again later.');
        }
        throw new Error('Unable to post your comment.');
      }

      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      setText(''); // Clear the input field
      showSuccess("Comment added successfully!");
    } catch (error) {
        showError(error.message);
    }
  };  

  // 2. DELETE COMMENT FUNCTION
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/posts/${postId}/${commentId}/delete`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('You are not authorized to delete this comment.');
        }
        if (response.status === 404) {
          throw new Error('Comment not found.');
        }
        throw new Error('Unable to delete the comment.');
      }

      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      showWarning("Comment deleted.");
    } catch (error) {
        showError(error.message);
    }
  };

  // 3. EDIT COMMENT FUNCTION (Receives ID and Text from Child)
  const handleEditComment = async (commentId, newText) => {
    try {
      const response = await fetch(
        `http://localhost:3001/posts/${postId}/${commentId}/edit`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ comment: newText }),
        }
      );

       if (!response.ok) {
        if (response.status === 401) {
          throw new Error('You are not allowed to edit this comment.');
        }
        if (response.status === 400) {
          throw new Error('Comment cannot be empty.');
        }
        if (response.status === 404) {
          throw new Error('This comment no longer exists.');
        }
        throw new Error('Failed to save your comment.');
      }

      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      showInfo("Comment updated successfully!");
    } catch (error) {
        showError(error.message);
    }
  };

  return (
    <Box mt="0.75rem">
      {/* ADD NEW COMMENT INPUT SECTION */}
          <Box
      sx={{
        backgroundColor: palette.background.alt,
        borderRadius: '0.75rem',
        p: '0.75rem',
        mb: '1rem',
      }}
    >
      <FlexBetween gap="0.75rem">
        <UserImage image={user.picturePath} size="38px" />
        <InputBase
          placeholder="Write a comment..."
          onChange={(e) => setText(e.target.value)}
          value={text}
          fullWidth
          sx={{
            backgroundColor: palette.neutral.light,
            borderRadius: '0.75rem',
            px: '0.75rem',
            py: '0.5rem',
            fontSize: '0.875rem',
          }}
        />
        <Button
          disabled={!text}
          onClick={handleAddComment}
          sx={{
            minWidth: '70px',
            height: '36px',
            borderRadius: '0.75rem',
            backgroundColor: palette.primary.main,
            color: '#fff',
            fontSize: '0.75rem',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: palette.primary.dark,
            },
          }}
        >
          POST
        </Button>
      </FlexBetween>
</Box>

      {/* COMMENTS LIST */}
      <Box display="flex" flexDirection="column" gap="0.25rem">
        {comments.map((comment, i) => (
          <CommentItem
            key={`${comment.userId}-${i}`} // Use a unique key
            comment={comment}
            loggedInUserId={user._id}
            onDelete={handleDeleteComment}
            onEdit={handleEditComment}
          />
        ))}
      </Box>
      <Divider sx={{ mt: '0.75rem' }}/>
    </Box>
  );
};

export default Comments;
