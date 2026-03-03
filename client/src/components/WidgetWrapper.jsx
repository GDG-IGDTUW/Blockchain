import { Box } from '@mui/material';
import { styled } from '@mui/system';

const WidgetWrapper = styled(Box)(({ theme }) => ({
  padding: '1rem 1.25rem',
  backgroundColor: theme.palette.background.alt,
  borderRadius: '0.75rem',
  border: `1px solid ${theme.palette.neutral.light}`,
  boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
  transition: '0.2s',
}));

export default WidgetWrapper;
