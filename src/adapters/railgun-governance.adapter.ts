import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';
// Use the full path to import instead of `../types`
import {RailgunGovernance__factory} from '../types/factories/RailgunGovernance__factory.js';

abstract class BaseRailgunContractAdapter extends BaseStakingContractAdapter {
  /**
   * Get staked amount for the given owner
   * @param owner - Owner address
   * @returns
   */
  getStakedTokenBalance(owner: string): Promise<BigNumber> {
    const contract = RailgunGovernance__factory.connect(
      this.contractAddress,
      this.provider,
    );
    return contract.votingPower(owner);
  }
}

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class RailgunEthereumGovernanceAdapter extends BaseRailgunContractAdapter {
  /**
   * The contract address
   */
  contractAddress = '0xee6a649aa3766bd117e12c161726b693a1b2ee20';
  chainId: number = 1;
  /**
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[] = [
    {
      name: 'RAIL',
      asset: 'ERC20:0xe76C6c83af64e4C60245D8C7dE953DF673a7A33D',
    },
  ];
}

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class RailgunPolygonGovernanceAdapter extends BaseRailgunContractAdapter {
  /**
   * The contract address
   */
  contractAddress = '0x9AC2bA4bf7FaCB0bbB33447e5fF8f8D63B71dDC1';
  chainId: number = 137;
  /**
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[] = [
    {
      name: 'RAILPOLY',
      asset: 'ERC20:0x92A9C92C215092720C731c96D4Ff508c831a714f',
    },
  ];
}
