"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepositService = void 0;
const common_1 = require("@nestjs/common");
const ethers_1 = require("ethers");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
let DepositService = class DepositService {
    constructor() {
        this.rpcUrl = process.env.RPC_URL;
        this.privateKey = process.env.ETHEREUM_PRIVATE_KEY;
    }
    async create(createDepositDto) {
        const { asset, amount, address } = createDepositDto;
        try {
            await this.depositToBlockchain(asset, amount, address);
            console.log(`Depositing ${amount} ${asset} to address: ${address}`);
            return {
                status: 'success',
                message: `Deposit of ${amount} ${asset} to address ${address} successful!`,
                data: { amount, asset, address },
            };
        }
        catch (error) {
            console.error('Blockchain interaction error:', error);
            return {
                status: 'failed',
                message: 'Deposit failed due to an error.',
                error: error instanceof Error ? { message: error.message } : {},
            };
        }
    }
    async depositToBlockchain(asset, amount, address) {
        try {
            const provider = new ethers_1.ethers.providers.JsonRpcProvider(this.rpcUrl);
            const wallet = new ethers_1.ethers.Wallet(this.privateKey, provider);
            if (asset === 'ethereum') {
                const transaction = {
                    to: address,
                    value: ethers_1.ethers.utils.parseEther(amount.toString()),
                };
                const txResponse = await wallet.sendTransaction(transaction);
                console.log(`Transaction Hash: ${txResponse.hash}`);
            }
            else if (asset === 'USD Coin (USDC)') {
                // For USDC or other ERC-20 tokens, you would call the appropriate smart contract function here
                console.log('Transferring USDC (ERC-20)');
            }
            else {
                console.log('Asset type not supported for deposit');
            }
        }
        catch (error) {
            console.error('Blockchain interaction error:', error);
            throw new Error('Deposit failed');
        }
    }
};
exports.DepositService = DepositService;
exports.DepositService = DepositService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DepositService);
