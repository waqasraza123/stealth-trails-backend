import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import "@nomicfoundation/hardhat-ignition";

const STAKING_TOKEN_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f"; //DAI

const StakingPoolModule = buildModule("StakingPool", (m) => {
  const stakingPool = m.contract("StakingPool", [STAKING_TOKEN_ADDRESS]);

  return { stakingPool };
});

export default StakingPoolModule;
