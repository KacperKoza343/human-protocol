[**@human-protocol/sdk**](../../README.md)

***

[@human-protocol/sdk](../../modules.md) / [escrow](../README.md) / EscrowUtils

# Class: EscrowUtils

Defined in: [escrow.ts:1558](https://github.com/humanprotocol/human-protocol/blob/06afdec15d4185a13ccdd98fd231f6651db0e480/packages/sdk/typescript/human-protocol-sdk/src/escrow.ts#L1558)

## Introduction

Utility class for escrow-related operations.

## Installation

### npm
```bash
npm install @human-protocol/sdk
```

### yarn
```bash
yarn install @human-protocol/sdk
```

## Code example

### Signer

**Using private key(backend)**

```ts
import { ChainId, EscrowUtils } from '@human-protocol/sdk';

const escrowAddresses = new EscrowUtils.getEscrows({
  chainId: ChainId.POLYGON_AMOY
});
```

## Constructors

### new EscrowUtils()

> **new EscrowUtils**(): [`EscrowUtils`](EscrowUtils.md)

#### Returns

[`EscrowUtils`](EscrowUtils.md)

## Methods

### getEscrow()

> `static` **getEscrow**(`chainId`, `escrowAddress`): `Promise`\<[`EscrowData`](../../graphql/types/type-aliases/EscrowData.md)\>

Defined in: [escrow.ts:1773](https://github.com/humanprotocol/human-protocol/blob/06afdec15d4185a13ccdd98fd231f6651db0e480/packages/sdk/typescript/human-protocol-sdk/src/escrow.ts#L1773)

This function returns the escrow data for a given address.

> This uses Subgraph

**Input parameters**

```ts
enum ChainId {
  ALL = -1,
  MAINNET = 1,
  SEPOLIA = 11155111,
  BSC_MAINNET = 56,
  BSC_TESTNET = 97,
  POLYGON = 137,
  POLYGON_AMOY = 80002,
  LOCALHOST = 1338,
}
```

```ts
type EscrowData = {
  id: string;
  address: string;
  amountPaid: string;
  balance: string;
  count: string;
  jobRequesterId: string;
  factoryAddress: string;
  finalResultsUrl?: string;
  intermediateResultsUrl?: string;
  launcher: string;
  manifestHash?: string;
  manifestUrl?: string;
  recordingOracle?: string;
  reputationOracle?: string;
  exchangeOracle?: string;
  status: EscrowStatus;
  token: string;
  totalFundedAmount: string;
  createdAt: string;
};
```

#### Parameters

##### chainId

[`ChainId`](../../enums/enumerations/ChainId.md)

Network in which the escrow has been deployed

##### escrowAddress

`string`

Address of the escrow

#### Returns

`Promise`\<[`EscrowData`](../../graphql/types/type-aliases/EscrowData.md)\>

Escrow data

**Code example**

```ts
import { ChainId, EscrowUtils } from '@human-protocol/sdk';

const escrowData = new EscrowUtils.getEscrow(ChainId.POLYGON_AMOY, "0x1234567890123456789012345678901234567890");
```

***

### getEscrows()

> `static` **getEscrows**(`filter`): `Promise`\<[`EscrowData`](../../graphql/types/type-aliases/EscrowData.md)[]\>

Defined in: [escrow.ts:1655](https://github.com/humanprotocol/human-protocol/blob/06afdec15d4185a13ccdd98fd231f6651db0e480/packages/sdk/typescript/human-protocol-sdk/src/escrow.ts#L1655)

This function returns an array of escrows based on the specified filter parameters.

**Input parameters**

```ts
interface IEscrowsFilter {
  chainId: ChainId;
  launcher?: string;
  reputationOracle?: string;
  recordingOracle?: string;
  exchangeOracle?: string;
  jobRequesterId?: string;
  status?: EscrowStatus;
  from?: Date;
  to?: Date;
  first?: number;
  skip?: number;
  orderDirection?: OrderDirection;
}
```

```ts
enum ChainId {
  ALL = -1,
  MAINNET = 1,
  SEPOLIA = 11155111,
  BSC_MAINNET = 56,
  BSC_TESTNET = 97,
  POLYGON = 137,
  POLYGON_AMOY=80002,
  LOCALHOST = 1338,
}
```

```ts
enum OrderDirection {
  ASC = 'asc',
  DESC = 'desc',
}
```

```ts
enum EscrowStatus {
  Launched,
  Pending,
  Partial,
  Paid,
  Complete,
  Cancelled,
}
```

```ts
type EscrowData = {
  id: string;
  address: string;
  amountPaid: string;
  balance: string;
  count: string;
  jobRequesterId: string;
  factoryAddress: string;
  finalResultsUrl?: string;
  intermediateResultsUrl?: string;
  launcher: string;
  manifestHash?: string;
  manifestUrl?: string;
  recordingOracle?: string;
  reputationOracle?: string;
  exchangeOracle?: string;
  status: EscrowStatus;
  token: string;
  totalFundedAmount: string;
  createdAt: string;
};
```

#### Parameters

##### filter

[`IEscrowsFilter`](../../interfaces/interfaces/IEscrowsFilter.md)

Filter parameters.

#### Returns

`Promise`\<[`EscrowData`](../../graphql/types/type-aliases/EscrowData.md)[]\>

List of escrows that match the filter.

**Code example**

```ts
import { ChainId, EscrowUtils, EscrowStatus } from '@human-protocol/sdk';

const filters: IEscrowsFilter = {
  status: EscrowStatus.Pending,
  from: new Date(2023, 4, 8),
  to: new Date(2023, 5, 8),
  chainId: ChainId.POLYGON_AMOY
};
const escrowDatas = await EscrowUtils.getEscrows(filters);
```

***

### getStatusEvents()

> `static` **getStatusEvents**(`chainId`, `statuses`?, `from`?, `to`?, `launcher`?, `first`?, `skip`?, `orderDirection`?): `Promise`\<[`StatusEvent`](../../graphql/types/type-aliases/StatusEvent.md)[]\>

Defined in: [escrow.ts:1860](https://github.com/humanprotocol/human-protocol/blob/06afdec15d4185a13ccdd98fd231f6651db0e480/packages/sdk/typescript/human-protocol-sdk/src/escrow.ts#L1860)

This function returns the status events for a given set of networks within an optional date range.

> This uses Subgraph

**Input parameters**

```ts
enum ChainId {
  ALL = -1,
  MAINNET = 1,
  SEPOLIA = 11155111,
  BSC_MAINNET = 56,
  BSC_TESTNET = 97,
  POLYGON = 137,
  POLYGON_AMOY = 80002,
  LOCALHOST = 1338,
}
```

```ts
enum OrderDirection {
  ASC = 'asc',
  DESC = 'desc',
}
```

```ts
type Status = {
  escrowAddress: string;
  timestamp: string;
  status: string;
};
```

#### Parameters

##### chainId

[`ChainId`](../../enums/enumerations/ChainId.md)

List of network IDs to query for status events.

##### statuses?

[`EscrowStatus`](../../types/enumerations/EscrowStatus.md)[]

Optional array of statuses to query for. If not provided, queries for all statuses.

##### from?

`Date`

Optional start date to filter events.

##### to?

`Date`

Optional end date to filter events.

##### launcher?

`string`

Optional launcher address to filter events. Must be a valid Ethereum address.

##### first?

`number`

Optional number of transactions per page. Default is 10.

##### skip?

`number`

Optional number of transactions to skip. Default is 0.

##### orderDirection?

[`OrderDirection`](../../enums/enumerations/OrderDirection.md)

Optional order of the results. Default is DESC.

#### Returns

`Promise`\<[`StatusEvent`](../../graphql/types/type-aliases/StatusEvent.md)[]\>

- Array of status events with their corresponding statuses.

**Code example**

```ts
import { ChainId, EscrowUtils, EscrowStatus } from '@human-protocol/sdk';

(async () => {
  const fromDate = new Date('2023-01-01');
  const toDate = new Date('2023-12-31');
  const statusEvents = await EscrowUtils.getStatusEvents(
    [ChainId.POLYGON, ChainId.MAINNET],
    [EscrowStatus.Pending, EscrowStatus.Complete],
    fromDate,
    toDate
  );
  console.log(statusEvents);
})();
```
