import { Box } from '@mui/material';
import { styled } from '@mui/system';

const WidgetWrapper = styled(Box)(({ theme }) => ({
  padding: '1.25rem',
  backgroundColor: theme.palette.background.alt,

  borderRadius: '1rem',

  border: `1px solid ${theme.palette.neutral.light}`,

  boxShadow:
    '0 2px 6px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.06)',

  transition:
    'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',

  willChange: 'transform',

  '&:hover': {
    transform: 'translateY(-4px)',

    borderColor: 'rgba(37, 99, 235, 0.15)',

    boxShadow:
      '0 12px 28px rgba(15, 23, 42, 0.08), 0 4px 10px rgba(15, 23, 42, 0.05)',
  },

  [theme.breakpoints.down('sm')]: {
    padding: '1rem',
    borderRadius: '0.875rem',
  },
}));

export default WidgetWrapper;