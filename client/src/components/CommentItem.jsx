import { Box, Typography, useTheme, IconButton, InputBase, Divider } from "@mui/material";
import { DeleteOutline, EditOutlined, Save, Cancel, FavoriteBorder, Favorite } from "@mui/icons-material";
import { useState } from "react";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";

const CommentItem = ({ comment, loggedInUserId, onDelete, onEdit }) => {
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.comment);
  
  // Local state for Like UI
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // --- TIME AGO LOGIC ---
  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Just now"; // Fallback if date is missing
    
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval === 1 ? "1 year ago" : `${interval} years ago`;

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval === 1 ? "1 month ago" : `${interval} months ago`;

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval === 1 ? "1 day ago" : `${interval} days ago`;

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval === 1 ? "1 hr ago" : `${interval} hr ago`;

    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval === 1 ? "1 min ago" : `${interval} min ago`;

    // Show seconds if less than 1 minute
    if (seconds < 60) return `${Math.max(0, seconds)} sec ago`;

    return "Just now";
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleSave = () => {
    onEdit(comment._id, editText);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(comment.comment);
    setIsEditing(false);
  };

  return (
    <Box>
      <Divider />
      <FlexBetween sx={{ m: "0.5rem 0" }} alignItems="flex-start">
        <Box display="flex" gap="1rem" width="100%">
          {/* Avatar */}
          <UserImage image={comment.userPicturePath} size="35px" />

          <Box width="100%">
            {/* Author Name and Time */}
            <Box display="flex" alignItems="center" gap="0.5rem">
                <Typography variant="h6" sx={{ color: main }}>
                  {comment.firstName} {comment.lastName}
                </Typography>
                
                {/* DATE DISPLAY */}
                <Typography variant="caption" sx={{ color: medium }}>
                    {formatTimeAgo(comment.createdAt)}
                </Typography>
            </Box>

            {/* EDIT MODE */}
            {isEditing ? (
              <FlexBetween gap="1rem">
                <InputBase
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  sx={{
                    backgroundColor: palette.neutral.light,
                    borderRadius: "1rem",
                    padding: "0.2rem 1rem",
                    width: "100%",
                    mt: "0.5rem",
                  }}
                  multiline
                />
                <Box display="flex">
                  <IconButton onClick={handleSave}>
                    <Save sx={{ color: palette.primary.main }} />
                  </IconButton>
                  <IconButton onClick={handleCancel}>
                    <Cancel sx={{ color: palette.error.main }} />
                  </IconButton>
                </Box>
              </FlexBetween>
            ) : (
              /* VIEW MODE */
              <Typography sx={{ color: medium, m: "0.5rem 0" }}>
                {comment.comment}
              </Typography>
            )}
          </Box>
        </Box>

        {/* ACTIONS (Like, Edit, Delete) */}
        <Box display="flex" flexDirection="column" alignItems="center">
            <IconButton onClick={handleLike} size="small">
                {isLiked ? (
                    <Favorite fontSize="small" sx={{ color: palette.primary.main }} />
                ) : (
                    <FavoriteBorder fontSize="small" />
                )}
            </IconButton>
            
            {comment.userId === loggedInUserId && !isEditing && (
                <Box display="flex" mt="0.2rem">
                <IconButton onClick={() => setIsEditing(true)} size="small">
                    <EditOutlined fontSize="small" sx={{ color: medium }} />
                </IconButton>
                <IconButton onClick={() => onDelete(comment._id)} size="small">
                    <DeleteOutline fontSize="small" sx={{ color: medium }} />
                </IconButton>
                </Box>
            )}
        </Box>
      </FlexBetween>
    </Box>
  );
};

export default CommentItem;