import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';
// Use the full path to import instead of `../types`
import {MoonrunnersStaking__factory} from '../types/factories/MoonrunnersStaking__factory.js';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class MoonrunnersStakingContractAdapter extends BaseStakingContractAdapter {
  /**
   * The contract address
   */
  contractAddress = '0x717C6dD66Be92E979001aee2eE169aAA8D6D4361';

  /**
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC721:0x1485297e942ce64e0870ece60179dfda34b4c625',
      name: 'Moonrunners',
    },
    {
      asset: 'ERC721:0x6b5483b55b362697000d8774d8ea9c4429B261BB',
      name: 'Dragonhorde',
    },
  ];

  /**
   * Get staked token ids for the given owner
   * @param owner - Owner address
   * @param name - Name of the asset
   * @returns all the token ids staked by the user for that asset
   */
  async getStakedTokenIds(owner: string, name?: string): Promise<BigNumber[]> {
    const contract = MoonrunnersStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
    const dragonIdsBuffer = BigNumber.from('20000');
    const allStakedTokens = (await contract.getStake(owner)).tokenIds;
    if (name === 'Dragonhorde') {
      return allStakedTokens
        .filter(tokenId => tokenId.gte(dragonIdsBuffer))
        .map(tokenId => tokenId.sub(dragonIdsBuffer));
    } else {
      return allStakedTokens.filter(tokenId => tokenId.lt(dragonIdsBuffer));
    }
  }

  /**
   * Get staked token ids for the given owner
   * @param owner - Owner address
   * @param name - Name of the asset
   * @returns the balance of that asset staked by the user
   */
  async getStakedTokenBalance(
    owner: string,
    name?: string,
  ): Promise<BigNumber> {
    const contract = MoonrunnersStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
    const dragonIdsBuffer = BigNumber.from('20000');
    const allStakedTokens = (await contract.getStake(owner)).tokenIds;
    if (name === 'Dragonhorde') {
      return BigNumber.from(
        allStakedTokens.filter(tokenId => tokenId.gte(dragonIdsBuffer)).length,
      );
    } else {
      return BigNumber.from(
        allStakedTokens.filter(tokenId => tokenId.lt(dragonIdsBuffer)).length,
      );
    }
  }
}
