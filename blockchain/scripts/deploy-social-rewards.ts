import { network } from 'hardhat';

async function main() {
  console.log('Deploying SocialRewards contract to Hela Testnet...');

  const { viem } = await network.connect();
  const socialRewards = await viem.deployContract('SocialRewards');

  console.log(`SocialRewards deployed to: ${socialRewards.address}`);

  // Get initial contract info
  const name = await socialRewards.read.name();
  const symbol = await socialRewards.read.symbol();
  const totalSupply = await socialRewards.read.totalSupply();
  const owner = await socialRewards.read.owner();

  console.log('\nContract Details:');
  console.log(`Name: ${name}`);
  console.log(`Symbol: ${symbol}`);
  console.log(
    `Total Supply: ${totalSupply} (${Number(totalSupply) / 10 ** 18} tokens)`
  );
  console.log(`Owner: ${owner}`);

  console.log('\n✅ Deployment successful!');
  console.log(`\nContract Address: ${socialRewards.address}`);
  console.log(`Network: Hela Testnet (Chain ID: 666888)`);
  console.log(
    `Explorer: https://testnet-blockexplorer.helachain.com/address/${socialRewards.address}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
