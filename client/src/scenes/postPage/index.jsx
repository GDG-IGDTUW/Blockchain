import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { useParams, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from 'scenes/navbar';
import PostWidget from 'scenes/widgets/PostWidget';
import { setPost } from 'state';

const PostPage = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
    const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const post = useSelector((state) =>
    state.posts.find((p) => p._id === postId)
  );
  const posts = useSelector((state) => state.posts || []);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getPost = async () => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Your session expired. Please login again.');
        }
        if (response.status === 404) {
          throw new Error('This post does not exist or was deleted.');
        }
        if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        }
        throw new Error('Failed to load post.');
      }

      const data = await response.json();
      dispatch(setPost({ post: data }));
    } catch (err) {
      setError(err.message || 'Unable to load this post.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPost();
  }, [postId]);

   if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt="4rem">
        <CircularProgress />
      </Box>
    );
  }

    // 🔴 Error state
  if (error) {
    return (
      <Box textAlign="center" mt="5rem">
        <Typography color="error" fontSize="1.1rem" mb="1rem">
          {error}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/home')}
        >
          Go back to Home
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Navbar />

      <Box width="60%" margin="2rem auto" minWidth="300px">
        <PostWidget
          postId={post._id}
          postUserId={post.userId}
          name={`${post.firstName} ${post.lastName}`}
          description={post.description}
          location={post.location}
          picturePath={post.picturePath}
          userPicturePath={post.userPicturePath}
          likes={post.likes}
          comments={post.comments}
        />
      </Box>
    </Box>
  );
};

export default PostPage;
