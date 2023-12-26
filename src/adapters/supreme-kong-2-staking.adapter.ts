import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';
// Use the full path to import instead of `../types`
import {AssetName} from '@collabland/chain';
import {SupremeKong2Staking} from '../types/SupremeKong2Staking.js';
import {SupremeKong2Staking__factory} from '../types/factories/SupremeKong2Staking__factory.js';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class SupremeKong2StakingContractAdapter extends BaseStakingContractAdapter {
  /**
   * The contract address
   */
  contractAddress = '0x54Fec6309b53A31e65593f196b4c58f7A704A361';

  /**
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[] = [
    {
      name: 'supremeKong2',
      asset: 'ERC721:0x54Fec6309b53A31e65593f196b4c58f7A704A361',
    },
  ];

  poolIds: Record<string, number> = {
    supremeKong2: 0,
  };

  private contract: SupremeKong2Staking;

  constructor() {
    super();
    this.contract = SupremeKong2Staking__factory.connect(
      this.contractAddress,
      this.provider,
    );
  }

  async isAssetSupported(assetName: string): Promise<boolean> {
    const name = new AssetName(assetName);
    if (name.namespace.toUpperCase() !== 'ERC721') {
      return false;
    }

    if (name.reference === 'supremeKong2') {
      return true;
    }

    return false;
  }

  /**
   * Get staked token ids for the given owner
   * @param owner - Owner address
   * @returns
   */
  async getStakedTokenIds(owner: string, name?: string): Promise<BigNumber[]> {
    name = name ?? 'supremeKong2';
    const info = await this.contract.stakedNfts(owner);
    return info;
  }

  async getStakedTokenBalance(
    owner: string,
    name?: string,
  ): Promise<BigNumber> {
    name = name ?? 'supremeKong2';
    const info = await this.contract.stakedNfts(owner);
    return BigNumber.from(info.length);
  }
}
