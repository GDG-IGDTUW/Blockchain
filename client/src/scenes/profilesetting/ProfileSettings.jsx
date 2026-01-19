import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";

const ProfileSettings = () => {
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const [form, setForm] = useState({
    username: "",
    email: "",
    bio: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch user data (same style as ProfilePage)
  const getUser = async () => {
    const response = await fetch(
      `http://localhost:3001/users/${userId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();

    setForm({
      username: data.username || "",
      email: data.email || "",
      bio: data.bio || "",
    });
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.username) newErrors.username = "Username is required";

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      await fetch(
        `http://localhost:3001/users/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
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
          width={isNonMobileScreens ? "40%" : "100%"}
          p="2rem"
          borderRadius="1rem"
          bgcolor="background.alt"
        >
          <Typography
            variant="h4"
            fontWeight="500"
            mb="1.5rem"
          >
            Profile Settings
          </Typography>

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

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>

            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileSettings;