import { Box, Typography, Tooltip, IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const shortenAddress = (address) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const ShortWallet = ({ address }) => {
  if (!address) return null;

  const copyAddress = async () => {
    await navigator.clipboard.writeText(address);
  };

  return (
    <Box display="flex" alignItems="center" gap="0.4rem">
      <Typography fontSize="0.85rem" color="gray">
        {shortenAddress(address)}
      </Typography>

      <Tooltip title="Copy wallet address">
        <IconButton size="small" onClick={copyAddress}>
          <ContentCopyIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ShortWallet;
