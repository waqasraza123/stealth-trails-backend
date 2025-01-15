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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StakingController = void 0;
const common_1 = require("@nestjs/common");
const staking_service_1 = require("./staking.service");
let StakingController = class StakingController {
    constructor(stakingService) {
        this.stakingService = stakingService;
    }
    async createPool(body) {
        return this.stakingService.createPool(body.rewardRate);
    }
    async deposit(body) {
        return this.stakingService.deposit(body.poolId, body.amount);
    }
    async withdraw(body) {
        return this.stakingService.withdraw(body.poolId, body.amount);
    }
    async claimReward(body) {
        return this.stakingService.claimReward(body.poolId);
    }
    async emergencyWithdraw(body) {
        return this.stakingService.emergencyWithdraw(body.poolId);
    }
    async getStakedBalance(address, poolId) {
        return this.stakingService.getStakedBalance(address, poolId);
    }
    async getPendingReward(address, poolId) {
        return this.stakingService.getPendingReward(address, poolId);
    }
    async getTotalStaked(poolId) {
        return this.stakingService.getTotalStaked(poolId);
    }
};
exports.StakingController = StakingController;
__decorate([
    (0, common_1.Post)('create-pool'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StakingController.prototype, "createPool", null);
__decorate([
    (0, common_1.Post)('deposit'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StakingController.prototype, "deposit", null);
__decorate([
    (0, common_1.Post)('withdraw'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StakingController.prototype, "withdraw", null);
__decorate([
    (0, common_1.Post)('claim-reward'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StakingController.prototype, "claimReward", null);
__decorate([
    (0, common_1.Post)('emergency-withdraw'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StakingController.prototype, "emergencyWithdraw", null);
__decorate([
    (0, common_1.Get)('staked-balance/:address/:poolId'),
    __param(0, (0, common_1.Param)('address')),
    __param(1, (0, common_1.Param)('poolId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], StakingController.prototype, "getStakedBalance", null);
__decorate([
    (0, common_1.Get)('pending-reward/:address/:poolId'),
    __param(0, (0, common_1.Param)('address')),
    __param(1, (0, common_1.Param)('poolId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], StakingController.prototype, "getPendingReward", null);
__decorate([
    (0, common_1.Get)('total-staked/:poolId'),
    __param(0, (0, common_1.Param)('poolId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StakingController.prototype, "getTotalStaked", null);
exports.StakingController = StakingController = __decorate([
    (0, common_1.Controller)('staking'),
    __metadata("design:paramtypes", [staking_service_1.StakingService])
], StakingController);
