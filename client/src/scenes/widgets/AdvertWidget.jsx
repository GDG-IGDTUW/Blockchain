import { Typography, useTheme } from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import WidgetWrapper from 'components/WidgetWrapper';

const AdvertWidget = () => {
  const { palette } = useTheme();
  const titleColor = palette.neutral.dark;
  const primaryTextColor = palette.neutral.main;
  const secondaryTextColor  = palette.neutral.medium;

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={titleColor} variant="h5" fontWeight="500">
          Sponsored
        </Typography>
        <Typography color={secondaryTextColor }>Create Ad</Typography>
      </FlexBetween>
      <img
        width="100%"
        height="auto"
        alt="advert"
        src="http://localhost:3001/assets/info4.jpeg"
        style={{ borderRadius: '0.75rem', margin: '0.75rem 0' }}
      />
      <FlexBetween>
        <Typography color={primaryTextColor}>MikaCosmetics</Typography>
        <Typography color={secondaryTextColor }>mikacosmetics.com</Typography>
      </FlexBetween>
      <Typography color={secondaryTextColor } m="0.5rem 0">
        Your pathway to stunning and immaculate beauty and made sure your skin
        is exfoliating skin and shining like light.
      </Typography>
    </WidgetWrapper>
  );
};

export default AdvertWidget;
