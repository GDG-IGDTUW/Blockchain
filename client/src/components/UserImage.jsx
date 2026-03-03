import { Box } from '@mui/material';

const UserImage = ({ image, size = '60px' }) => {
  return (
    <Box sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        border: '2px solid rgba(0,0,0,0.05)',
        backgroundColor: '#f1f5f9',
        flexShrink: 0,
      }}>
      <img
        width="100%"
        height="100%"
        style={{
          objectFit: 'cover',
          borderRadius: '50%',
          display: 'block',
        }}
        alt="user"
        src={`http://localhost:3001/assets/${image}`}
      />
    </Box>
  );
};

export default UserImage;
