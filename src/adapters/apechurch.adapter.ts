import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';
// Use the full path to import instead of `../types`
import {ApechurchStaking__factory} from '../types/factories/ApechurchStaking__factory.js';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class ApeChurchStakingContractAdapter extends BaseStakingContractAdapter {
  contractAddress = '0x64bf43d2412ec6385c7675B6dFEfeb1F933dc29a';
  chainId = 33139;
  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC721:0x81C9ce55E8214Fd0f5181FD3D38f52fD8c33Ec38',
    },
  ];
  getStakedTokenIds(owner: string): Promise<BigNumber[]> {
    const contract = ApechurchStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
    return contract.getStakedGimbozTokenIds(owner);
  }
}
