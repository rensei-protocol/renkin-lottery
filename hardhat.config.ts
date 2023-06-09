import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";


dotenvConfig({ path: resolve(__dirname, "./.env") });

const MAINNET_MNEMONIC = process.env.MAINNET_MNEMONIC || "";


const config: HardhatUserConfig = {
  networks: {
    goerli: {
        chainId: 5,
        url: `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_GOERLI_API_KEY}`,
        accounts: {
            mnemonic: process.env.GOERLI_MNEMONIC,
        },
    },
    mainnet: {
        chainId: 1,
        url: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_MAINNET_API_KEY}`,
        accounts: {
            mnemonic: MAINNET_MNEMONIC,
        },
    },
},
  solidity: {
    compilers: [
        {
            version: "0.8.18",
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 2000,
                },
            },
        },
    ],
},
};

export default config;
