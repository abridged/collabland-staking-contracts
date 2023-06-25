import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys';
import {BaseStakingContractAdapter, StakingAsset} from '../staking';
// Use the full path to import instead of `../types`
import {AssetName} from '@collabland/chain';
import {OmniguardEternals} from '../types';
import {OmniguardEternals__factory} from '../types/factories/OmniguardEternals__factory';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class OmniguardEternalsStakingContractAdapter extends BaseStakingContractAdapter {
  /**
   * The contract address
   */
  contractAddress = '0x02B3b9900F829C9C392fBa0C4bb450becdFE7374';

  /**
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[] = [
    {
      name: 'eternals',
      asset: 'ERC721:0xc26064Ac72101B555Ff2fCC1629a7A867B69c188',
    },
    {
      name: 'omniguards',
      asset: 'ERC721:0x6F7fe413E871B80C5A12C180F5aB3964f82D5cDc',
    },
  ];

  poolIds: Record<string, number> = {
    eternals: 0,
    omniguards: 1,
  };

  private contract: OmniguardEternals;

  constructor() {
    super();
    this.contract = OmniguardEternals__factory.connect(
      this.contractAddress,
      this.provider,
    );
  }

  async isAssetSupported(assetName: string): Promise<boolean> {
    const name = new AssetName(assetName);
    if (name.namespace.toUpperCase() !== 'ERC721') {
      return false;
    }

    const size = await this.contract.getPoolSize();
    for (let i = 0; i < size.toNumber(); i++) {
      const pool = await this.contract.getPool(i);
      if (pool[0] === name.reference) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get staked token ids for the given owner
   * @param owner - Owner address
   * @returns
   */
  async getStakedTokenIds(owner: string, name?: string): Promise<BigNumber[]> {
    name = name?.toLowerCase() ?? 'eternals';
    const poolId = this.poolIds[name] ?? 0;
    const info = await this.contract.getStakerInfo(owner, poolId);
    return info[1];
  }

  async getStakedTokenBalance(
    owner: string,
    name?: string,
  ): Promise<BigNumber> {
    name = name?.toLowerCase() ?? 'eternals';
    const poolId = this.poolIds[name] ?? 0;
    const info = await this.contract.getStakerInfo(owner, poolId);
    return info[0];
  }
}
