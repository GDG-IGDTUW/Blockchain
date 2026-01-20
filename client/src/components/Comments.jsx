import { Box, Typography, useTheme, IconButton, Divider, InputBase, Button } from "@mui/material";
import { DeleteOutline, EditOutlined, Save, Cancel } from "@mui/icons-material";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { useSelector, useDispatch } from "react-redux";
import { setPost } from "state";
import { useState } from "react";

const Comments = ({ postId, comments }) => {
  const [text, setText] = useState(""); // State for new comment input
  const [editingCommentId, setEditingCommentId] = useState(null); // Which comment is currently being edited?
  const [editRequestText, setEditRequestText] = useState(""); // Text state for the comment being edited

  const { palette } = useTheme();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);

  // 1. ADD COMMENT FUNCTION
  const handleAddComment = async () => {
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
  };

  // 2. DELETE COMMENT FUNCTION
  const handleDeleteComment = async (commentId) => {
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
  };

  // 3. START EDITING (Triggered when Edit icon is clicked)
  const startEditing = (commentId, currentText) => {
    setEditingCommentId(commentId);
    setEditRequestText(currentText);
  };

  // 4. SAVE EDIT (Updated with Safety Checks)
  const handleSaveEdit = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/posts/${postId}/${editingCommentId}/edit`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ comment: editRequestText }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save comment. Status: " + response.status);
      }

      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      setEditingCommentId(null); // Exit edit mode
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
      {comments.map((c, i) => (
        <Box key={`${c.userId}-${i}`}>
          <Divider />
          <FlexBetween sx={{ m: "0.5rem 0" }}>
            <Box display="flex" gap="1rem" width="100%">
              <UserImage image={c.userPicturePath} size="35px" />
              
              <Box width="100%">
                <Typography variant="h6" sx={{ color: palette.neutral.main }}>
                  {c.firstName} {c.lastName}
                </Typography>

                {/* LOGIC: If this comment is in EDIT mode, show Input field; otherwise show Text */}
                {editingCommentId === c._id ? (
                  <FlexBetween gap="1rem">
                    <InputBase
                        value={editRequestText}
                        onChange={(e) => setEditRequestText(e.target.value)}
                        sx={{
                            backgroundColor: palette.neutral.light,
                            borderRadius: "1rem",
                            padding: "0.2rem 1rem",
                            width: "100%",
                            mt: "0.5rem"
                        }}
                    />
                    {/* SAVE & CANCEL Buttons */}
                    <Box display="flex">
                        <IconButton onClick={handleSaveEdit}>
                            <Save sx={{ color: palette.primary.main }} />
                        </IconButton>
                        <IconButton onClick={() => setEditingCommentId(null)}>
                            <Cancel sx={{ color: palette.error.main }} />
                        </IconButton>
                    </Box>
                  </FlexBetween>
                ) : (
                  <Typography sx={{ color: palette.neutral.medium, m: "0.5rem 0" }}>
                    {c.comment}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* ACTION BUTTONS (Edit/Delete) - Only visible for the user's own comments */}
            {c.userId === user._id && editingCommentId !== c._id && (
              <Box display="flex">
                 {/* EDIT BUTTON */}
                <IconButton onClick={() => startEditing(c._id, c.comment)}>
                    <EditOutlined sx={{ color: palette.neutral.medium }} />
                </IconButton>
                {/* DELETE BUTTON */}
                <IconButton onClick={() => handleDeleteComment(c._id)}>
                    <DeleteOutline sx={{ color: palette.neutral.medium }} />
                </IconButton>
              </Box>
            )}
          </FlexBetween>
        </Box>
      ))}
      <Divider />
    </Box>
  );
};

export default Comments;