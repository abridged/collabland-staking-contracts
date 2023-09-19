import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys';
import {BaseStakingContractAdapter, StakingAsset} from '../staking';
// Use the full path to import instead of `../types`
import {AssetName} from '@collabland/chain';
import {SupremeKongStaking} from '../types/SupremeKongStaking';
import {SupremeKongStaking__factory} from '../types/factories/SupremeKongStaking__factory';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class SupremeKongStakingContractAdapter extends BaseStakingContractAdapter {
  /**
   * The contract address
   */
  contractAddress = '0x70C7af7a78B5453E4A09376eB2b506CE4E4140E5';

  /**
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[] = [
    {
      name: 'supremeKong',
      asset: 'ERC721:0x12787526c03d626AAc88E6EDc4d0Fb930d86C631',
    },
    {
      name: 'supremeBanana',
      asset: 'ERC721:0xF59aFe732B2793d541780fd02945228db1fAd8ed',
    },
    {
      name: 'mutantBanana',
      asset: 'ERC721:0x8ACe1Ec951Bc29b98440d1bbCa64E6010c9E9E17',
    },
  ];

  poolIds: Record<string, number> = {
    supremeKong: 0,
    supremeBanana: 1,
    mutantBanana: 2,
  };

  private contract: SupremeKongStaking;

  constructor() {
    super();
    this.contract = SupremeKongStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
  }

  async isAssetSupported(assetName: string): Promise<boolean> {
    const name = new AssetName(assetName);
    if (name.namespace.toUpperCase() !== 'ERC721') {
      return false;
    }

    if (name.reference === 'supremeKong') {
      return true;
    }

    if (name.reference === 'supremeBanana') {
      return true;
    }

    if (name.reference === 'mutantBanana') {
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
    name = name?.toLowerCase() ?? 'supremeKong';
    const poolId = this.poolIds[name] ?? 0;
    const info = await this.contract.stakedNfts(owner, poolId);
    return info;
  }

  async getStakedTokenBalance(
    owner: string,
    name?: string,
  ): Promise<BigNumber> {
    name = name?.toLowerCase() ?? 'supremeKong';
    const poolId = this.poolIds[name] ?? 0;
    const info = await this.contract.stakedNfts(owner, poolId);
    return BigNumber.from(info.length);
  }
}
