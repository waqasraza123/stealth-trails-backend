"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const modules_1 = require("@nomicfoundation/hardhat-ignition/modules");
require("@nomicfoundation/hardhat-ignition");
const ONE_GWEI = 1000000000n;
const DEFAULT_REWARD_RATE = 10;
const StakingPoolModule = (0, modules_1.buildModule)("StakingPool", (m) => {
    const rewardRate = m.getParameter("rewardRate", DEFAULT_REWARD_RATE);
    const stakingPool = m.contract("StakingPool", []);
    m.call(stakingPool, "createPool", [rewardRate]);
    return { stakingPool };
});
exports.default = StakingPoolModule;
