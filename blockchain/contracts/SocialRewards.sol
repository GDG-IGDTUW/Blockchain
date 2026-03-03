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

         // GAS HEAVY: SSTORE (Storage Write)
        // Setting a value from 0 to non-zero (initializing) costs 20,000 gas.
        // This is the most expensive operation in this transaction.   
        hasRegistered[user] = true;

        // GAS HEAVY: Multiple SSTOREs
        // We are updating two separate storage slots here.
        // 1. Read owner balance (SLOAD) -> Modify -> Write back (SSTORE)
        // 2. Read user balance (SLOAD) -> Modify -> Write back (SSTORE)

        balanceOf[owner] -= REGISTRATION_REWARD;
        balanceOf[user] += REGISTRATION_REWARD;
        
        emit Transfer(owner, user, REGISTRATION_REWARD);
        emit Registration(user, REGISTRATION_REWARD);
    }
    
    function recordPost(address user) external onlyOwner {
        require(hasRegistered[user], "User not registered");
        //Gas Heavy- increment in the storage (Read-Modify-Write Cycle)
        postCount[user]++;
        
        // Check if user has completed 10 posts since last reward
        uint256 postsForReward = postCount[user] - lastRewardedPostCount[user];
        
        if (postsForReward >= POSTS_REQUIRED) {
            uint256 rewardsEarned = postsForReward / POSTS_REQUIRED;
            uint256 rewardAmount = rewardsEarned * POST_REWARD;
            
            require(balanceOf[owner] >= rewardAmount, "Insufficient balance for reward");
            //Gas Heavy- storage update for balance triggers 2 more SSTORE operations.  
            balanceOf[owner] -= rewardAmount;
            balanceOf[user] += rewardAmount;

            // GAS HEAVY: Writing to a separate storage slot
            // `postCount` and `lastRewardedPostCount` are in different slots.
            // Writing to this separate slot incurs another SSTORE cost.

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
        owner = newOwner;
    }
}
