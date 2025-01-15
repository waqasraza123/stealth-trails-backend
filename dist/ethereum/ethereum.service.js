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
exports.EthereumService = void 0;
const common_1 = require("@nestjs/common");
const ethers_1 = require("ethers");
const prisma_service_1 = require("../prisma/prisma.service");
let EthereumService = class EthereumService {
    constructor(prismaService) {
        this.prismaService = prismaService;
        this.stakingContractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
        this.stakingContractABI = [
            "event PoolCreated(uint256 poolId, uint256 rewardRate, uint256 externalPoolId)",
        ];
        this.provider = new ethers_1.ethers.providers.JsonRpcProvider('http://localhost:8545');
        this.stakingContract = new ethers_1.ethers.Contract(this.stakingContractAddress, this.stakingContractABI, this.provider);
    }
    onModuleInit() {
        this.listenToEvents();
    }
    listenToEvents() {
        this.stakingContract.on('PoolCreated', async (poolId, rewardRate, externalPoolId) => {
            console.log(`New pool created: ID=${poolId.toString()}, Reward Rate=${rewardRate.toString()}`);
            console.log(`External Pool ID: ${externalPoolId.toString()}`);
            try {
                await this.prismaService.stakingPool.update({
                    where: { id: externalPoolId.toNumber() },
                    data: {
                        blockchainPoolId: poolId.toNumber(),
                    },
                });
                console.log(`Database updated with blockchainPoolId: ${poolId.toString()}`);
            }
            catch (error) {
                console.error('Error updating the database:', error);
            }
        });
        console.log('Listening for PoolCreated events...');
    }
};
exports.EthereumService = EthereumService;
exports.EthereumService = EthereumService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EthereumService);
