
import { ethers } from 'ethers';

export function generateEthereumAddress(): {address: string, privateKey: string} {
  const wallet = ethers.Wallet.createRandom();
  return {address: wallet.address, privateKey: wallet.privateKey};
}
