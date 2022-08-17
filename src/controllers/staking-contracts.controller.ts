import {inject} from '@loopback/core';
import {get, getModelSchemaRef, oas} from '@loopback/rest';
import {STAKING_CONTRACTS_SERVICE} from '../keys';
import {StakingContractMetadata} from '../models/staking.model';
import type {StakingContractsService} from '../services';

export class StakingContractsController {
  constructor(
    @inject(STAKING_CONTRACTS_SERVICE) private service: StakingContractsService,
  ) {}

  @get('/ethereum/staking-contracts')
  @oas.response(200, {
    content: {
      'application/json': {
        type: 'array',
        items: getModelSchemaRef(StakingContractMetadata),
      },
    },
  })
  getStakingContracts() {
    return this.service.stakingContracts;
  }
}
