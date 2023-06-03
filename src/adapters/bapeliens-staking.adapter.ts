import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys';
import {BaseStakingContractAdapter, StakingAsset} from '../staking';
import {BapeliensStaking__factory} from '../types/factories/BapeliensStaking__factory';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class BapeliensStakingContractAdapter extends BaseStakingContractAdapter {
  contractAddress = '0x3FeB64A0346823E9317A4a192a976f43b4186201';
  chainId = 137;
  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC721:0xB0C5a2423011F26a49d5314a564bd93087d366d6',
    },
  ];

  async getStakedTokenIds(owner: string): Promise<BigNumber[]> {
    const contract = BapeliensStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
    return contract.getStakedTokenIds(owner);
  }

  async getStakedTokenBalance(owner: string): Promise<BigNumber> {
    const contract = BapeliensStaking__factory.connect(
      this.contractAddress,
      this.provider,
    );
    return contract.getStakedTokenBalance(owner);
  }
}
