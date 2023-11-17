import {BindingScope, extensionFor, injectable} from '@loopback/core';
import {BigNumber} from 'ethers';
import {STAKING_ADAPTERS_EXTENSION_POINT} from '../keys';
import {BaseStakingContractAdapter, StakingAsset} from '../staking';
// Use the full path to import instead of `../types`
import {FlooringProtocolStaking__factory} from '../types/factories/FlooringProtocolStaking__factory';

@injectable(
  {
    scope: BindingScope.SINGLETON, // Mark the adapter as a singleton
  },
  // Mark it as an extension to staking contracts service
  extensionFor(STAKING_ADAPTERS_EXTENSION_POINT),
)
export class FlooringProtocolStakingContractAdapter extends BaseStakingContractAdapter {
  contractName = 'FlooringProtocol';
  /**
   * The contract address
   */
  contractAddress = '0x3eb879cc9a0Ef4C6f1d870A40ae187768c278Da2';
  /**
   * The periphery contract address of the Flooring Protocol used to read Flooring Protocol States
   */
  peripheryContractAddress = '0x49AD262C49C7aA708Cc2DF262eD53B64A17Dd5EE';
  /**
   * The Flooring Lab Credit contract address
   */
  flcAddress = '0x102c776DDB30C754dEd4fDcC77A19230A60D4e4f';

  /**
   * Assets that can be staked to this contract
   */
  supportedAssets: StakingAsset[] = [
    {
      name: 'FlooringLabCredit',
      asset: 'ERC20:0x102c776DDB30C754dEd4fDcC77A19230A60D4e4f',
    },
  ];

  getStakedTokenBalance(owner: string): Promise<BigNumber> {
    const contract = FlooringProtocolStaking__factory.connect(
      this.peripheryContractAddress,
      this.provider,
    );
    return contract.tokenBalance(owner, this.flcAddress);
  }
}
