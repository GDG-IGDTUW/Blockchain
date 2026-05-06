import { Box, Button, useMediaQuery,Typography, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from 'scenes/navbar';
import FriendListWidget from 'scenes/widgets/FriendListWidget';
import MyPostWidget from 'scenes/widgets/MyPostWidget';
import PostsWidget from 'scenes/widgets/PostsWidget';
import UserWidget from 'scenes/widgets/UserWidget';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery('(min-width:1000px)');
  const navigate = useNavigate();

  const getUser = async () => {
     setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

     if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Your session has expired. Please login again.');
        }
        if (response.status === 404) {
          throw new Error('This user profile does not exist.');
        }
        if (response.status === 403) {
          throw new Error('You do not have permission to view this profile.');
        }
        throw new Error('Unable to load this profile. Please try again later.');
      }

      const data = await response.json();
      setUser(data);
    } catch (err) {
      setError(err.message || 'Network error. Please try again.');
    }finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

   if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt="4rem">
        <CircularProgress />
      </Box>
    );
  }

  // 🔴 Error UI
  if (error) {
    return (
      <Box textAlign="center" mt="5rem">
        <Typography color="error" mb="1rem">
          {error}
        </Typography>
        <Button variant="contained" onClick={getUser}>
          Retry
        </Button>
        <Button sx={{ ml: '1rem' }} onClick={() => navigate('/home')}>
          Go Home
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? 'flex' : 'block'}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? '26%' : undefined}>
          <UserWidget userId={userId} picturePath={user.picturePath} />

          {/* 
            Button added to navigate to Profile Settings page.
            This allows users to edit their profile details.
          */}
          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: '1rem' }}
            onClick={() => navigate(`/profile/settings/${userId}`)}
          >
            Edit Profile
          </Button>

          <Box m="2rem 0" />
          <FriendListWidget userId={userId} />
        </Box>

        <Box
          flexBasis={isNonMobileScreens ? '42%' : undefined}
          mt={isNonMobileScreens ? undefined : '2rem'}
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
