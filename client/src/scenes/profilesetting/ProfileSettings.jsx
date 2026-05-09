import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Navbar from 'scenes/navbar';
import {
  showSuccess,
  showError,
  showWarning
} from "../../utils/toast";

const ProfileSettings = () => {
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery('(min-width:1000px)');

  const [form, setForm] = useState({
    username: '',
    email: '',
    bio: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch user data (same style as ProfilePage)
  const getUser = async () => {
    setLoading(true);
    setServerError('');
    try {
      const response = await fetch(`http://localhost:3001/api/profile/${userId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        if (response.status === 401)
          throw new Error('Your session has expired. Please login again.');
        if (response.status === 403)
          throw new Error('You are not allowed to edit this profile.');
        throw new Error('Failed to load profile settings.');
      }

      const data = await response.json();

      setForm({
        username: data.username || '',
        email: data.email || '',
        bio: data.bio || '',
      });
    } catch (err) {
      setServerError(err.message);
    }finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, [userId]); // eslint-disable-line

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({});
    setSuccess('');
  };

  const validate = () => {
    const newErrors = {};

    if (!form.username) newErrors.username = 'Username is required';

    if (!form.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
setSuccess('');
    setServerError('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showWarning("Please fix validation errors.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`http://localhost:3001/api/profile/update/${userId}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        if (response.status === 401)
          throw new Error('Your session has expired. Please login again.');
        if (response.status === 403)
          throw new Error('You are not allowed to update this profile.');
        throw new Error('Profile update failed. Please try again.');
      }

      setSuccess('Your profile has been updated successfully.');
      showSuccess("Profile updated successfully!");
    } catch (err) {
      setServerError(err.message);
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Navbar />

      <Box
        width="100%"
        padding="2rem 6%"
        display="flex"
        justifyContent="center"
      >
        <Box
          width={isNonMobileScreens ? '40%' : '100%'}
          p="2rem"
          borderRadius="1rem"
          bgcolor="background.alt"
        >
          <Typography variant="h4" fontWeight="500" mb="1.5rem">
            Profile Settings
          </Typography>

          {loading && <CircularProgress />}

          {serverError && (
            <Typography color="error" mb="1rem">
              {serverError}
            </Typography>
          )}

          {success && (
            <Typography color="success.main" mb="1rem">
              {success}
            </Typography>
          )}

          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap="1.5rem">
              <TextField
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                error={!!errors.username}
                helperText={errors.username}
              />

              <TextField
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />

              <TextField
                label="Bio"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                multiline
                rows={4}
              />

              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileSettings;
