import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const SocialRewardsModule = buildModule('SocialRewardsModule', (m) => {
  const socialRewards = m.contract('SocialRewards');

  return { socialRewards };
});

export default SocialRewardsModule;
