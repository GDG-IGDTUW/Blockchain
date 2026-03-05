import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log('Deploying SocialRewards contract to Hela Testnet...\n');

  // Load contract artifact
  const artifactPath = path.join(
    __dirname,
    '../artifacts/contracts/SocialRewards.sol/SocialRewards.json'
  );
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

  // Setup provider and wallet
  const provider = new ethers.JsonRpcProvider(
    'https://testnet-rpc.helachain.com'
  );
  const privateKey = process.env.PRIVATE_KEY || '';

  if (!privateKey) {
    throw new Error('PRIVATE_KEY environment variable not set');
  }

  const wallet = new ethers.Wallet(privateKey, provider);
  console.log(`Deploying from address: ${wallet.address}`);

  // Check balance
  const balance = await provider.getBalance(wallet.address);
  console.log(`Account balance: ${ethers.formatEther(balance)} HELA\n`);

  // Deploy contract
  const factory = new ethers.ContractFactory(
    artifact.abi,
    artifact.bytecode,
    wallet
  );
  console.log('Sending deployment transaction...');

  const contract = await factory.deploy();
  console.log(`Transaction hash: ${contract.deploymentTransaction()?.hash}`);

  console.log('Waiting for deployment confirmation...');
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log(`\n✅ SocialRewards deployed successfully!`);
  console.log(`Contract Address: ${contractAddress}`);

  // Get contract info
  const name = await contract.name();
  const symbol = await contract.symbol();
  const totalSupply = await contract.totalSupply();
  const owner = await contract.owner();

  console.log('\n📋 Contract Details:');
  console.log(`Name: ${name}`);
  console.log(`Symbol: ${symbol}`);
  console.log(`Total Supply: ${ethers.formatEther(totalSupply)} tokens`);
  console.log(`Owner: ${owner}`);

  console.log(`\n🔍 View on Explorer:`);
  console.log(
    `https://testnet-blockexplorer.helachain.com/address/${contractAddress}`
  );

  // Save deployment info
  const deploymentInfo = {
    network: 'Hela Testnet',
    chainId: 666888,
    contractAddress: contractAddress,
    deployer: wallet.address,
    timestamp: new Date().toISOString(),
    contractDetails: {
      name,
      symbol,
      totalSupply: totalSupply.toString(),
      owner,
    },
  };

  fs.writeFileSync(
    path.join(__dirname, '../deployment-info.json'),
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log('\n💾 Deployment info saved to deployment-info.json');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ Deployment failed:');
    console.error(error);
    process.exit(1);
  });
