import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys';
import {BaseStakingContractAdapter, StakingAsset} from '../staking';
import {GenkStaking__factory} from '../types/factories/GenkStaking__factory';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class GenKStakingContractAdapter extends BaseStakingContractAdapter {
  contractAddress = '0x027FC636E944A7a28D58E2d80e5241df546fD9a7';
  chainId = 137;
  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC721:0xf8b06f92f147adf01da319304a9d18a2b1b8c9e8',
    },
  ];

  /**
   * Get staked token ids for the given owner
   * @param owner - Owner address
   * @returns
   */
  async getStakedTokenIds(owner: string): Promise<BigNumber[]> {
    const contract = GenkStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
    return contract.getStakedTokens(owner);
  }

  /**
   * Get staked token balance for the given owner
   * @param owner - Owner address
   * @returns
   */
  async getStakedTokenBalance(owner: string): Promise<BigNumber> {
    const contract = GenkStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
    return BigNumber.from((await contract.getStakedTokens(owner))?.length ?? 0);
  }
}
