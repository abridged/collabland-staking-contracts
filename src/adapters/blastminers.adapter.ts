import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber, ethers} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';
// Use the full path to import instead of `../types`
import {Provider} from '@ethersproject/providers';
import {Blastminers__factory} from '../types/factories/Blastminers__factory.js';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class BlastminersStakingContractAdapter extends BaseStakingContractAdapter {
  /**
   * The contract address
   */
  contractAddress = '0x16594aF3945fcb290C6cD9De998698a3216f6E1a';

  get provider(): Provider {
    return new ethers.providers.JsonRpcProvider('https://rpc.blast.io');
  }

  contractName = 'BlastMiners';
  BLAST_CHAIN_ID = 81457;
  chainId = this.BLAST_CHAIN_ID;

  /**
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC721:0x16594aF3945fcb290C6cD9De998698a3216f6E1a',
      name: 'BlastMiners',
    },
  ];

  /**
   * Get staked token ids for the given owner
   * @param owner - Owner address
   * @returns
   */
  getStakedTokenIds(owner: string): Promise<BigNumber[]> {
    const contract = Blastminers__factory.connect(
      this.contractAddress,
      this.provider,
    );
    return contract.getTokensStaked(owner);
  }

  async getStakedTokenBalance(
    owner: string,
    assetName?: string | undefined,
  ): Promise<BigNumber> {
    const contract = Blastminers__factory.connect(
      this.contractAddress,
      this.provider,
    );
    const stakedTokens = await contract.getTokensStaked(owner);
    return BigNumber.from(stakedTokens.length);
  }
}
