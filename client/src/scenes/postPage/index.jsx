import { Box, CircularProgress } from '@mui/material';
import { useParams, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from 'scenes/navbar';
import PostWidget from 'scenes/widgets/PostWidget';
import { setPost } from 'state';

const PostPage = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const post = useSelector((state) =>
    state.posts.find((p) => p._id === postId)
  );

  const getPost = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPost({ post: data }));
  };

  useEffect(() => {
    getPost();
  }, [postId]);

  if (!post) {
    return (
      <Box display="flex" justifyContent="center" mt="4rem">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Navbar />

      <Box width="60%" margin="2rem auto">
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
