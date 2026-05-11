import { Box, InputBase, Button, useTheme, Divider } from '@mui/material';
import UserImage from './UserImage';
import FlexBetween from './FlexBetween';
import CommentItem from './CommentItem'; // Import the new reusable component
import { useSelector, useDispatch } from 'react-redux';
import { setPost } from 'state';
import { useState } from 'react';

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
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      setText(''); // Clear the input field
    } catch (error) {
      console.error('Error adding comment:', error);
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
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
    } catch (error) {
      console.error('Error deleting comment:', error);
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
        throw new Error('Failed to save comment. Status: ' + response.status);
      }

      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      console.log('Comment updated successfully!');
    } catch (error) {
      console.error('Error saving edit:', error);
    }
  };

  return (
    <Box mt="0.75rem">
      {/* ADD NEW COMMENT INPUT SECTION */}
          <Box
      sx={{
        backgroundColor: palette.background.alt,
        border: `1px solid ${palette.neutral.light}`,
        borderRadius: '1rem',
        boxShadow: '0 2px 6px rgba(15,23,42,0.04)',
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
