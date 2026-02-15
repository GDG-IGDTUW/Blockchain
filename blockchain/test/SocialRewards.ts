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

    it("Should emit Registration event on user registration", async function () {
      const socialRewards = await viem.deployContract("SocialRewards");
      
      const hash = await socialRewards.write.registerUser([user1.account.address]);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      
      const registrationEvent = receipt.logs.find(
        (log) => log.topics[0] === socialRewards.getEvents.Registration().topics[0]
      );
      
      assert.ok(registrationEvent, "Registration event should be emitted");
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

    it("Should emit PostCreated event for every post", async function () {
      const socialRewards = await viem.deployContract("SocialRewards");
      
      await socialRewards.write.registerUser([user1.account.address]);
      
      const hash = await socialRewards.write.recordPost([user1.account.address]);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      
      const postCreatedEvent = receipt.logs.find(
        (log) => log.topics[0] === socialRewards.getEvents.PostCreated().topics[0]
      );
      
      assert.ok(postCreatedEvent, "PostCreated event should be emitted");
    });

    it("Should emit PostReward event when user earns reward", async function () {
      const socialRewards = await viem.deployContract("SocialRewards");
      
      await socialRewards.write.registerUser([user1.account.address]);
      
      // Record 9 posts (no reward yet)
      for (let i = 0; i < 9; i++) {
        await socialRewards.write.recordPost([user1.account.address]);
      }
      
      // 10th post should trigger reward
      const hash = await socialRewards.write.recordPost([user1.account.address]);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      
      const postRewardEvent = receipt.logs.find(
        (log) => log.topics[0] === socialRewards.getEvents.PostReward().topics[0]
      );
      
      assert.ok(postRewardEvent, "PostReward event should be emitted on 10th post");
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

  describe("Ownership Transfer", async function () {
    it("Should transfer ownership to new owner", async function () {
      const socialRewards = await viem.deployContract("SocialRewards");
      
      await socialRewards.write.transferOwnership([user1.account.address]);
      
      const newOwner = await socialRewards.read.owner();
      assert.equal(newOwner.toLowerCase(), user1.account.address.toLowerCase());
    });

    it("Should emit OwnershipTransferred event", async function () {
      const socialRewards = await viem.deployContract("SocialRewards");
      
      const hash = await socialRewards.write.transferOwnership([user1.account.address]);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      
      const ownershipEvent = receipt.logs.find(
        (log) => log.topics[0] === socialRewards.getEvents.OwnershipTransferred().topics[0]
      );
      
      assert.ok(ownershipEvent, "OwnershipTransferred event should be emitted");
    });

    it("Should not allow non-owner to transfer ownership", async function () {
      const socialRewards = await viem.deployContract("SocialRewards");
      
      await assert.rejects(
        async () => await socialRewards.write.transferOwnership([user2.account.address], {
          account: user1.account,
        }),
        /Not authorized/
      );
    });
  });
});