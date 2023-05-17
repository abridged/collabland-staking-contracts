// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {request, gql} from 'graphql-request';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys';
import {BaseStakingContractAdapter, StakingAsset} from '../staking';

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
    const apiKey = '0d7465b55a8e159d6887ff11521c3465';
    // subgraph id
    const subgraphId = '6W9sMStDyuvTuHGhYNQFSvtca1GPnUmQXz5FtCvkmCyq';
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
    // interface for query return type
    interface Data {
      staker?: {stakedNfts: Array<{id: string}>};
    }
    // fetching owner staked nfts
    const response = await request<Data>(
      `https://gateway.thegraph.com/api/${apiKey}/subgraphs/id/${subgraphId}`,
      query,
      {id: owner},
    );
    // return array of BigNumbers
    return response.staker
      ? response.staker.stakedNfts.map(nft => BigNumber.from(nft.id))
      : [];
  }
}
