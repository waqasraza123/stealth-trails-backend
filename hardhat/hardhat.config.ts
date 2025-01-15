import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ignition";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.28",
};

export default config;
