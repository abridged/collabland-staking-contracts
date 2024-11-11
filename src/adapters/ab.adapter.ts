// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {getEnvVar} from '@collabland/common';
import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {gql, request} from 'graphql-request';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';

// interface for query return type
interface Data {
  staker?: {stakedNfts: Array<{id: string}>};
}

// graphql query
const query = gql`
  query fetchStakedNFTs($id: ID!) {
    staker(id: $id) {
      stakedNfts(first: 1000) {
        id
      }
    }
  }
`;

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class AngelBlockStakingContractAdapter extends BaseStakingContractAdapter {
  /**
   * The contract address
   */
  contractAddress = '0xa95f94b920b1a49b655019265715f026b064bc86';

  /**
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[] = [
    {
      asset: 'ERC721:0x459ea67815b4720e55ec7dfd93687c9d2924eb79',
    },
  ];

  /**
   * Get staked token ids for the given owner
   * @param owner - Owner address
   * @returns
   */
  async getStakedTokenIds(owner: string): Promise<BigNumber[]> {
    // subgraph query key
    const apiKey = getEnvVar('ANGEL_BLOCK_SUBGRAPH_API_KEY');
    if (typeof apiKey !== 'string') {
      throw new Error(`API key for AngelBlock subgraph is missing.`);
    }
    // subgraph id
    const subgraphId = 'Gzd5KzH5rceQSy3oo4y3bYcGMc9jwwnrhFuZ27JDhh7z';
    // fetching owner staked nfts
    const response = await request<Data>(
      `https://gateway.thegraph.com/api/${encodeURIComponent(
        apiKey,
      )}/subgraphs/id/${subgraphId}`,
      query,
      {id: owner},
    );
    // return array of BigNumbers
    return response.staker
      ? response.staker.stakedNfts.map(nft => BigNumber.from(nft.id))
      : [];
  }
}
