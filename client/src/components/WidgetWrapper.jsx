import { Box } from "@mui/material";
import { styled } from "@mui/system";

const WidgetWrapper = styled(Box)(({ theme }) => ({
  padding: "1.5rem 1.5rem 0.75rem 1.5rem",
  backgroundColor: theme.palette.background.alt,
  borderRadius: "0.75rem",
  border: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
  boxShadow: theme.palette.mode === "dark"
    ? "0 2px 8px rgba(0,0,0,0.4)"
    : "0 2px 8px rgba(0,0,0,0.06)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.palette.mode === "dark"
      ? "0 6px 20px rgba(0,0,0,0.6)"
      : "0 6px 20px rgba(0,0,0,0.12)",
  },
  "@media (max-width: 1000px)": {
    padding: "1rem 1rem 0.5rem 1rem",
  },
}));

export default WidgetWrapper;