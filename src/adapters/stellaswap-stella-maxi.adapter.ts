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
export class StellaswapStellaMaxiAdapter extends BaseStakingContractAdapter {
  contractAddress = '0xc28bDB7ae192f8FFA58a373e7013A3d21427A4B9';
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
    // This assumes the contract only manages a single tokenId per user.
    // If it manages multiple, you will need a different function.
    return [BigNumber.from(tokenId)];
  }

  async getStakedTokenBalance(owner: string): Promise<BigNumber> {
    const ids = await this.getStakedTokenIds(owner);
    return BigNumber.from(ids.length);
  }
}
