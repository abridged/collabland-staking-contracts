import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber, Contract} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';

const ABI = [
  {
    inputs: [],
    name: 'managedTokenId',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
];

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class StellaswapUsdcMaxiAdapter extends BaseStakingContractAdapter {
  contractAddress = '0xb3F58309E73c4De6c1f691a52190Fb1988FAF13a';
  chainId = 1284; // Moonbeam
  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC721:0xfa62B5962a7923A2910F945268AA65C943D131e9',
      name: 'YourNFT',
    },
  ];

  async getStakedTokenIds(owner: string): Promise<BigNumber[]> {
    const contract = new Contract(this.contractAddress, ABI, this.provider);
    const tokenId = await contract.managedTokenId();
    return [BigNumber.from(tokenId)];
  }

  async getStakedTokenBalance(owner: string): Promise<BigNumber> {
    const ids = await this.getStakedTokenIds(owner);
    return BigNumber.from(ids.length);
  }
}
