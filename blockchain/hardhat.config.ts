import hardhatToolboxViemPlugin from '@nomicfoundation/hardhat-toolbox-viem';
import { configVariable, defineConfig } from 'hardhat/config';
import { defineChain } from 'viem';
import dotenv from 'dotenv';

dotenv.config();

// Define Hela Testnet custom chain
const helaTestnet = defineChain({
  id: 666888,
  name: 'Hela Testnet',
  network: 'hela-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'HELA',
    symbol: 'HELA',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.helachain.com'],
    },
    public: {
      http: ['https://testnet-rpc.helachain.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Hela Explorer',
      url: 'https://testnet-blockexplorer.helachain.com',
    },
  },
  testnet: true,
});

export default defineConfig({
  plugins: [hardhatToolboxViemPlugin],
  viem: {
    chains: [helaTestnet],
  },
  solidity: {
    profiles: {
      default: {
        version: '0.8.28',
      },
      production: {
        version: '0.8.28',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: 'edr-simulated',
      chainType: 'l1',
    },
    hardhatOp: {
      type: 'edr-simulated',
      chainType: 'op',
    },
    sepolia: {
      type: 'http',
      chainType: 'l1',
      url: configVariable('SEPOLIA_RPC_URL'),
      accounts: [configVariable('SEPOLIA_PRIVATE_KEY')],
    },
    helaTestnet: {
      type: 'http',
      chainType: 'l1',
      url: 'https://testnet-rpc.helachain.com',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chain: helaTestnet,
    },
  },
});
