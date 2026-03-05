import { Box, Skeleton, Divider } from "@mui/material";
import WidgetWrapper from "./WidgetWrapper";
import FlexBetween from "./FlexBetween";

export const UserWidgetSkeleton = () => {
  return (
    <WidgetWrapper>
      <FlexBetween gap="0.5rem" pb="1.1rem">
        <FlexBetween gap="1rem">
          <Skeleton variant="circular" width={60} height={60} />
          <Box>
            <Skeleton variant="text" width={100} height={30} />
            <Skeleton variant="text" width={60} height={20} />
          </Box>
        </FlexBetween>
        <Skeleton variant="circular" width={24} height={24} />
      </FlexBetween>
      <Divider />
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="text" width={120} />
        </Box>
        <Box display="flex" alignItems="center" gap="1rem">
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="text" width={120} />
        </Box>
      </Box>
      <Divider />
      <Box p="1rem 0">
        <FlexBetween mb="0.5rem">
          <Skeleton variant="text" width={150} />
          <Skeleton variant="text" width={30} />
        </FlexBetween>
        <FlexBetween>
          <Skeleton variant="text" width={150} />
          <Skeleton variant="text" width={30} />
        </FlexBetween>
      </Box>
    </WidgetWrapper>
  );
};

export const PostSkeleton = () => {
  return (
    <WidgetWrapper m="2rem 0">
      <FlexBetween gap="1rem" mb="1rem">
        <FlexBetween gap="1rem">
          <Skeleton variant="circular" width={55} height={55} />
          <Box>
            <Skeleton variant="text" width={120} height={25} />
            <Skeleton variant="text" width={80} height={20} />
          </Box>
        </FlexBetween>
      </FlexBetween>
      <Skeleton variant="text" width="100%" height={20} />
      <Skeleton variant="text" width="100%" height={20} />
      <Skeleton variant="text" width="80%" height={20} />
      <Skeleton
        variant="rectangular"
        width="100%"
        height={300}
        sx={{ borderRadius: "0.75rem", mt: "0.75rem" }}
      />
      <FlexBetween mt="0.75rem">
        <FlexBetween gap="1rem">
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="circular" width={24} height={24} />
        </FlexBetween>
        <Skeleton variant="circular" width={24} height={24} />
      </FlexBetween>
    </WidgetWrapper>
  );
};

export const FriendListSkeleton = () => {
  return (
    <WidgetWrapper>
      <Skeleton variant="text" width={150} height={30} sx={{ mb: "1.5rem" }} />
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {[1, 2, 3].map((i) => (
          <FlexBetween key={i}>
            <FlexBetween gap="1rem">
              <Skeleton variant="circular" width={55} height={55} />
              <Box>
                <Skeleton variant="text" width={120} height={25} />
                <Skeleton variant="text" width={80} height={20} />
              </Box>
            </FlexBetween>
            <Skeleton variant="circular" width={34} height={34} />
          </FlexBetween>
        ))}
      </Box>
    </WidgetWrapper>
  );
};
