import { PersonAddOutlined, PersonRemoveOutlined } from '@mui/icons-material';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setFriends } from 'state';
import FlexBetween from './FlexBetween';
import UserImage from './UserImage';

const Friend = ({ friendId, name, subtitle, userPicturePath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isFriend =
    Array.isArray(friends) && friends.find((friend) => friend._id === friendId);

  const patchFriend = async () => {
    const response = await fetch(
      `http://localhost:3001/users/${_id}/${friendId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

  return (
    <FlexBetween sx={{
      p: '0.75rem',
      borderRadius: '0.75rem',
      transition: '0.2s',
      '&:hover': {
        backgroundColor: palette.neutral.light,
      },
    }}>
      <FlexBetween gap="0.75rem">
        <UserImage image={userPicturePath} size="48px" />
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            navigate(0);
          }}
          sx={{ cursor: 'pointer' }}
        >
          <Typography
           color={main}
          fontSize="0.95rem"
          fontWeight={600}
          sx={{ lineHeight: 1.2 }}
        >
          {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem" sx={{ mt: '0.1rem' }}>
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      <IconButton
        onClick={() => patchFriend()}
         sx={{
        backgroundColor: primaryLight,
        width: '34px',
        height: '34px',
        '&:hover': {
          backgroundColor: palette.primary.main,
        },
      }}
      >
        {isFriend ? (
          <PersonRemoveOutlined sx={{ fontSize: '18px', color: primaryDark }} />
        ) : (
          <PersonAddOutlined sx={{ fontSize: '18px', color: primaryDark }} />
        )}
      </IconButton>
    </FlexBetween>
  );
};

export default Friend;
