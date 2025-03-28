import { Escrow } from '../../../generated/schema';
import { Launched } from '../../../generated/LegacyEscrowFactory/EscrowFactory';
import { LegacyEscrow as EscrowTemplate } from '../../../generated/templates';
import { ONE_BI, ZERO_BI } from '../utils/number';
import { getEventDayData } from '../utils/dayUpdates';
import { createOrLoadEscrowStatistics } from '../Escrow';
import { createOrLoadOperator } from '../Staking';
import { createTransaction } from '../utils/transaction';
import { dataSource } from '@graphprotocol/graph-ts';

export function handleLaunched(event: Launched): void {
  createTransaction(
    event,
    'createEscrow',
    event.transaction.from,
    dataSource.address(),
    null,
    event.params.escrow
  );

  // Create Escrow entity
  const entity = new Escrow(event.params.escrow);

  entity.createdAt = event.block.timestamp;
  entity.address = event.params.escrow;
  entity.token = event.params.eip20;
  entity.factoryAddress = event.address;
  entity.launcher = event.transaction.from;
  entity.canceler = event.transaction.from;

  entity.balance = ZERO_BI;
  entity.amountPaid = ZERO_BI;
  entity.totalFundedAmount = ZERO_BI;

  entity.status = 'Launched';

  // Update escrow statistics
  const statsEntity = createOrLoadEscrowStatistics();
  statsEntity.totalEscrowCount = statsEntity.totalEscrowCount.plus(ONE_BI);
  statsEntity.save();

  entity.count = statsEntity.totalEscrowCount;
  entity.save();

  // Create escrow template
  EscrowTemplate.create(event.params.escrow);

  // Update escrow amount day data
  const eventDayData = getEventDayData(event);
  eventDayData.dailyEscrowCount = eventDayData.dailyEscrowCount.plus(ONE_BI);
  eventDayData.save();

  // Increase amount of jobs launched by operator
  const operator = createOrLoadOperator(event.transaction.from);
  operator.amountJobsProcessed = operator.amountJobsProcessed.plus(ONE_BI);
  operator.save();
}
