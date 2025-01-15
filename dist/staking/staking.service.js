"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StakingService = void 0;
const common_1 = require("@nestjs/common");
const ethers_1 = require("ethers");
const prisma_service_1 = require("../prisma/prisma.service");
let StakingService = class StakingService {
    constructor(prismaService) {
        this.prismaService = prismaService;
        this.provider = new ethers_1.ethers.providers.JsonRpcProvider('http://localhost:8545');
        const stakingContractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
        const stakingAbi = [
            "function createPool(uint256 _rewardRate, uint256 externalPoolId) external",
            "function deposit(uint256 poolId, uint256 _amount) external",
            "function withdraw(uint256 poolId, uint256 _amount) external",
            "function claimReward(uint256 poolId) external",
            "function emergencyWithdraw(uint256 poolId) external",
            "function getStakedBalance(address _user, uint256 poolId) external view returns (uint256)",
            "function getPendingReward(address _user, uint256 poolId) external view returns (uint256)",
            "function getTotalStaked(uint256 poolId) external view returns (uint256)"
        ];
        this.stakingContract = new ethers_1.ethers.Contract(stakingContractAddress, stakingAbi, this.provider.getSigner());
    }
    async createPool(rewardRate) {
        const stakingPool = await this.prismaService.stakingPool.create({
            data: {
                rewardRate: rewardRate,
                poolStatus: "paused",
            },
        });
        const tx = await this.stakingContract.createPool(rewardRate, stakingPool.id);
        return await tx.wait();
    }
    async deposit(poolId, amount) {
        const tx = await this.stakingContract.deposit(poolId, ethers_1.ethers.utils.parseUnits(amount, 18)); // Assumes ERC20 tokens with 18 decimals
        return await tx.wait();
    }
    async withdraw(poolId, amount) {
        const tx = await this.stakingContract.withdraw(poolId, ethers_1.ethers.utils.parseUnits(amount, 18));
        return await tx.wait();
    }
    async claimReward(poolId) {
        const tx = await this.stakingContract.claimReward(poolId);
        return await tx.wait();
    }
    async emergencyWithdraw(poolId) {
        const tx = await this.stakingContract.emergencyWithdraw(poolId);
        return await tx.wait();
    }
    async getStakedBalance(address, poolId) {
        return await this.stakingContract.getStakedBalance(address, poolId);
    }
    async getPendingReward(address, poolId) {
        return await this.stakingContract.getPendingReward(address, poolId);
    }
    async getTotalStaked(poolId) {
        return await this.stakingContract.getTotalStaked(poolId);
    }
};
exports.StakingService = StakingService;
exports.StakingService = StakingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StakingService);
