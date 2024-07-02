import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys.js';
import {BaseStakingContractAdapter, StakingAsset} from '../staking.js';
// Use the full path to import instead of `../types`
import {PlanetxStakingV1} from '../types/PlanetxStakingV1.js';
import {PlanetxStakingV1__factory} from '../types/factories/PlanetxStakingV1__factory.js';

enum AssetNames {
  X_DROIDS = 'X-Droids',
  X_KEYS = 'X-Keys',
}

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class PlanetXStakingV1ContractAdapter extends BaseStakingContractAdapter {
  contractName = 'PlanetXStakingV1';
  /**
   * The contract address
   */
  contractAddress = '0x8005e7626a079e07F16CC59c01e1Be6Cb54d1d24';

  /**
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[] = [
    {
      name: AssetNames.X_DROIDS,
      asset: 'ERC721:0x72C916aA1d33aa2b9fCf7a7A146d22EFD22cdDE8',
    },
    {
      asset: 'ERC721:0xbcbba981bff1e9530cbca0f40f67aa85f8944038',
      name: AssetNames.X_KEYS,
    },
  ];

  private contract: PlanetxStakingV1;

  constructor() {
    super();
    this.contract = PlanetxStakingV1__factory.connect(
      this.contractAddress,
      this.provider,
    );
  }

  /**
   * Get staked token ids for the given owner
   * @param owner - Owner address
   * @returns
   */
  async getStakedTokenIds(
    owner: string,
    assetName?: string,
  ): Promise<BigNumber[]> {
    assetName = assetName ?? AssetNames.X_DROIDS;

    const tokenIds = await this.contract['getStakedTokens(address,address)'](
      owner,
      this.supportedAssets.find(a => a.name === assetName)!.asset.split(':')[1],
    );

    return tokenIds;
  }

  async getStakedTokenBalance(
    owner: string,
    assetName?: string,
  ): Promise<BigNumber> {
    assetName = assetName ?? AssetNames.X_DROIDS;

    const ids = await this.getStakedTokenIds(owner, assetName);

    return BigNumber.from(ids.length);
  }
}
