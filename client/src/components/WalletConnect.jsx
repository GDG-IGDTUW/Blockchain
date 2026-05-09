import { useState } from "react";
import { Button, Tooltip, Typography, Box } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useDispatch, useSelector } from "react-redux";
import { setWallet, clearWallet } from "state";
import { showSuccess, showError, showWarning , showInfo } from "../utils/toast";

const HELA_TESTNET_CHAIN_ID = "0xA2F08"; // 666888 in hex

const WalletConnect = () => {
  const dispatch = useDispatch();
  const walletAddress = useSelector((state) => state.walletAddress);
  const [networkWarning, setNetworkWarning] = useState(false);

  const shortenAddress = (address) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  const checkNetwork = async () => {
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    if (chainId !== HELA_TESTNET_CHAIN_ID) {
      setNetworkWarning(true);
      showWarning("Please switch to HeLa Testnet.");
    } else {
      setNetworkWarning(false);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      showError("MetaMask is not installed.");
      return;
    }
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      dispatch(setWallet({ walletAddress: accounts[0] }));
      showSuccess("Wallet connected successfully!");
      await checkNetwork();

      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length === 0) {
          dispatch(clearWallet());
          setNetworkWarning(false);
        } else {
          dispatch(setWallet({ walletAddress: accounts[0] }));
        }
      });

      window.ethereum.on("chainChanged", () => {
        checkNetwork();
      });
    } catch (err) {
      if (err.code === 4001) {
        // User rejected the request
        showInfo("Wallet connection cancelled.");
      } else {
        console.error(err);
      }
    }
  };

  const disconnectWallet = () => {
    dispatch(clearWallet());
    setNetworkWarning(false);
  };

  return (
    <Box display="flex" alignItems="center" gap="0.5rem">
      {networkWarning && (
        <Typography
          variant="caption"
          sx={{ color: "orange", fontWeight: "bold", whiteSpace: "nowrap" }}
        >
          ⚠ Switch to HeLa Testnet
        </Typography>
      )}
      {walletAddress ? (
        <Tooltip title="Click to disconnect wallet">
          <Button
            onClick={disconnectWallet}
            variant="outlined"
            size="small"
            startIcon={<AccountBalanceWalletIcon />}
            sx={{ textTransform: "none", whiteSpace: "nowrap" }}
          >
            {shortenAddress(walletAddress)}
          </Button>
        </Tooltip>
      ) : (
        <Button
          onClick={connectWallet}
          variant="contained"
          size="small"
          startIcon={<AccountBalanceWalletIcon />}
          sx={{ textTransform: "none", whiteSpace: "nowrap" }}
        >
          Connect Wallet
        </Button>
      )}
    </Box>
  );
};

export default WalletConnect;