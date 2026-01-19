# CIRCLE - SocialFi Platform on HeLa Blockchain

CIRCLE is a next-generation SocialFi platform built on the EVM-compatible HeLa blockchain, designed to merge the familiarity of Web2 social media with the ownership, incentives, and transparency of Web3.

At its core, CIRCLE offers a full-fledged social experience: profiles, posts, engagement, discovery, and referrals, while enabling users to earn real value for meaningful participation. Instead of passive scrolling, every action on CIRCLE contributes to on-chain reputation and rewards.

The platform is powered by its native token, **$YAP**, which functions as both an incentive and utility layer within the ecosystem.

## 🎁 Reward System

CIRCLE incentivizes genuine user engagement through blockchain-based rewards:

- **Registration Reward**: New users receive **1 $YAP token** when they join the platform
- **Post Rewards**: Users earn **1 $YAP token** for every **10 posts** they create
- **On-Chain Tracking**: All rewards and user activity are transparently recorded on the HeLa blockchain
- **Wallet Integration**: Seamlessly connect with MetaMask to receive and manage your $YAP tokens

## 🏗️ Project Structure

```
├── blockchain/          # Smart contracts (Hardhat 3 + Solidity)
├── server/             # Backend API (Express.js + MongoDB)
├── client/             # Frontend (React.js)
└── README.md           # This file
```

## � Architecture

```text
       +--------+
       |  USER  |
       +----+---+
            |
            | 1. Social Action (Post/Like)
            v
   +--------+--------+                                +--------------+
   |    FRONTEND     + -- 4. Connect/Transfer (Tx) -> +   METAMASK   +
   | (Browser/Client)|                                |   (Wallet)   |
   +--------+--------+ <---- 5. Signs & Sends ------- +------+-------+
            |                                                |
            | 2. API Call                                    | 5. Broadcasts Tx
            v                                                v
   +--------+--------+        7. Emits Events         +------+-------+
   |     BACKEND     + <----------------------------- +  BLOCKCHAIN  +
   | owner_wallet    |                                |(Smart Contr.)|
   +--------+--------+ -----------------------------> +--------------+
            |              3. Distribute Rewards (recordPost)
            | 2. Write
            v
       +--------+
       |   DB   |
       +--------+
```

## �🚀 Getting Started

### Prerequisites

- Node.js (v20 or higher)
- MongoDB
- MetaMask wallet
- HeLa testnet tokens (for deployment)

### 1. Blockchain Setup

```bash
cd blockchain

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Add your private key to .env

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to HeLa Testnet
npx tsx scripts/deploy-with-ethers.ts
```

### 2. Server Setup

```bash
cd server

# Install dependencies
npm install --legacy-peer-deps

# Create .env file
cp .env.example .env
# Configure MongoDB URL, JWT secret, etc.

# Start server
npm start
```

### 3. Client Setup

```bash
cd client

# Install dependencies
npm install

# Create .env file (if needed)
# Configure API endpoint

# Start development server
npm start
```

## 🔗 Smart Contract Details

**Contract Name**: SocialRewards  
**Token Name**: Hela Social Token  
**Symbol**: HST (will be $YAP)  
**Network**: HeLa Testnet  
**Chain ID**: 666888

### Key Functions

- `registerUser(address)` - Register new user and award 1 token
- `recordPost(address)` - Track posts and award tokens every 10 posts
- `getUserStats(address)` - Get user's balance, posts, and progress
- `transfer(address, amount)` - Transfer tokens between users

## 📱 Features

### Web2 Features
- User profiles with avatars
- Create and share posts
- Like and comment on content
- Friend connections
- Real-time notifications
- Responsive design

### Web3 Features
- MetaMask wallet connection
- On-chain token rewards ($YAP)
- Transparent reward tracking
- Decentralized ownership
- Blockchain-verified engagement

## 🌐 Network Configuration

### HeLa Testnet
- **RPC URL**: https://testnet-rpc.helachain.com
- **Chain ID**: 666888
- **Currency**: HELA
- **Explorer**: https://testnet-blockexplorer.helachain.com

Add to MetaMask manually or visit the HeLa documentation for automatic setup.

## 🛠️ Tech Stack

**Blockchain**
- Solidity 0.8.28
- Hardhat 3
- Viem
- TypeScript

**Backend**
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Cloudinary (media storage)

**Frontend**
- React.js
- Material-UI
- Redux
- Formik & Yup

## 📝 Development Workflow

1. **Smart Contract Development**
   - Write contracts in `blockchain/contracts/`
   - Test with `npx hardhat test`
   - Deploy to testnet

2. **Backend Integration**
   - Update controllers to call smart contract
   - Use ethers.js or web3.js for blockchain interaction
   - Trigger `registerUser()` on user signup
   - Trigger `recordPost()` on post creation

3. **Frontend Integration**
   - Connect MetaMask wallet
   - Display user's $YAP balance
   - Show reward progress
   - Enable token transfers

## 🔐 Security Notes

- Never commit `.env` files
- Keep private keys secure
- Use environment variables for sensitive data
- Audit smart contracts before mainnet deployment

## 📄 License

ISC

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For issues and questions, please open an issue in the GitHub repository.

---

Built with ❤️ on HeLa Blockchain
