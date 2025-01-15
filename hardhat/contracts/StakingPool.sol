// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract StakingPool {

    struct Pool {
        uint256 rewardRate;
        uint256 totalStaked;
        uint256 totalRewardsPaid;
    }

    struct Staker {
        uint256 amountStaked;
        uint256 rewardDebt;
        uint256 lastStakeTime;
    }

    IERC20 public stakingToken;
    mapping(uint256 => Pool) public pools;
    mapping(address => mapping(uint256 => Staker)) public stakers;

    uint256 public poolCount;

    address public owner;

    event PoolCreated(uint256 poolId, uint256 rewardRate, uint256 externalPoolId);
    event Deposited(address indexed user, uint256 poolId, uint256 amount);
    event Withdrawn(address indexed user, uint256 poolId, uint256 amount, uint256 reward);
    event RewardClaimed(address indexed user, uint256 poolId, uint256 reward);

    constructor(address _stakingToken) {
        stakingToken = IERC20(_stakingToken);
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    function createPool(uint256 _rewardRate, uint256 externalPoolId) external onlyOwner returns (uint256) {
        require(_rewardRate > 0, "Reward rate must be greater than 0");
        poolCount++;
        pools[poolCount] = Pool({
            rewardRate: _rewardRate,
            totalStaked: 0,
            totalRewardsPaid: 0
        });

        emit PoolCreated(poolCount, _rewardRate, externalPoolId);
        return poolCount;
    }

    function deposit(uint256 poolId, uint256 _amount) external {
        require(poolId > 0 && poolId <= poolCount, "Invalid pool ID");
        require(_amount > 0, "Amount must be greater than 0");

        Pool storage pool = pools[poolId];
        Staker storage staker = stakers[msg.sender][poolId];

        // Update reward debt before changing staked amount
        if (staker.amountStaked > 0) {
            uint256 pendingReward = calculateReward(msg.sender, poolId);
            staker.rewardDebt += pendingReward;
        }

        stakingToken.transferFrom(msg.sender, address(this), _amount);

        staker.amountStaked += _amount;
        staker.lastStakeTime = block.timestamp;
        pool.totalStaked += _amount;

        emit Deposited(msg.sender, poolId, _amount);
    }

    function withdraw(uint256 poolId, uint256 _amount) external {
        require(poolId > 0 && poolId <= poolCount, "Invalid pool ID");
        require(_amount > 0, "Amount must be greater than 0");

        Pool storage pool = pools[poolId];
        Staker storage staker = stakers[msg.sender][poolId];

        require(staker.amountStaked >= _amount, "Not enough staked balance");

        uint256 pendingReward = calculateReward(msg.sender, poolId);
        staker.rewardDebt += pendingReward;

        staker.amountStaked -= _amount;
        pool.totalStaked -= _amount;

        stakingToken.transfer(msg.sender, _amount);
        uint256 totalReward = pendingReward + staker.rewardDebt;
        if (totalReward > 0) {
            stakingToken.transfer(msg.sender, totalReward);
            staker.rewardDebt = 0;
        }

        emit Withdrawn(msg.sender, poolId, _amount, totalReward);
    }

    function claimReward(uint256 poolId) external {
        require(poolId > 0 && poolId <= poolCount, "Invalid pool ID");

        Staker storage staker = stakers[msg.sender][poolId];

        uint256 pendingReward = calculateReward(msg.sender, poolId);
        staker.rewardDebt += pendingReward;

        if (staker.rewardDebt > 0) {
            uint256 rewardToClaim = staker.rewardDebt;
            staker.rewardDebt = 0;

            stakingToken.transfer(msg.sender, rewardToClaim);
            emit RewardClaimed(msg.sender, poolId, rewardToClaim);
        }
    }

    function calculateReward(address _user, uint256 poolId) internal view returns (uint256) {
        Staker storage staker = stakers[_user][poolId];
        uint256 timeStaked = block.timestamp - staker.lastStakeTime;

        uint256 reward = (staker.amountStaked * pools[poolId].rewardRate * timeStaked) / (365 days * 100);
        return reward;
    }

    function emergencyWithdraw(uint256 poolId) external {
        require(poolId > 0 && poolId <= poolCount, "Invalid pool ID");

        Staker storage staker = stakers[msg.sender][poolId];
        uint256 amountStaked = staker.amountStaked;
        staker.amountStaked = 0;
        staker.rewardDebt = 0; // Reset the reward debt

        Pool storage pool = pools[poolId];
        pool.totalStaked -= amountStaked;

        stakingToken.transfer(msg.sender, amountStaked);

        emit Withdrawn(msg.sender, poolId, amountStaked, 0);
    }

    function getStakedBalance(address _user, uint256 poolId) external view returns (uint256) {
        return stakers[_user][poolId].amountStaked;
    }

    function getPendingReward(address _user, uint256 poolId) external view returns (uint256) {
        return calculateReward(_user, poolId);
    }

    function getTotalStaked(uint256 poolId) external view returns (uint256) {
        return pools[poolId].totalStaked;
    }
}
