import {
  Address,
  BigInt,
  Bytes,
  dataSource,
  Value,
} from '@graphprotocol/graph-ts';
import { DataSaved } from '../../generated/KVStore/KVStore';
import {
  KVStore,
  KVStoreSetEvent,
  Leader,
  LeaderURL,
  ReputationNetwork,
} from '../../generated/schema';
import { createOrLoadLeader } from './Staking';
import { isValidEthAddress } from './utils/ethAdrress';
import { toEventId } from './utils/event';
import { toBytes } from './utils/string';
import { createTransaction } from './utils/transaction';
import { store } from '@graphprotocol/graph-ts';

export function createOrLoadLeaderURL(leader: Leader, key: string): LeaderURL {
  const entityId = leader.address.concat(toBytes(key));
  let leaderUrl = LeaderURL.load(entityId);

  if (!leaderUrl) {
    leaderUrl = new LeaderURL(entityId);

    leaderUrl.key = key;
    leaderUrl.leader = leader.id;
  }

  return leaderUrl;
}

export function createOrLoadReputationNetwork(
  address: Address
): ReputationNetwork {
  let reputationNetwork = ReputationNetwork.load(address);

  if (!reputationNetwork) {
    reputationNetwork = new ReputationNetwork(address);
    reputationNetwork.address = address;
    reputationNetwork.save();
  }

  return reputationNetwork;
}

export function createOrUpdateKVStore(event: DataSaved): void {
  const kvstoreId = event.params.sender.concat(toBytes(event.params.key));
  let kvstore = KVStore.load(kvstoreId);

  if (event.params.value == '' && kvstore) {
    store.remove('KVStore', kvstoreId.toHexString());
    return;
  }

  if (!kvstore) {
    kvstore = new KVStore(kvstoreId);
    kvstore.address = event.params.sender;
    kvstore.key = event.params.key;
  }
  kvstore.block = event.block.number;
  kvstore.timestamp = event.block.timestamp;
  kvstore.value = event.params.value;

  kvstore.save();
}

export function handleDataSaved(event: DataSaved): void {
  createTransaction(event, 'set', event.transaction.from, dataSource.address());
  // Create KVStoreSetEvent entity
  const eventEntity = new KVStoreSetEvent(toEventId(event));
  eventEntity.block = event.block.number;
  eventEntity.timestamp = event.block.timestamp;
  eventEntity.txHash = event.transaction.hash;
  eventEntity.leaderAddress = event.params.sender;
  eventEntity.key = event.params.key;
  eventEntity.value = event.params.value;
  eventEntity.save();

  // Update KVStore entity
  createOrUpdateKVStore(event);

  // Update leader attribute, if necessary
  const leader = createOrLoadLeader(event.params.sender);

  const key = event.params.key.toLowerCase();
  if (event.params.value == '') {
    leader.set(key, Value.fromNull());
  } else {
    if (key == 'role') {
      leader.role = event.params.value;
    } else if (key == 'fee') {
      leader.fee = BigInt.fromString(event.params.value);
    } else if (key == 'publickey' || key == 'public_key') {
      leader.publicKey = event.params.value;
    } else if (key == 'webhookurl' || key == 'webhook_url') {
      leader.webhookUrl = event.params.value;
    } else if (key == 'website') {
      leader.website = event.params.value;
    } else if (key == 'url') {
      leader.url = event.params.value;
    } else if (key == 'jobtypes' || key == 'job_types') {
      leader.jobTypes = event.params.value
        .split(',')
        .map<string>((type) => type.trim());
    } else if (
      isValidEthAddress(event.params.key) &&
      leader.role == 'Reputation Oracle'
    ) {
      const ethAddress = Address.fromString(event.params.key);

      const reputationNetwork = createOrLoadReputationNetwork(
        event.params.sender
      );

      const operator = createOrLoadLeader(ethAddress);

      let reputationNetworks = operator.reputationNetworks;
      if (reputationNetworks === null) {
        reputationNetworks = [];
      }

      if (event.params.value.toLowerCase() == 'active') {
        reputationNetworks.push(reputationNetwork.id);
      } else if (event.params.value.toLowerCase() == 'inactive') {
        const filteredNetworks: Bytes[] = [];
        for (let i = 0; i < reputationNetworks.length; i++) {
          if (reputationNetworks[i] != reputationNetwork.id) {
            filteredNetworks.push(reputationNetworks[i]);
          }
        }
        reputationNetworks = filteredNetworks;
      }

      operator.reputationNetworks = reputationNetworks;

      operator.save();
    } else if (key == 'registration_needed') {
      leader.registrationNeeded = event.params.value.toLowerCase() == 'true';
    } else if (key == 'registration_instructions') {
      leader.registrationInstructions = event.params.value;
    } else if (key == 'name') {
      leader.name = event.params.value;
    } else if (key == 'category') {
      leader.category = event.params.value;
    }
  }

  if (key.indexOf('url') > -1) {
    const leaderUrl = createOrLoadLeaderURL(leader, key);
    leaderUrl.url = event.params.value;
    leaderUrl.save();
  }

  leader.save();
}
