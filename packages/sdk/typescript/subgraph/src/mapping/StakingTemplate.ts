import {
  FeeWithdrawn,
  StakeDeposited,
  StakeLocked,
  StakeSlashed,
  StakeWithdrawn,
} from '../../generated/Staking/Staking';
import {
  Leader,
  LeaderStatistics,
  StakeDepositedEvent,
  StakeLockedEvent,
  StakeSlashedEvent,
  StakeWithdrawnEvent,
} from '../../generated/schema';
import { Address, dataSource } from '@graphprotocol/graph-ts';
import { ONE_BI, ZERO_BI } from './utils/number';
import { toEventId } from './utils/event';
import { createTransaction } from './utils/transaction';
import { toBytes } from './utils/string';

export const STATISTICS_ENTITY_ID = toBytes('leader-statistics-id');
export const TOKEN_ADDRESS = Address.fromString('{{ HMToken.address }}');

function constructStatsEntity(): LeaderStatistics {
  const entity = new LeaderStatistics(STATISTICS_ENTITY_ID);

  entity.leaders = ZERO_BI;

  return entity;
}

export function createOrLoadLeaderStatistics(): LeaderStatistics {
  let statsEntity = LeaderStatistics.load(STATISTICS_ENTITY_ID);

  if (!statsEntity) {
    statsEntity = constructStatsEntity();
  }

  return statsEntity;
}

export function createOrLoadLeader(address: Address): Leader {
  let leader = Leader.load(address);

  if (!leader) {
    leader = new Leader(address);

    leader.address = address;
    leader.amountStaked = ZERO_BI;
    leader.amountLocked = ZERO_BI;
    leader.lockedUntilTimestamp = ZERO_BI;
    leader.amountSlashed = ZERO_BI;
    leader.amountWithdrawn = ZERO_BI;
    leader.reward = ZERO_BI;
    leader.amountJobsProcessed = ZERO_BI;
  }

  return leader;
}

export function handleStakeDeposited(event: StakeDeposited): void {
  createTransaction(
    event,
    'stake',
    event.params.staker,
    dataSource.address(),
    null,
    null,
    event.params.tokens,
    TOKEN_ADDRESS
  );
  // Create StakeDepostiedEvent entity
  const eventEntity = new StakeDepositedEvent(toEventId(event));
  eventEntity.block = event.block.number;
  eventEntity.timestamp = event.block.timestamp;
  eventEntity.txHash = event.transaction.hash;
  eventEntity.staker = event.params.staker;
  eventEntity.amount = event.params.tokens;
  eventEntity.save();

  // Update leader
  const leader = createOrLoadLeader(event.params.staker);

  // Increase leader count for new leader
  if (
    leader.amountStaked.equals(ZERO_BI) &&
    leader.amountLocked.equals(ZERO_BI) &&
    leader.amountWithdrawn.equals(ZERO_BI)
  ) {
    // Update Leader Statistics
    const statsEntity = createOrLoadLeaderStatistics();
    statsEntity.leaders = statsEntity.leaders.plus(ONE_BI);
    statsEntity.save();
  }

  leader.amountStaked = leader.amountStaked.plus(eventEntity.amount);
  leader.save();
}

export function handleStakeLocked(event: StakeLocked): void {
  createTransaction(
    event,
    'unstake',
    event.params.staker,
    dataSource.address(),
    null,
    null,
    event.params.tokens,
    TOKEN_ADDRESS
  );
  // Create StakeLockedEvent entity
  const eventEntity = new StakeLockedEvent(toEventId(event));
  eventEntity.block = event.block.number;
  eventEntity.timestamp = event.block.timestamp;
  eventEntity.txHash = event.transaction.hash;
  eventEntity.staker = event.params.staker;
  eventEntity.amount = event.params.tokens;
  eventEntity.lockedUntilTimestamp = event.params.until;
  eventEntity.save();

  // Update leader
  const leader = createOrLoadLeader(event.params.staker);
  leader.amountLocked = eventEntity.amount;
  leader.lockedUntilTimestamp = eventEntity.lockedUntilTimestamp;
  leader.save();
}

export function handleStakeWithdrawn(event: StakeWithdrawn): void {
  createTransaction(
    event,
    'stakeWithdrawn',
    event.params.staker,
    dataSource.address(),
    null,
    null,
    event.params.tokens,
    TOKEN_ADDRESS
  );
  // Create StakeWithdrawnEvent entity
  const eventEntity = new StakeWithdrawnEvent(toEventId(event));
  eventEntity.block = event.block.number;
  eventEntity.timestamp = event.block.timestamp;
  eventEntity.txHash = event.transaction.hash;
  eventEntity.staker = event.params.staker;
  eventEntity.amount = event.params.tokens;
  eventEntity.save();

  // Update leader
  const leader = createOrLoadLeader(event.params.staker);
  leader.amountLocked = leader.amountLocked.minus(eventEntity.amount);
  if (leader.amountLocked.equals(ZERO_BI)) {
    leader.lockedUntilTimestamp = ZERO_BI;
  }
  leader.amountStaked = leader.amountStaked.minus(eventEntity.amount);
  leader.amountWithdrawn = leader.amountWithdrawn.plus(eventEntity.amount);
  leader.save();
}

export function handleStakeSlashed(event: StakeSlashed): void {
  createTransaction(
    event,
    'slash',
    event.params.staker,
    dataSource.address(),
    null,
    event.params.escrowAddress,
    event.params.tokens,
    TOKEN_ADDRESS
  );
  // Create StakeSlashedEvent entity
  const eventEntity = new StakeSlashedEvent(toEventId(event));
  eventEntity.block = event.block.number;
  eventEntity.timestamp = event.block.timestamp;
  eventEntity.txHash = event.transaction.hash;
  eventEntity.staker = event.params.staker;
  eventEntity.amount = event.params.tokens;
  eventEntity.escrowAddress = event.params.escrowAddress;
  eventEntity.slashRequester = event.params.slashRequester;
  eventEntity.save();

  // Update leader
  const leader = createOrLoadLeader(event.params.staker);
  leader.amountSlashed = leader.amountSlashed.plus(eventEntity.amount);
  leader.amountStaked = leader.amountStaked.minus(eventEntity.amount);
  leader.save();
}

export function handleFeeWithdrawn(event: FeeWithdrawn): void {
  createTransaction(
    event,
    'withdrawFees',
    event.transaction.from,
    dataSource.address(),
    null,
    null,
    event.params.amount,
    TOKEN_ADDRESS
  );
}
