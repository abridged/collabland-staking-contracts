import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys';
import {BaseStakingContractAdapter, StakingAsset} from '../staking';
// Use the full path to import instead of `../types`
import {MeltdownChildren__factory} from '../types/factories/MeltdownChildren__factory';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class MeltdownContractAdapter extends BaseStakingContractAdapter {
  /**
   * The contract address
   */
  contractAddress = '0x78Edb971CdcAa7C262C58D526fc81Ee96809cF4f';
  chainId = 137;
  /**
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC721:0xc47d3EF164FB3f3C3D6cfAF259f09f6AA9aa7C03',
    },
  ];

  /**
   * Get staked token ids for the given owner
   * @param owner - Owner address
   * @returns
   */
  async getStakedTokenIds(owner: string): Promise<BigNumber[]> {
    const contract = MeltdownChildren__factory.connect(
      this.contractAddress,
      this.provider,
    );
    const data = await contract.getStakeInfo(owner);
    return data._tokensStaked;
  }
}
