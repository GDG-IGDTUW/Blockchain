import { useState } from "react";

import { ethers } from "ethers";
import Loader from "components/Loader";

import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import WalletConnect from "components/WalletConnect";
import {
  showSuccess,
  showError,
  showWarning,
  showInfo,
} from "../../utils/toast";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);

  // --- SEARCH STATES ---
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState("");
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery('(min-width: 1000px)');

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  const fullName = user ? `${user.firstName} ${user.lastName}` : 'User';

  // --- FINAL SEARCH FUNCTION ---
  const handleSearch = async (query) => {
    setSearchQuery(query);
    setSearchError('');

    // If input is empty, clear results and return
    if (!query || query.trim() === '') {
      setSearchResults([]);
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/search/all?q=${query}`);
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Please login to search users and posts.');
        }
        if (res.status === 404) {
          throw new Error('No results found.');
        }
        if (res.status >= 500) {
          throw new Error('Search service is unavailable. Try again later.');
        }
        throw new Error('Failed to fetch search results.');
      }

      if (data.users.length === 0 && data.posts.length === 0) {
        setSearchResults([]);
        setSearchError('No users or posts found.');
        showInfo("No users or posts found.");
        return;
      }
      setSearchResults([
        ...data.users.map((u) => ({ ...u, type: 'user' })),
        ...data.posts.map((p) => ({ ...p, type: 'post' })),
      ]);
    } catch (err) {
      showError(err.message);
    }
  };

  const connectWallet = async () => {
  try {
    setWalletLoading(true);

    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setWalletAddress(accounts[0]);
      showSuccess("Wallet connected successfully!");
    } else {
      setSearchError("MetaMask not detected");
      showError("MetaMask not detected.");
    }
  } catch (error) {
    console.error(error);
    setSearchError("Wallet connection failed");
    showError("Wallet connection failed.");
  } finally {
    setWalletLoading(false);
  }
};

  return (
    <FlexBetween padding="1rem 6%" backgroundColor={alt} position="relative">
      <FlexBetween gap="1.75rem">
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color="primary"
          onClick={() => navigate('/home')}
          sx={{
            '&:hover': {
              color: primaryLight,
              cursor: 'pointer',
            },
          }}
        >
          Sociopedia
        </Typography>

        {/* --- SEARCH BAR SECTION --- */}
        {isNonMobileScreens && (
          <Box position="relative">
            <FlexBetween
              backgroundColor={neutralLight}
              borderRadius="999px"
              gap="1rem"
              padding="0.35rem 1rem"
              minWidth="300px"
              boxShadow="inset 0 0 0 1px rgba(0,0,0,0.06)"
            >
              <InputBase
                placeholder="Search users or posts..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                sx={{
                  flex: 1,
                  fontSize: '0.9rem',
                }}
              />
              <IconButton onClick={() => handleSearch(searchQuery)}>
                <Search />
              </IconButton>
            </FlexBetween>

            {searchError && (
              <Typography
                color="error"
                fontSize="0.8rem"
                mt="0.25rem"
                ml="0.5rem"
              >
                {searchError}
              </Typography>
            )}

            {/* --- SEARCH RESULTS DROPDOWN --- */}
            {searchResults.length > 0 && (
              <Box
                position="absolute"
                top="110%"
                left="0"
                zIndex="20"
                width="100%"
                backgroundColor={alt}
                borderRadius="12px"
                boxShadow="0 12px 32px rgba(0,0,0,0.12)"
                maxHeight="300px"
                overflow="auto"
                border={`1px solid ${neutralLight}`}
              >
                <List dense>
                  {searchResults.map((item) => (
                    <ListItem
                      key={item._id}
                      button
                      sx={{
                        borderRadius: '8px',
                        mx: '0.5rem',
                        my: '0.25rem',
                        '&:hover': {
                          backgroundColor: neutralLight,
                        },
                      }}
                      onClick={() => {
                        navigate(
                          item.type === 'user'
                            ? `/profile/${item._id}`
                            : `/post/${item._id}`
                        );
                        setSearchResults([]);
                        setSearchQuery('');
                      }}
                    >
                      <ListItemText
                        primary={
                          item.type === 'user'
                            ? `${item.firstName} ${item.lastName}`
                            : item.description
                        }
                        secondary={item.type === 'user' ? 'User' : 'Post'}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        )}
      </FlexBetween>

      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          {walletLoading ? (
  <Loader />
) : (
  <Typography
    onClick={!walletLoading ? connectWallet : undefined}
    sx={{
      cursor: "pointer",
      color: "primary.main",
      fontWeight: 500,
      "&:hover": { opacity: 0.8 },
    }}
  >
    {walletAddress
      ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
      : "Connect Wallet"}
  </Typography>
)}

          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === 'dark' ? (
              <DarkMode sx={{ fontSize: '25px' }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: '25px' }} />
            )}
          </IconButton>
          <Message sx={{ fontSize: "25px" }} />
          <Notifications sx={{ fontSize: "25px" }} />
          <Help sx={{ fontSize: "25px" }} />
          <WalletConnect />
          <FormControl variant="standard" value={fullName}>
            <Select
              value={fullName}
              sx={{
                backgroundColor: neutralLight,
                width: '150px',
                borderRadius: '0.25rem',
                p: '0.25rem 1rem',
                '& .MuiSvgIcon-root': {
                  pr: '0.25rem',
                  width: '3rem',
                },
                '& .MuiSelect-select:focus': {
                  backgroundColor: neutralLight,
                },
              }}
              input={<InputBase />}
            >
              <MenuItem value={fullName}>
                <Typography>{fullName}</Typography>
              </MenuItem>
              <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
            </Select>
          </FormControl>
        </FlexBetween>
      ) : (
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          <Menu />
        </IconButton>
      )}

      {/* MOBILE NAV MENU */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={background}
        >
          {/* CLOSE ICON */}
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close />
            </IconButton>
          </Box>

          {/* MENU ITEMS */}
          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="3rem"
          >
            {walletLoading ? (
  <Loader />
) : (
  <Typography
    onClick={!walletLoading ? connectWallet : undefined}
    sx={{
      cursor: "pointer",
      color: "primary.main",
      fontWeight: 500,
    }}
  >
    {walletAddress
      ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
      : "Connect Wallet"}
  </Typography>
)}

            <IconButton
              onClick={() => dispatch(setMode())}
              sx={{ fontSize: '25px' }}
            >
              {theme.palette.mode === 'dark' ? (
                <DarkMode sx={{ fontSize: '25px' }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: '25px' }} />
              )}
            </IconButton>
            <Message sx={{ fontSize: "25px" }} />
            <Notifications sx={{ fontSize: "25px" }} />
            <Help sx={{ fontSize: "25px" }} />
            <WalletConnect />
            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: '150px',
                  borderRadius: '0.25rem',
                  p: '0.25rem 1rem',
                  '& .MuiSvgIcon-root': {
                    pr: '0.25rem',
                    width: '3rem',
                  },
                  '& .MuiSelect-select:focus': {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>
                  Log Out
                </MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;