[**@human-protocol/sdk**](../../README.md) • **Docs**

***

[@human-protocol/sdk](../../modules.md) / [escrow](../README.md) / EscrowUtils

# Class: EscrowUtils

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
  networks: [ChainId.POLYGON_AMOY]
});
```

## Constructors

### new EscrowUtils()

> **new EscrowUtils**(): [`EscrowUtils`](EscrowUtils.md)

#### Returns

[`EscrowUtils`](EscrowUtils.md)

## Methods

### getEscrow()

> `static` **getEscrow**(`chainId`, `escrowAddress`): `Promise`\<`EscrowData`\>

This function returns the escrow data for a given address.

> This uses Subgraph

**Input parameters**

```ts
enum ChainId {
  ALL = -1,
  MAINNET = 1,
  RINKEBY = 4,
  GOERLI = 5,
  BSC_MAINNET = 56,
  BSC_TESTNET = 97,
  POLYGON = 137,
  POLYGON_MUMBAI = 80001,
  POLYGON_AMOY = 80002,
  MOONBEAM = 1284,
  MOONBASE_ALPHA = 1287,
  AVALANCHE = 43114,
  AVALANCHE_TESTNET = 43113,
  CELO = 42220,
  CELO_ALFAJORES = 44787,
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
  recordingOracleFee?: string;
  reputationOracle?: string;
  reputationOracleFee?: string;
  exchangeOracle?: string;
  exchangeOracleFee?: string;
  status: EscrowStatus;
  token: string;
  totalFundedAmount: string;
  createdAt: string;
};
```

#### Parameters

• **chainId**: `ChainId`

Network in which the escrow has been deployed

• **escrowAddress**: `string`

Address of the escrow

#### Returns

`Promise`\<`EscrowData`\>

Escrow data

**Code example**

```ts
import { ChainId, EscrowUtils } from '@human-protocol/sdk';

const escrowData = new EscrowUtils.getEscrow(ChainId.POLYGON_AMOY, "0x1234567890123456789012345678901234567890");
```

#### Source

[escrow.ts:1631](https://github.com/humanprotocol/human-protocol/blob/00c0ef1cd5e15fe55363c28d74cb730c10dfa5a9/packages/sdk/typescript/human-protocol-sdk/src/escrow.ts#L1631)

***

### getEscrows()

> `static` **getEscrows**(`filter`): `Promise`\<`EscrowData`[]\>

This function returns an array of escrows based on the specified filter parameters.

**Input parameters**

```ts
interface IEscrowsFilter {
  networks: ChainId[];
  launcher?: string;
  reputationOracle?: string;
  recordingOracle?: string;
  exchangeOracle?: string;
  jobRequesterId?: string;
  status?: EscrowStatus;
  from?: Date;
  to?: Date;
}
```

```ts
enum ChainId {
  ALL = -1,
  MAINNET = 1,
  RINKEBY = 4,
  GOERLI = 5,
  BSC_MAINNET = 56,
  BSC_TESTNET = 97,
  POLYGON = 137,
  POLYGON_MUMBAI = 80001,
  POLYGON_AMOY=80002,
  MOONBEAM = 1284,
  MOONBASE_ALPHA = 1287,
  AVALANCHE = 43114,
  AVALANCHE_TESTNET = 43113,
  CELO = 42220,
  CELO_ALFAJORES = 44787,
   = 1273227453,
  LOCALHOST = 1338,
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
  recordingOracleFee?: string;
  reputationOracle?: string;
  reputationOracleFee?: string;
  exchangeOracle?: string;
  exchangeOracleFee?: string;
  status: EscrowStatus;
  token: string;
  totalFundedAmount: string;
  createdAt: string;
};
```

#### Parameters

• **filter**: `IEscrowsFilter`

Filter parameters.

#### Returns

`Promise`\<`EscrowData`[]\>

List of escrows that match the filter.

**Code example**

```ts
import { ChainId, EscrowUtils, EscrowStatus } from '@human-protocol/sdk';

const filters: IEscrowsFilter = {
  status: EscrowStatus.Pending,
  from: new Date(2023, 4, 8),
  to: new Date(2023, 5, 8),
  networks: [ChainId.POLYGON_AMOY]
};
const escrowDatas = await EscrowUtils.getEscrows(filters);
```

#### Source

[escrow.ts:1507](https://github.com/humanprotocol/human-protocol/blob/00c0ef1cd5e15fe55363c28d74cb730c10dfa5a9/packages/sdk/typescript/human-protocol-sdk/src/escrow.ts#L1507)

***

### getStatusEvents()

> `static` **getStatusEvents**(`networks`, `statuses`?, `from`?, `to`?, `launcher`?): `Promise`\<`StatusEvent`[]\>

This function returns the status events for a given set of networks within an optional date range.

> This uses Subgraph

**Input parameters**

```ts
enum ChainId {
  ALL = -1,
  MAINNET = 1,
  RINKEBY = 4,
  GOERLI = 5,
  SEPOLIA = 11155111,
  BSC_MAINNET = 56,
  BSC_TESTNET = 97,
  POLYGON = 137,
  POLYGON_MUMBAI = 80001,
  POLYGON_AMOY = 80002,
  MOONBEAM = 1284,
  MOONBASE_ALPHA = 1287,
  AVALANCHE = 43114,
  AVALANCHE_TESTNET = 43113,
  CELO = 42220,
  CELO_ALFAJORES = 44787,
  LOCALHOST = 1338,
  XLAYER_TESTNET = 195,
  XLAYER = 196,
}
```

```ts
type Status = {
  escrowAddress: string;
  timestamp: string;
  status: string;
  chainId: ChainId;
};
```

#### Parameters

• **networks**: `ChainId`[]

List of network IDs to query for status events.

• **statuses?**: `EscrowStatus`[]

Optional array of statuses to query for. If not provided, queries for all statuses.

• **from?**: `Date`

Optional start date to filter events.

• **to?**: `Date`

Optional end date to filter events.

• **launcher?**: `string`

Optional launcher address to filter events. Must be a valid Ethereum address.

#### Returns

`Promise`\<`StatusEvent`[]\>

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

#### Source

[escrow.ts:1720](https://github.com/humanprotocol/human-protocol/blob/00c0ef1cd5e15fe55363c28d74cb730c10dfa5a9/packages/sdk/typescript/human-protocol-sdk/src/escrow.ts#L1720)