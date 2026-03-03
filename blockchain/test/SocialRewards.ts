import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { network } from "hardhat";

describe("SocialRewards", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();
  const [owner, user1, user2] = await viem.getWalletClients();

  describe("Deployment", async function () {
    it("Should set the right owner", async function () {
      const socialRewards = await viem.deployContract("SocialRewards");
      
      const contractOwner = await socialRewards.read.owner();
      assert.equal(contractOwner.toLowerCase(), owner.account.address.toLowerCase());
    });

    it("Should have correct initial supply", async function () {
      const socialRewards = await viem.deployContract("SocialRewards");
      
      const totalSupply = await socialRewards.read.totalSupply();
      assert.equal(totalSupply, 1000000n * 10n ** 18n);
    });
  });

  describe("Registration", async function () {
    it("Should reward user on registration", async function () {
      const socialRewards = await viem.deployContract("SocialRewards");
      
      await socialRewards.write.registerUser([user1.account.address]);
      
      const balance = await socialRewards.read.balanceOf([user1.account.address]);
      assert.equal(balance, 1n * 10n ** 18n); // 1 token
      
      const hasRegistered = await socialRewards.read.hasRegistered([user1.account.address]);
      assert.equal(hasRegistered, true);
    });

    it("Should not allow double registration", async function () {
      const socialRewards = await viem.deployContract("SocialRewards");
      
      await socialRewards.write.registerUser([user1.account.address]);
      
      await assert.rejects(
        async () => await socialRewards.write.registerUser([user1.account.address]),
        /User already registered/
      );
    });
  });

  describe("Post Rewards", async function () {
    it("Should reward user after 10 posts", async function () {
      const socialRewards = await viem.deployContract("SocialRewards");
      
      await socialRewards.write.registerUser([user1.account.address]);
      
      // Record 10 posts
      for (let i = 0; i < 10; i++) {
        await socialRewards.write.recordPost([user1.account.address]);
      }
      
      const balance = await socialRewards.read.balanceOf([user1.account.address]);
      assert.equal(balance, 2n * 10n ** 18n); // 1 from registration + 1 from 10 posts
      
      const postCount = await socialRewards.read.postCount([user1.account.address]);
      assert.equal(postCount, 10n);
    });

    it("Should track posts correctly and reward multiple times", async function () {
      const socialRewards = await viem.deployContract("SocialRewards");
      
      await socialRewards.write.registerUser([user1.account.address]);
      
      // Record 25 posts (should get 2 rewards)
      for (let i = 0; i < 25; i++) {
        await socialRewards.write.recordPost([user1.account.address]);
      }
      
      const balance = await socialRewards.read.balanceOf([user1.account.address]);
      assert.equal(balance, 3n * 10n ** 18n); // 1 from registration + 2 from 20 posts
      
      const stats = await socialRewards.read.getUserStats([user1.account.address]);
      assert.equal(stats[2], 25n); // posts
      assert.equal(stats[3], 5n); // postsUntilNextReward
    });

    it("Should not reward unregistered users", async function () {
      const socialRewards = await viem.deployContract("SocialRewards");
      
      await assert.rejects(
        async () => await socialRewards.write.recordPost([user1.account.address]),
        /User not registered/
      );
    });
  });

  describe("Token Transfer", async function () {
    it("Should allow users to transfer tokens", async function () {
      const socialRewards = await viem.deployContract("SocialRewards");
      
      await socialRewards.write.registerUser([user1.account.address]);
      
      const transferAmount = 5n * 10n ** 17n; // 0.5 tokens
      await socialRewards.write.transfer([user2.account.address, transferAmount], {
        account: user1.account,
      });
      
      const user1Balance = await socialRewards.read.balanceOf([user1.account.address]);
      const user2Balance = await socialRewards.read.balanceOf([user2.account.address]);
      
      assert.equal(user1Balance, 5n * 10n ** 17n); // 0.5 tokens remaining
      assert.equal(user2Balance, 5n * 10n ** 17n); // 0.5 tokens received
    });
  });

  describe("User Stats", async function () {
    it("Should return correct user stats", async function () {
      const socialRewards = await viem.deployContract("SocialRewards");
      
      await socialRewards.write.registerUser([user1.account.address]);
      
      for (let i = 0; i < 7; i++) {
        await socialRewards.write.recordPost([user1.account.address]);
      }
      
      const stats = await socialRewards.read.getUserStats([user1.account.address]);
      
      assert.equal(stats[0], true); // registered
      assert.equal(stats[1], 1n * 10n ** 18n); // balance (only registration reward)
      assert.equal(stats[2], 7n); // posts
      assert.equal(stats[3], 3n); // postsUntilNextReward
    });
  });

  describe("Token Metadata", async function () {
    it("Should have correct name, symbol and decimals", async function () {
      const socialRewards = await viem.deployContract("SocialRewards");

      const name = await socialRewards.read.name();
      const symbol = await socialRewards.read.symbol();
      const decimals = await socialRewards.read.decimals();

      assert.equal(name, "Hela Social Token");
      assert.equal(symbol, "HST");
      assert.equal(decimals, 18);
    });

    it("Should assign entire initial supply to owner", async function () {
      const socialRewards = await viem.deployContract("SocialRewards");

      const ownerBalance = await socialRewards.read.balanceOf([owner.account.address]);
      const totalSupply = await socialRewards.read.totalSupply();

      assert.equal(ownerBalance, totalSupply);
    });
  });

  describe("Access Control", async function () {
    it("Should not allow non-owner to register a user", async function () {
      const socialRewards = await viem.deployContract("SocialRewards");

      await assert.rejects(
        async () =>
          await socialRewards.write.registerUser([user2.account.address], {
            account: user1.account,
          }),
        /Not authorized/
      );
    });

    it("Should not allow non-owner to record a post", async function () {
      const socialRewards = await viem.deployContract("SocialRewards");

      await socialRewards.write.registerUser([user1.account.address]);

      await assert.rejects(
        async () =>
          await socialRewards.write.recordPost([user1.account.address], {
            account: user1.account,
          }),
        /Not authorized/
      );
    });
  });

  describe("Transfer Edge Cases", async function () {
    it("Should fail transfer when balance is insufficient", async function () {
      const socialRewards = await viem.deployContract("SocialRewards");

      await socialRewards.write.registerUser([user1.account.address]);

      const tooMuch = 2n * 10n ** 18n; // user only has 1 token
      await assert.rejects(
        async () =>
          await socialRewards.write.transfer([user2.account.address, tooMuch], {
            account: user1.account,
          }),
        /Insufficient balance/
      );
    });

    it("Should fail transfer to zero address", async function () {
      const socialRewards = await viem.deployContract("SocialRewards");

      await socialRewards.write.registerUser([user1.account.address]);

      await assert.rejects(
        async () =>
          await socialRewards.write.transfer(
            ["0x0000000000000000000000000000000000000000", 1n],
            { account: user1.account }
          ),
        /Invalid address/
      );
    });
  });

  describe("Transfer Ownership", async function () {
    it("Should transfer ownership to a new owner", async function () {
      const socialRewards = await viem.deployContract("SocialRewards");

      await socialRewards.write.transferOwnership([user1.account.address]);

      const newOwner = await socialRewards.read.owner();
      assert.equal(newOwner.toLowerCase(), user1.account.address.toLowerCase());
    });

    it("Should not allow non-owner to transfer ownership", async function () {
      const socialRewards = await viem.deployContract("SocialRewards");

      await assert.rejects(
        async () =>
          await socialRewards.write.transferOwnership([user2.account.address], {
            account: user1.account,
          }),
        /Not authorized/
      );
    });

    it("Should not allow ownership transfer to zero address", async function () {
      const socialRewards = await viem.deployContract("SocialRewards");

      await assert.rejects(
        async () =>
          await socialRewards.write.transferOwnership([
            "0x0000000000000000000000000000000000000000",
          ]),
        /Invalid address/
      );
    });
  });

  describe("Reward Boundary Conditions", async function () {
    it("Should not reward user at 9 posts", async function () {
      const socialRewards = await viem.deployContract("SocialRewards");

      await socialRewards.write.registerUser([user1.account.address]);

      for (let i = 0; i < 9; i++) {
        await socialRewards.write.recordPost([user1.account.address]);
      }

      const balance = await socialRewards.read.balanceOf([user1.account.address]);
      assert.equal(balance, 1n * 10n ** 18n); // only registration reward

      const stats = await socialRewards.read.getUserStats([user1.account.address]);
      assert.equal(stats[3], 1n); // 1 post until next reward
    });

    it("Should reward exactly at 10 posts and reset counter correctly", async function () {
      const socialRewards = await viem.deployContract("SocialRewards");

      await socialRewards.write.registerUser([user1.account.address]);

      for (let i = 0; i < 10; i++) {
        await socialRewards.write.recordPost([user1.account.address]);
      }

      const balance = await socialRewards.read.balanceOf([user1.account.address]);
      assert.equal(balance, 2n * 10n ** 18n); // registration + 1 post reward

      const stats = await socialRewards.read.getUserStats([user1.account.address]);
      assert.equal(stats[3], 10n); // counter reset: 10 posts until next reward
    });

    it("Should reduce owner balance by reward amount on registration", async function () {
      const socialRewards = await viem.deployContract("SocialRewards");

      const ownerBefore = await socialRewards.read.balanceOf([owner.account.address]);
      await socialRewards.write.registerUser([user1.account.address]);
      const ownerAfter = await socialRewards.read.balanceOf([owner.account.address]);

      assert.equal(ownerBefore - ownerAfter, 1n * 10n ** 18n);
    });

    it("Should reduce owner balance by reward amount after 10 posts", async function () {
      const socialRewards = await viem.deployContract("SocialRewards");

      await socialRewards.write.registerUser([user1.account.address]);
      const ownerAfterReg = await socialRewards.read.balanceOf([owner.account.address]);

      for (let i = 0; i < 10; i++) {
        await socialRewards.write.recordPost([user1.account.address]);
      }
      const ownerAfterReward = await socialRewards.read.balanceOf([owner.account.address]);

      assert.equal(ownerAfterReg - ownerAfterReward, 1n * 10n ** 18n);
    });
  });
});