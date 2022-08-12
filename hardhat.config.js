// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-solhint');
require('@typechain/hardhat');
const path = require('path');

const DEPLOYER_PRIVATE_KEY =
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

const USER1_PRIVATE_KEY =
  '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d';

const USER2_PRIVATE_KEY =
  '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a';

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const config = {
  solidity: {
    version: '0.8.3',
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  paths: {
    root: path.join(__dirname, '.'),
    sources: path.join(__dirname, './src/contracts'),
    tests: path.join(__dirname, './dist/__tests__'),
    cache: path.join(__dirname, './dist/cache'),
    artifacts: path.join(__dirname, './dist/artifacts'),
  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      accounts: [
        {
          balance: '10000000000000000000000',
          privateKey: DEPLOYER_PRIVATE_KEY,
        },
        {
          balance: '10000000000000000000000',
          privateKey: USER1_PRIVATE_KEY,
        },
        {
          balance: '10000000000000000000000',
          privateKey: USER2_PRIVATE_KEY,
        },
      ],
    },
  },
  typechain: {
    outDir: 'src/types',
    target: 'ethers-v5',
    externalArtifacts: [path.join(__dirname, 'src/contracts/**/*.json')],
    dontOverrideCompile: false,
  },
};

module.exports = config;
