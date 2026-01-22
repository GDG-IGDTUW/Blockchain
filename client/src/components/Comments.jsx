import { Box, InputBase, Button, useTheme, Divider } from "@mui/material";
import UserImage from "./UserImage";
import FlexBetween from "./FlexBetween";
import CommentItem from "./CommentItem"; // Import the new reusable component
import { useSelector, useDispatch } from "react-redux";
import { setPost } from "state";
import { useState } from "react";

const Comments = ({ postId, comments }) => {
  const [text, setText] = useState(""); // State for new comment input
  
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);

  // 1. ADD COMMENT FUNCTION
  const handleAddComment = async () => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user._id, comment: text }),
      });
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      setText(""); // Clear the input field
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // 2. DELETE COMMENT FUNCTION
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/posts/${postId}/${commentId}/delete`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // 3. EDIT COMMENT FUNCTION (Receives ID and Text from Child)
  const handleEditComment = async (commentId, newText) => {
    try {
      const response = await fetch(
        `http://localhost:3001/posts/${postId}/${commentId}/edit`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ comment: newText }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save comment. Status: " + response.status);
      }

      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      console.log("Comment updated successfully!");
    } catch (error) {
      console.error("Error saving edit:", error);
    }
  };

  return (
    <Box mt="0.5rem">
      {/* ADD NEW COMMENT INPUT SECTION */}
      <FlexBetween gap="1rem" sx={{ mb: "1rem" }}>
        <UserImage image={user.picturePath} size="35px" />
        <InputBase
          placeholder="Write a comment..."
          onChange={(e) => setText(e.target.value)}
          value={text}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "0.5rem 1rem",
          }}
        />
        <Button
          disabled={!text}
          onClick={handleAddComment}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
            "&:hover": { color: palette.primary.main },
          }}
        >
          POST
        </Button>
      </FlexBetween>

      {/* COMMENTS LIST */}
      <Box>
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
      <Divider />
    </Box>
  );
};

export default Comments;