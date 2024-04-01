import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';
// Use the full path to import instead of `../types`
import {BibizAbi__factory} from '../types/factories/BibizAbi__factory.js';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class BibizStakingContractAdapter extends BaseStakingContractAdapter {
  /**
   * The contract address
   */
  contractAddress = '0xbC3b75931e827307B6E89682673a00E3502ec4Ab';

  /**
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC721:0x00abdb2fbbc763b6b4a8700e10550ad74dac4d43',
    },
  ];

  /**
   * Get staked token ids for the given owner
   * @param owner - Owner address
   * @returns
   */
  getStakedTokenIds(owner: string): Promise<BigNumber[]> {
    const contract = BibizAbi__factory.connect(
      this.contractAddress,
      this.provider,
    );
    return contract.tokensOf(owner);
  }

  /**
   * Gets number/balance of staked bibiz
   * @param owner The owner address
   * @returns
   */
  async getStakedTokenBalance(owner: string): Promise<BigNumber> {
    const number = (await this.getStakedTokenIds(owner)).length;

    return Promise.resolve(BigNumber.from(number));
  }
}
