import { Box, Typography, useTheme, Fade } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";
import { FriendListSkeleton } from "components/WidgetSkeleton";

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);

  const getFriends = async () => {
    setIsLoading(true);
    const response = await fetch(
      `http://localhost:3001/users/${userId}/friends`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
    setIsLoading(false);
  };

  useEffect(() => {
    getFriends();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return <FriendListSkeleton />;
  }

  return (
    <Fade in={!isLoading} timeout={500}>
      <WidgetWrapper>
        <Typography
          color={palette.neutral.dark}
          variant="h5"
          fontWeight="500"
          sx={{ mb: "1.5rem" }}
        >
          Friend List
        </Typography>
        <Box display="flex" flexDirection="column" gap="1.5rem">
          {friends && friends.length > 0 ? (
            friends.map((friend) => (
              <Friend
                key={friend._id}
                friendId={friend._id}
                name={`${friend.firstName} ${friend.lastName}`}
                subtitle={friend.occupation}
                userPicturePath={friend.picturePath}
              />
            ))
          ) : (
            <Typography color={palette.neutral.medium}>
              No friends yet.
            </Typography>
          )}
        </Box>
      </WidgetWrapper>
    </Fade>
  );
};

export default FriendListWidget;
