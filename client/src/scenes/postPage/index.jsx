import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import PostWidget from "scenes/widgets/PostWidget";
import { setPost } from "state";

const PostPage = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);

  const post = useSelector((state) =>
    state.posts?.find((p) => p._id === postId)
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getPost = async (signal) => {
    try {
      const response = await fetch(
        `http://localhost:3001/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal,
        }
      );

      if (!response.ok) {
        if (response.status === 401)
          throw new Error("Session expired. Please login again.");
        if (response.status === 404)
          throw new Error("Post not found.");
        if (response.status >= 500)
          throw new Error("Server error. Please try later.");
        throw new Error("Failed to load post.");
      }

      const data = await response.json();
      dispatch(setPost({ post: data }));
      setError(null);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    getPost(controller.signal);

    return () => controller.abort();
  }, [postId, token, dispatch]);

  /* Loading */
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt="4rem">
        <CircularProgress />
      </Box>
    );
  }

  /* Error */
  if (error) {
    return (
      <Box textAlign="center" mt="5rem">
        <Typography color="error" mb="1rem">
          {error}
        </Typography>
        <Button variant="contained" onClick={() => navigate("/home")}>
          Go Back Home
        </Button>
      </Box>
    );
  }

  /* Post missing (safety net) */
  if (!post) {
    return (
      <Box textAlign="center" mt="5rem">
        <Typography>Post not available.</Typography>
        <Button variant="contained" onClick={() => navigate("/home")}>
          Go Home
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
