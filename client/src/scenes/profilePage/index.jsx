import { Box, Button, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "scenes/navbar";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import UserWidget from "scenes/widgets/UserWidget";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const navigate = useNavigate();

  const getUser = async () => {
  try {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      if (response.status === 401) {
        alert("You are not logged in. Please log in again.");
        return;
      }
      if (response.status === 404) {
        alert("User not found.");
        return;
      }
      if (response.status === 403) {
        alert("You do not have permission to view this profile.");
        return;
      }
      alert("Could not load this profile. Please try again later.");
      return;
    }

    const data = await response.json();
    setUser(data);
  } catch (err) {
    alert("Network error while loading this profile. Please try again.");
  }
};


  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={userId} picturePath={user.picturePath} />

          {/* 
            Button added to navigate to Profile Settings page.
            This allows users to edit their profile details.
          */}
          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: "1rem" }}
            onClick={() =>
              navigate(`/profile/settings/${userId}`)
            }
          >
            Edit Profile
          </Button>

          <Box m="2rem 0" />
          <FriendListWidget userId={userId} />
        </Box>

        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget picturePath={user.picturePath} />
          <Box m="2rem 0" />
          <PostsWidget userId={userId} isProfile />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;