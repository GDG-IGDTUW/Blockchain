import jwt from "jsonwebtoken";
import { ethers } from "ethers";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ msg: "Authorization is required." });
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid or expired authorization token." });
  }
};

// New middleware for wallet signature verification
export const verifyWalletSignature = async (req, res, next) => {
  try {
    const { walletAddress, signature, message } = req.body;

    if (!walletAddress || !signature || !message) {
      return res.status(401).json({ 
        msg: "Wallet address, signature, and message are required for authentication." 
      });
    }

    // Verify the signature
    const recoveredAddress = ethers.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(401).json({ 
        msg: "Invalid wallet signature. Authentication failed." 
      });
    }

    // Attach wallet address to request for downstream use
    req.walletAddress = walletAddress;
    next();
  } catch (err) {
    res.status(401).json({ 
      msg: "Wallet signature verification failed.",
      error: err.message 
    });
  }
};