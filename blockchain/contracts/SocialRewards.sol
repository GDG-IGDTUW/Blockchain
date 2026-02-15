// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract SocialRewards {
    string public name = "Hela Social Token";
    string public symbol = "HST";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    
    address public owner;
    uint256 public constant REGISTRATION_REWARD = 1 * 10**18; // 1 token
    uint256 public constant POST_REWARD = 1 * 10**18; // 1 token per 10 posts
    uint256 public constant POSTS_REQUIRED = 10;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => bool) public hasRegistered;
    mapping(address => uint256) public postCount;
    mapping(address => uint256) public lastRewardedPostCount;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Registration(address indexed user, uint256 reward);
    event PostReward(address indexed user, uint256 posts, uint256 reward);
    event PostCreated(address indexed user, uint256 postCount, uint256 timestamp);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner, uint256 timestamp);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        // Mint initial supply to owner for distribution
        totalSupply = 1000000 * 10**18; // 1 million tokens
        balanceOf[owner] = totalSupply;
    }
    
    function registerUser(address user) external onlyOwner {
        require(!hasRegistered[user], "User already registered");
        require(balanceOf[owner] >= REGISTRATION_REWARD, "Insufficient balance for reward");
        
        hasRegistered[user] = true;
        balanceOf[owner] -= REGISTRATION_REWARD;
        balanceOf[user] += REGISTRATION_REWARD;
        
        emit Transfer(owner, user, REGISTRATION_REWARD);
        emit Registration(user, REGISTRATION_REWARD);
    }
    
    function recordPost(address user) external onlyOwner {
        require(hasRegistered[user], "User not registered");
        
        postCount[user]++;
        
        // Emit PostCreated event for every post
        emit PostCreated(user, postCount[user], block.timestamp);
        
        // Check if user has completed 10 posts since last reward
        uint256 postsForReward = postCount[user] - lastRewardedPostCount[user];
        
        if (postsForReward >= POSTS_REQUIRED) {
            uint256 rewardsEarned = postsForReward / POSTS_REQUIRED;
            uint256 rewardAmount = rewardsEarned * POST_REWARD;
            
            require(balanceOf[owner] >= rewardAmount, "Insufficient balance for reward");
            
            balanceOf[owner] -= rewardAmount;
            balanceOf[user] += rewardAmount;
            
            lastRewardedPostCount[user] = postCount[user] - (postsForReward % POSTS_REQUIRED);
            
            emit Transfer(owner, user, rewardAmount);
            emit PostReward(user, postCount[user], rewardAmount);
        }
    }
    
    function transfer(address to, uint256 value) external returns (bool) {
        require(balanceOf[msg.sender] >= value, "Insufficient balance");
        require(to != address(0), "Invalid address");
        
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        
        emit Transfer(msg.sender, to, value);
        return true;
    }
    
    function getUserStats(address user) external view returns (
        bool registered,
        uint256 balance,
        uint256 posts,
        uint256 postsUntilNextReward
    ) {
        registered = hasRegistered[user];
        balance = balanceOf[user];
        posts = postCount[user];
        uint256 postsSinceReward = posts - lastRewardedPostCount[user];
        postsUntilNextReward = postsSinceReward >= POSTS_REQUIRED ? 0 : POSTS_REQUIRED - postsSinceReward;
    }
    
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        address previousOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(previousOwner, newOwner, block.timestamp);
    }
}
