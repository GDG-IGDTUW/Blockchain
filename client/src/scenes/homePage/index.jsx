import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import Navbar from 'scenes/navbar';
import UserWidget from 'scenes/widgets/UserWidget';
import MyPostWidget from 'scenes/widgets/MyPostWidget';
import PostsWidget from 'scenes/widgets/PostsWidget';
import AdvertWidget from 'scenes/widgets/AdvertWidget';
import FriendListWidget from 'scenes/widgets/FriendListWidget';


const HomePage = () => {
  const isNonMobileScreens = useMediaQuery('(min-width:1000px)');
  const { _id, picturePath } = useSelector((state) => state.user);
 const { palette } = useTheme();

  return (
    <Box sx={{ backgroundColor: palette.background.default, minHeight: '100vh' }}>
      <Navbar />
      <Box
        width="100%"
        maxWidth="1400px"
        mx="auto"
        px={isNonMobileScreens ? 6 : 2}
        py={3}
        display="flex"
        flexDirection={isNonMobileScreens ? 'row' : 'column'}
        gap="1.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? '25%' : '100%'}>
          <UserWidget userId={_id} picturePath={picturePath} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? '45%' : '100%'}
          display="flex"
          flexDirection="column"
          gap="1.5rem"
        >
          <MyPostWidget picturePath={picturePath} />
          <PostsWidget userId={_id} />
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="25%"
            display="flex"
            flexDirection="column"
            gap="1.5rem"
          >
            <AdvertWidget />
            <Box m="2rem 0" />
            <FriendListWidget userId={_id} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;
