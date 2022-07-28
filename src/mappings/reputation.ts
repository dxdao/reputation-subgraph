import { BigInt, dataSource, ethereum } from '@graphprotocol/graph-ts';
import { BlockReputation, AddresReputationMint, AddresReputationBurn } from '../types/schema';
import {
  DXReputation as DXReputationContract,
  Mint as MintEvent,
  Burn as BurnEvent,
} from '../types/DXReputation/DXReputation';
import { getOrCreateAddressReputationEntity, createDXReputationEntity } from './helpers';

export function handleMint(event: MintEvent): void {
  createDXReputationEntity(event.address);

  let addressReputation = getOrCreateAddressReputationEntity(event.params._to);

  let addressReputationMint = new AddresReputationMint(event.transaction.hash.toHexString());
  addressReputationMint.address = addressReputation.id; // link to the addressReputation entity
  addressReputationMint.reputation = event.params._amount.toBigDecimal();
  addressReputationMint.save();

  // addressReputation.mints = addressReputation.mints.concat([addressReputationMint.id]);
  addressReputation.reputation = addressReputation.reputation.plus(addressReputationMint.reputation);
  addressReputation.save();
}

export function handleBurn(event: BurnEvent): void {
  createDXReputationEntity(event.address);

  let addressReputation = getOrCreateAddressReputationEntity(event.params._from);

  let addressReputationBurn = new AddresReputationBurn(event.transaction.hash.toHexString());
  addressReputationBurn.address = addressReputation.id; // link to the addressReputation entity
  addressReputationBurn.reputation = event.params._amount.toBigDecimal();
  addressReputationBurn.save();

  // addressReputation.burns = addressReputation.burns.concat([addressReputationBurn.id]);
  addressReputation.reputation = addressReputation.reputation.minus(addressReputationBurn.reputation);
  addressReputation.save();
}

export function handleBlockReputation(block: ethereum.Block): void {
  const dxReputationContract = DXReputationContract.bind(dataSource.address());
  const blockReputation = new BlockReputation(block.hash.toHexString());
  blockReputation.blockNumber = BigInt.fromI32(block.number.toI32());
  blockReputation.reputation = dxReputationContract.totalSupplyAt(block.number).toBigDecimal();
  blockReputation.save();
}
