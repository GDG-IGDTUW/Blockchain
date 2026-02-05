import { Box, Typography, useTheme } from "@mui/material";
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  const { palette } = useTheme();

  return (
    <Box
    sx={{
        maxWidth: "40rem",
        height: "100vh",
        m: "0 auto",
        p: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center"
      }}
    >
      <Box>
        <Typography variant="h1">
          <Typography
            variant="overline"
            sx={{
              display: "block",
              fontSize: "1.6rem",
              fontWeight: "500",
              textTransform: "uppercase",
              lineHeight: "1.5",
              color: palette.primary.main
            }}
          >
            OOPS!
          </Typography>
          <Typography
            variant="overline"
            sx={{
              display: "block",
              mt: "0.5rem",
              fontSize: "1.2rem",
              textTransform: "uppercase",
              lineHeight: "1.5",
              color: palette.grey[500]
            }}
          >
            page not found
          </Typography>
        </Typography>
        <Box
          sx={{mt: '2rem'}}
        >
          <img
            style={{ width: "100%", objectFit: "cover" }}
            alt="OOPS! Page not found"
            src={`http://localhost:3000/404.svg`}
          />
        </Box>
        <Link
          to="/"
          style={{
            display: 'inline-block',
            marginTop: "2rem",
            padding: "1rem 1.5rem",
            borderRadius: "2rem",
            backgroundColor: palette.primary.main,
            color: palette.background.alt,
            textDecoration: 'none',
            fontSize: '0.75rem',
            fontWeight: '500',
            textTransform: 'uppercase'
          }}
        >Go home</Link>
      </Box>
    </Box>
  );
};

export default NotFoundPage;
