# CollabLand Staking Contracts - Project Overview

## Project Summary

**@collabland/staking-contracts** is a TypeScript/Node.js library that provides integration support for various staking contracts to enable Collab.Land's token gating capabilities. This project maintains a curated list of staking contract adapters that allow Discord communities to use staked tokens for access control and community management.

**Current Version:** 1.17.0  
**Repository:** https://github.com/abridged/collabland-staking-contracts  
**NPM Package:** [@collabland/staking-contracts](https://www.npmjs.com/package/@collabland/staking-contracts)

## Key Features

- **Modular Adapter System**: Each staking contract has its own adapter implementation
- **Multi-Chain Support**: Supports various blockchain networks (Ethereum, Blast, etc.)
- **Token Gating Integration**: Enables Discord communities to gate access based on staked tokens
- **Extensible Architecture**: Easy to add new staking contracts through the adapter pattern
- **TypeScript Support**: Full type safety and IntelliSense support

## Project Architecture

### High-Level Structure

```
src/
├── adapters/           # Individual staking contract adapters (56+ contracts)
├── contracts/          # Contract ABI files and Solidity definitions
├── models/            # Data models and interfaces
├── services/          # Core services and utilities
├── types/             # Generated TypeScript types from contracts
├── component.ts       # Main component configuration
├── staking.ts         # Base adapter class and core interfaces
└── index.ts          # Main export file
```

### Core Components

#### 1. Base Staking Contract Adapter (`src/staking.ts`)
- **BaseStakingContractAdapter**: Abstract base class that all adapters extend
- **StackingContractAdapter**: Interface defining the contract for all adapters
- **StakingAsset**: Model representing assets that can be staked
- **EthersProviderService**: Service for blockchain provider management

#### 2. Individual Adapters (`src/adapters/`)
Each adapter file implements support for a specific staking contract:
- **BlastminersStakingContractAdapter**: Example adapter for Blast Miners NFT staking
- **ERC20StakingAdapter**: Generic ERC20 token staking support
- **RenftAdapter**: Support for ReNFT staking protocol
- And 50+ other specific implementations...

#### 3. Contract Definitions (`src/contracts/`)
- ABI files for each supported staking contract
- Solidity source code where available
- Generated TypeScript types for contract interaction

## How It Works

### Adapter Pattern Implementation

1. **Base Class Extension**: Each staking contract adapter extends `BaseStakingContractAdapter`
2. **Contract Specification**: Adapters define:
   - Contract address and chain ID
   - Supported assets (ERC20, ERC721, ERC1155)
   - Blockchain provider configuration
3. **Staking Logic**: Implementation of methods to:
   - Check staked token balances
   - Retrieve staked token IDs
   - Validate asset support

### Example Adapter Structure
```typescript
@injectable({scope: BindingScope.SINGLETON})
export class BlastminersStakingContractAdapter extends BaseStakingContractAdapter {
  contractAddress = '0x16594aF3945fcb290C6cD9De998698a3216f6E1a';
  chainId = 81457; // Blast Network
  contractName = 'BlastMiners';
  
  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC721:0x16594aF3945fcb290C6cD9De998698a3216f6E1a',
      name: 'BlastMiners',
    },
  ];
  
  // Implementation of staking logic...
}
```

## Supported Staking Contracts

The project currently supports 56+ different staking contracts across various categories:

### NFT Staking Contracts
- **Gaming & Metaverse**: Dogface, WarriorsOfAnkh, PlanetX, etc.
- **Art & Collectibles**: BapeAliens, Supreme Kong, Rival Bears, etc.
- **Utility NFTs**: Moonrunners, ReplicantX, OmniGuard Eternals, etc.

### DeFi Staking Contracts
- **Token Staking**: ERC20 generic staking, DWEB staking, etc.
- **LP Token Staking**: Uniswap V2 staking pools
- **Governance Staking**: Railgun governance tokens

### Cross-Chain Support
- **Ethereum Mainnet**: Most contracts
- **Blast Network**: BlastMiners, Blastopians
- **Other Networks**: As specified by individual adapters

## Development Workflow

### Tech Stack
- **Language**: TypeScript
- **Framework**: LoopBack 4 (dependency injection, extensibility)
- **Blockchain**: Ethers.js for contract interaction
- **Build Tools**: Hardhat for Solidity compilation
- **Testing**: Mocha test framework

### Key Scripts
```bash
npm run build          # Compile TypeScript and Solidity
npm run test           # Run test suite
npm run lint           # Code quality checks
npm run clean          # Clean build artifacts
npm run release        # Publish new version
```

### Adding New Staking Contracts

1. **Collect Information**:
   - Chain ID and contract address
   - Contract ABI or Solidity source
   - Asset types that can be staked

2. **Create Adapter**:
   - Add ABI file to `src/contracts/`
   - Create adapter class in `src/adapters/`
   - Extend `BaseStakingContractAdapter`
   - Implement required methods

3. **Testing & Integration**:
   - Write unit tests
   - Test with example usage
   - Submit pull request

## Integration with Collab.Land

### Token Gating Flow
1. **Community Setup**: Discord admins configure staking contract rules
2. **User Verification**: Users connect wallets and verify staked assets
3. **Access Control**: Bot grants/revokes roles based on staking status
4. **Real-time Updates**: Periodic checks for staking changes

### Deployment Process
1. **Development**: Code changes and new adapters
2. **Testing**: QA environment validation
3. **Release**: NPM package publication
4. **Integration**: Collab.Land servers pick up new version
5. **Community Access**: Admins can use new staking contracts

## File Structure Details

### Key Configuration Files
- **`package.json`**: Dependencies, scripts, and package metadata
- **`tsconfig.json`**: TypeScript compilation settings
- **`hardhat.config.cjs`**: Solidity compilation configuration
- **`.eslintrc.cjs`**: Code style and quality rules

### Important Directories
- **`docs/`**: Architecture diagrams and documentation
- **`__tests__/`**: Unit tests for adapters and core functionality
- **`__examples__/`**: Usage examples and demos
- **`dist/`**: Compiled JavaScript output

## Dependencies

### Core Dependencies
- **@loopback/core**: Dependency injection and extensibility framework
- **ethers**: Ethereum library for blockchain interaction
- **@collabland/chain**: Chain-specific utilities and types

### Development Dependencies
- **hardhat**: Solidity compilation and development environment
- **typescript**: Static type checking
- **mocha**: Testing framework
- **eslint/prettier**: Code formatting and linting

## Contributing Guidelines

### Development Setup
1. Clone repository
2. Install dependencies: `npm install`
3. Build project: `npm run build`
4. Run tests: `npm test`

### Code Standards
- TypeScript with strict type checking
- ESLint and Prettier for code formatting
- Comprehensive unit testing required
- Documentation for all public APIs

### Integration Process
- Submit detailed pull request with adapter implementation
- Include contract ABI and deployment information
- Pass all tests and linting checks
- Abridged team review and approval
- Publication to NPM registry

## Business Model

- **Integration Fee**: One-time fee for adding new staking contracts
- **Ongoing Support**: Maintenance and updates included
- **Community Benefits**: Enhanced Discord token gating capabilities
- **Application Process**: [Google Form](https://forms.gle/t6Xr5xwkLivgbw53A) for new integrations

---

*This documentation was generated on 2025-07-23 to provide comprehensive understanding of the CollabLand Staking Contracts project structure and functionality.*
