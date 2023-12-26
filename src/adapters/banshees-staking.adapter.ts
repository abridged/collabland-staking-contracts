import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';
// Use the full path to import instead of `../types`
import {BansheesStaking__factory} from '../types/factories/BansheesStaking__factory.js';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class BansheesStakingContractAdapter extends BaseStakingContractAdapter {
  contractAddress = '0xccF58d53a544ae1D8cfD2D6732d9FCaFE5362d10';
  chainId = 137;
  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC721:0xbb8bb9712a63b0df0c6ba16ed14e97ae5b85e03d',
    },
  ];
  getStakedTokenIds(owner: string): Promise<BigNumber[]> {
    const contract = BansheesStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
    return contract.getStakedTokensOfWallet(owner);
  }
}
