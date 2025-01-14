"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEthereumAddress = generateEthereumAddress;
const ethers_1 = require("ethers");
function generateEthereumAddress() {
    const wallet = ethers_1.ethers.Wallet.createRandom();
    return { address: wallet.address, privateKey: wallet.privateKey };
}
