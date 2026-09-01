import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';
// Use the full path to import instead of `../types`
import {
  AnyType,
  getEnvVar,
  getFetch,
  handleFetchResponse,
} from '@collabland/common';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class FishingFrenzyStakingContractAdapter extends BaseStakingContractAdapter {
  /**
   * The contract address
   */
  contractAddress = '0xb9f0d9997f0b92040e73a08ed470d16fdda80ab8';

  chainId = 2020; // Ronin Mainnet

  /**
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC721:0x3fa1e076bd4e7f4b7469ad1646332c09b275082d',
    },
  ];

  queryUrl = getEnvVar(
    'FISHING_FRENZY_TOKEN_API_URL',
    'https://api.token.fishingfrenzy.co/onchain/get-staked-token-ids/',
  );

  transformGraphResponseBody = (body: Record<string, AnyType>): BigNumber[] => {
    const tokenIds = body?.tokenIds
      ?.map((r: string) => BigNumber.from(r.toString()))
      .flat(1);
    return tokenIds;
  };

  /**
   * Get staked token ids for the given owner
   * @param owner - Owner address
   * @returns
   */
  async getStakedTokenIds(owner: string): Promise<BigNumber[]> {
    const fetch = getFetch();
    if (this.queryUrl === undefined)
      throw new Error(
        `FISHING_FRENZY_TOKEN_API_URL undefined for ${this.constructor.name}.`,
      );
    const res = await fetch(this.queryUrl + `${owner}`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    });
    const body = await handleFetchResponse<Record<string, AnyType>>(res);
    return this.transformGraphResponseBody(body);
  }
}
