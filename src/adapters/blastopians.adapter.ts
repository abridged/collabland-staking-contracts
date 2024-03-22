import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber, ethers} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';
// Use the full path to import instead of `../types`
import {Provider} from '@ethersproject/providers';
import {Blastopians__factory} from '../types/factories/Blastopians__factory.js';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class BlastopiansStakingContractAdapter extends BaseStakingContractAdapter {
  /**
   * The contract address
   */
  contractAddress = '0xDa0005f01654bD92EbEc85cf82Ed1a4e2B3ce70f';

  get provider(): Provider {
    return new ethers.providers.JsonRpcProvider('https://rpc.blast.io');
  }

  contractName = 'Blastopia';
  BLAST_CHAIN_ID = 81457;
  chainId = this.BLAST_CHAIN_ID;

  /**
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC721:0xDa0005f01654bD92EbEc85cf82Ed1a4e2B3ce70f',
      name: 'Blastopian',
    },
  ];

  /**
   * Get staked token ids for the given owner
   * @param owner - Owner address
   * @returns
   */
  getStakedTokenIds(owner: string): Promise<BigNumber[]> {
    const contract = Blastopians__factory.connect(
      this.contractAddress,
      this.provider,
    );
    return contract.getTokensStaked(owner);
  }

  async getStakedTokenBalance(
    owner: string,
    assetName?: string | undefined,
  ): Promise<BigNumber> {
    const contract = Blastopians__factory.connect(
      this.contractAddress,
      this.provider,
    );
    const stakedTokens = await contract.getTokensStaked(owner);
    return BigNumber.from(stakedTokens.length);
  }
}
