import { Bytes, Address, BigDecimal } from '@graphprotocol/graph-ts';
import { AddresReputation, DXReputation } from '../types/schema';

export function getOrCreateAddressReputationEntity(address: Bytes): AddresReputation {
  let entity = AddresReputation.load(address.toHexString());

  if (entity == null) {
    entity = new AddresReputation(address.toHexString());
    entity.address = address;
    // entity.mints = [];
    // entity.burns = [];
    entity.reputation = BigDecimal.fromString('0');
    entity.save();
  }

  return entity as AddresReputation;
}

export function createDXReputationEntity(address: Address): DXReputation {
  let entity = DXReputation.load('0');

  if (entity == null) {
    entity = new DXReputation('0');
    entity.address = address;
    entity.save();
  }

  return entity as DXReputation;
}
