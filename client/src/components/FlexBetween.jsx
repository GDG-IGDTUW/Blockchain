import { Box } from '@mui/material';
import { styled } from '@mui/system';

const FlexBetween = styled(Box)(({ gap, wrap }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: gap || '0.5rem',
  flexWrap: wrap || 'nowrap',
}));

export default FlexBetween;
