// Copyright Abridged, Inc. 2022. All Rights Reserved.
// Node module: @collabland/staking-contracts
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {AssetType} from '@collabland/chain';
import {getEnvVar} from '@collabland/common';
import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys';
import {BaseStakingContractAdapter} from '../staking';

type PartialRenting = {
  rentAmount: string;
  lending: {
    tokenID: string;
  };
};

const getSylvesterQuery = (renterAddress: string, nftAddress?: string) => {
  const nftAddressFilter =
    nftAddress !== undefined ? `, lending: {nftAddress: "${nftAddress}"}` : '';
  return `{
    rentings(where: {renterAddress: "${renterAddress}", expired: false${nftAddressFilter}}) {
             rentAmount,
             lending {
               tokenID
             }
        }
}`;
};

const transformGraphResponseBody = (body: Record<string, any>): BigNumber[] => {
  return body?.data?.rentings
    ?.map((r: PartialRenting) =>
      Array(Number(r.rentAmount)).fill(BigNumber.from(r.lending.tokenID)),
    )
    .flat(1);
};

abstract class BaseReNFTSylvesterStakingContractAdapter extends BaseStakingContractAdapter {
  // Any ERC-721 and ERC-1155 asset is supported
  supportedAssets = [];
  abstract queryUrl?: string;

  async isAssetSupported(assetName: string): Promise<boolean> {
    return ['erc721', 'erc1155'].some(assetStandard =>
      assetName.toLowerCase().startsWith(`${assetStandard}:`),
    );
  }

  getStakingAssetType(name?: string) {
    // Assume name is the CAIP asset name
    if (name === undefined) return undefined;
    return new AssetType({
      chainId: {
        namespace: 'evm',
        reference: this.chainId.toString(),
      },
      assetName: name,
    });
  }

  async getStakedTokenIds(
    owner: string,
    assetName?: string,
  ): Promise<BigNumber[]> {
    // Assume assetName is the CAIP asset name
    const splitAssetName = assetName?.split(':');
    const nftAddress =
      splitAssetName && splitAssetName.length == 2
        ? splitAssetName[1]
        : undefined;
    const query = getSylvesterQuery(owner, nftAddress);
    if (this.queryUrl === undefined)
      throw new Error(
        `ReNFT subgraph URL undefined for ${this.constructor.name}.`,
      );
    const body = await fetch(this.queryUrl, {
      body: JSON.stringify({query: query}),
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
    }).then(res => {
      return res.json();
    });
    return transformGraphResponseBody(body);
  }
}

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class ReNFTEthereumSylvesterV0StakingContractAdapter extends BaseReNFTSylvesterStakingContractAdapter {
  chainId = 1;
  contractAddress = '0xa8D3F65b6E2922fED1430b77aC2b557e1fa8DA4a';
  queryUrl = getEnvVar('RENFT_ETHEREUM_SYLVESTER_V0_SUBGRAPH_URL');
}

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class ReNFTPolygonSylvesterV1StakingContractAdapter extends BaseReNFTSylvesterStakingContractAdapter {
  chainId = 137;
  contractAddress = '0x4e52b73aa28b7ff84d88ea3a90c0668f46043450';
  queryUrl = getEnvVar('RENFT_POLYGON_SYLVESTER_V1_SUBGRAPH_URL');
}
