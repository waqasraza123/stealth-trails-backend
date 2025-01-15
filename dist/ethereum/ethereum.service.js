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
let EthereumService = class EthereumService {
    constructor() {
        this.stakingContractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
        this.stakingContractABI = [
            "event PoolCreated(uint256 poolId, uint256 rewardRate)",
        ];
        this.provider = new ethers_1.ethers.providers.JsonRpcProvider('http://localhost:8545');
        this.stakingContract = new ethers_1.ethers.Contract(this.stakingContractAddress, this.stakingContractABI, this.provider);
    }
    onModuleInit() {
        this.listenToEvents();
    }
    listenToEvents() {
        this.stakingContract.on('PoolCreated', (poolId, rewardRate, event) => {
            console.log(`New pool created: ID=${poolId.toString()}, Reward Rate=${rewardRate.toString()}`);
            console.log('Event Details:', event);
        });
        console.log('Listening for PoolCreated events...');
    }
};
exports.EthereumService = EthereumService;
exports.EthereumService = EthereumService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EthereumService);
