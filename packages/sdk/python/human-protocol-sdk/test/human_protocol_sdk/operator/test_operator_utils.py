import unittest
from test.human_protocol_sdk.utils import DEFAULT_GAS_PAYER
from unittest.mock import MagicMock, patch

from human_protocol_sdk.constants import NETWORKS, ChainId, Role
from human_protocol_sdk.gql.operator import (
    get_leader_query,
    get_leaders_query,
    get_reputation_network_query,
)
from human_protocol_sdk.gql.reward import get_reward_added_events_query
from human_protocol_sdk.operator import LeaderFilter, OperatorUtils


class TestOperatorUtils(unittest.TestCase):
    def test_get_leaders(self):
        filter = LeaderFilter(chain_id=ChainId.POLYGON, roles=[Role.exchange_oracle])
        mock_function = MagicMock()

        with patch(
            "human_protocol_sdk.operator.operator_utils.get_data_from_subgraph"
        ) as mock_function:
            mock_function.side_effect = [
                {
                    "data": {
                        "leaders": [
                            {
                                "id": DEFAULT_GAS_PAYER,
                                "address": DEFAULT_GAS_PAYER,
                                "amountStaked": "100",
                                "amountLocked": "25",
                                "lockedUntilTimestamp": "0",
                                "amountWithdrawn": "25",
                                "amountSlashed": "25",
                                "reward": "25",
                                "amountJobsProcessed": "25",
                                "role": "role",
                                "fee": None,
                                "publicKey": None,
                                "webhookUrl": None,
                                "website": None,
                                "url": None,
                                "jobTypes": "type1,type2",
                                "registrationNeeded": True,
                                "registrationInstructions": "www.google.com",
                                "reputationNetworks": [{"address": "0x01"}],
                                "name": "Alice",
                                "category": "machine_learning",
                            }
                        ],
                    }
                }
            ]

            leaders = OperatorUtils.get_leaders(filter)

            mock_function.assert_any_call(
                NETWORKS[ChainId.POLYGON],
                query=get_leaders_query(filter),
                params={
                    "minAmountStaked": filter.min_amount_staked,
                    "roles": filter.roles,
                    "orderBy": filter.order_by,
                    "orderDirection": filter.order_direction.value,
                    "first": filter.first,
                    "skip": filter.skip,
                },
            )

            self.assertEqual(len(leaders), 1)
            self.assertEqual(leaders[0].id, DEFAULT_GAS_PAYER)
            self.assertEqual(leaders[0].address, DEFAULT_GAS_PAYER)
            self.assertEqual(leaders[0].amount_staked, 100)
            self.assertEqual(leaders[0].amount_locked, 25)
            self.assertEqual(leaders[0].locked_until_timestamp, 0)
            self.assertEqual(leaders[0].amount_withdrawn, 25)
            self.assertEqual(leaders[0].amount_slashed, 25)
            self.assertEqual(leaders[0].reward, 25)
            self.assertEqual(leaders[0].amount_jobs_processed, 25)
            self.assertEqual(leaders[0].role, "role")
            self.assertEqual(leaders[0].fee, None)
            self.assertEqual(leaders[0].public_key, None)
            self.assertEqual(leaders[0].webhook_url, None)
            self.assertEqual(leaders[0].website, None)
            self.assertEqual(leaders[0].url, None)
            self.assertEqual(leaders[0].job_types, ["type1", "type2"])
            self.assertEqual(leaders[0].registration_needed, True)
            self.assertEqual(leaders[0].registration_instructions, "www.google.com")
            self.assertEqual(leaders[0].reputation_networks, ["0x01"])
            self.assertEqual(leaders[0].name, "Alice")
            self.assertEqual(leaders[0].category, "machine_learning")

    def test_get_leaders_when_job_types_is_none(self):
        filter = LeaderFilter(chain_id=ChainId.POLYGON, roles=[Role.exchange_oracle])
        mock_function = MagicMock()

        with patch(
            "human_protocol_sdk.operator.operator_utils.get_data_from_subgraph"
        ) as mock_function:
            mock_function.side_effect = [
                {
                    "data": {
                        "leaders": [
                            {
                                "id": DEFAULT_GAS_PAYER,
                                "address": DEFAULT_GAS_PAYER,
                                "amountStaked": "100",
                                "amountLocked": "25",
                                "lockedUntilTimestamp": "0",
                                "amountWithdrawn": "25",
                                "amountSlashed": "25",
                                "reward": "25",
                                "amountJobsProcessed": "25",
                                "role": "role",
                                "fee": None,
                                "publicKey": None,
                                "webhookUrl": None,
                                "website": None,
                                "url": None,
                                "jobTypes": None,
                                "reputationNetworks": [{"address": "0x01"}],
                                "name": "Alice",
                                "category": "machine_learning",
                            }
                        ],
                    }
                }
            ]

            leaders = OperatorUtils.get_leaders(filter)

            mock_function.assert_any_call(
                NETWORKS[ChainId.POLYGON],
                query=get_leaders_query(filter),
                params={
                    "minAmountStaked": filter.min_amount_staked,
                    "roles": filter.roles,
                    "orderBy": filter.order_by,
                    "orderDirection": filter.order_direction.value,
                    "first": filter.first,
                    "skip": filter.skip,
                },
            )

            self.assertEqual(len(leaders), 1)
            self.assertEqual(leaders[0].id, DEFAULT_GAS_PAYER)
            self.assertEqual(leaders[0].address, DEFAULT_GAS_PAYER)
            self.assertEqual(leaders[0].amount_staked, 100)
            self.assertEqual(leaders[0].amount_locked, 25)
            self.assertEqual(leaders[0].locked_until_timestamp, 0)
            self.assertEqual(leaders[0].amount_withdrawn, 25)
            self.assertEqual(leaders[0].amount_slashed, 25)
            self.assertEqual(leaders[0].reward, 25)
            self.assertEqual(leaders[0].amount_jobs_processed, 25)
            self.assertEqual(leaders[0].role, "role")
            self.assertEqual(leaders[0].fee, None)
            self.assertEqual(leaders[0].public_key, None)
            self.assertEqual(leaders[0].webhook_url, None)
            self.assertEqual(leaders[0].website, None)
            self.assertEqual(leaders[0].url, None)
            self.assertEqual(leaders[0].registration_needed, None)
            self.assertEqual(leaders[0].registration_instructions, None)
            self.assertEqual(leaders[0].job_types, [])
            self.assertEqual(leaders[0].reputation_networks, ["0x01"])
            self.assertEqual(leaders[0].name, "Alice")
            self.assertEqual(leaders[0].category, "machine_learning")

    def test_get_leaders_when_job_types_is_array(self):
        filter = LeaderFilter(chain_id=ChainId.POLYGON, roles=[Role.exchange_oracle])
        mock_function = MagicMock()

        with patch(
            "human_protocol_sdk.operator.operator_utils.get_data_from_subgraph"
        ) as mock_function:
            mock_function.side_effect = [
                {
                    "data": {
                        "leaders": [
                            {
                                "id": DEFAULT_GAS_PAYER,
                                "address": DEFAULT_GAS_PAYER,
                                "amountStaked": "100",
                                "amountLocked": "25",
                                "lockedUntilTimestamp": "0",
                                "amountWithdrawn": "25",
                                "amountSlashed": "25",
                                "reward": "25",
                                "amountJobsProcessed": "25",
                                "role": "role",
                                "fee": None,
                                "publicKey": None,
                                "webhookUrl": None,
                                "website": None,
                                "url": None,
                                "jobTypes": ["type1", "type2", "type3"],
                                "reputationNetworks": [{"address": "0x01"}],
                                "name": "Alice",
                                "category": "machine_learning",
                            }
                        ],
                    }
                }
            ]

            leaders = OperatorUtils.get_leaders(filter)

            mock_function.assert_any_call(
                NETWORKS[ChainId.POLYGON],
                query=get_leaders_query(filter),
                params={
                    "minAmountStaked": filter.min_amount_staked,
                    "roles": filter.roles,
                    "orderBy": filter.order_by,
                    "orderDirection": filter.order_direction.value,
                    "first": filter.first,
                    "skip": filter.skip,
                },
            )

            self.assertEqual(len(leaders), 1)
            self.assertEqual(leaders[0].id, DEFAULT_GAS_PAYER)
            self.assertEqual(leaders[0].address, DEFAULT_GAS_PAYER)
            self.assertEqual(leaders[0].amount_staked, 100)
            self.assertEqual(leaders[0].amount_locked, 25)
            self.assertEqual(leaders[0].locked_until_timestamp, 0)
            self.assertEqual(leaders[0].amount_withdrawn, 25)
            self.assertEqual(leaders[0].amount_slashed, 25)
            self.assertEqual(leaders[0].reward, 25)
            self.assertEqual(leaders[0].amount_jobs_processed, 25)
            self.assertEqual(leaders[0].role, "role")
            self.assertEqual(leaders[0].fee, None)
            self.assertEqual(leaders[0].public_key, None)
            self.assertEqual(leaders[0].webhook_url, None)
            self.assertEqual(leaders[0].website, None)
            self.assertEqual(leaders[0].url, None)
            self.assertEqual(
                leaders[0].job_types, ["type1", "type2", "type3"]
            )  # Should the same array
            self.assertEqual(leaders[0].reputation_networks, ["0x01"])
            self.assertEqual(leaders[0].name, "Alice")
            self.assertEqual(leaders[0].category, "machine_learning")

    def test_get_leaders_empty_data(self):
        filter = LeaderFilter(chain_id=ChainId.POLYGON, roles=[Role.exchange_oracle])
        mock_function = MagicMock()

        with patch(
            "human_protocol_sdk.operator.operator_utils.get_data_from_subgraph"
        ) as mock_function:
            mock_function.return_value = [
                {
                    "data": {
                        "leaders": None,
                    }
                }
            ]

            leaders = OperatorUtils.get_leaders(filter)

            mock_function.assert_any_call(
                NETWORKS[ChainId.POLYGON],
                query=get_leaders_query(filter),
                params={
                    "minAmountStaked": filter.min_amount_staked,
                    "roles": filter.roles,
                    "orderBy": filter.order_by,
                    "orderDirection": filter.order_direction.value,
                    "first": filter.first,
                    "skip": filter.skip,
                },
            )

            self.assertEqual(leaders, [])

    def test_get_leader(self):
        staker_address = "0x1234567890123456789012345678901234567891"

        mock_function = MagicMock()

        with patch(
            "human_protocol_sdk.operator.operator_utils.get_data_from_subgraph"
        ) as mock_function:
            mock_function.side_effect = [
                {
                    "data": {
                        "leader": {
                            "id": staker_address,
                            "address": staker_address,
                            "amountStaked": "100",
                            "amountLocked": "25",
                            "lockedUntilTimestamp": "0",
                            "amountWithdrawn": "25",
                            "amountSlashed": "25",
                            "reward": "25",
                            "amountJobsProcessed": "25",
                            "role": "role",
                            "fee": None,
                            "publicKey": None,
                            "webhookUrl": None,
                            "website": None,
                            "url": None,
                            "jobTypes": "type1,type2",
                            "registrationNeeded": True,
                            "registrationInstructions": "www.google.com",
                            "reputationNetworks": [{"address": "0x01"}],
                            "name": "Alice",
                            "category": "machine_learning",
                        }
                    }
                }
            ]

            leader = OperatorUtils.get_leader(ChainId.POLYGON, staker_address)

            mock_function.assert_any_call(
                NETWORKS[ChainId.POLYGON],
                query=get_leader_query,
                params={"address": staker_address},
            )

            self.assertNotEqual(leader, None)
            self.assertEqual(leader.id, staker_address)
            self.assertEqual(leader.address, staker_address)
            self.assertEqual(leader.amount_staked, 100)
            self.assertEqual(leader.amount_locked, 25)
            self.assertEqual(leader.locked_until_timestamp, 0)
            self.assertEqual(leader.amount_withdrawn, 25)
            self.assertEqual(leader.amount_slashed, 25)
            self.assertEqual(leader.reward, 25)
            self.assertEqual(leader.amount_jobs_processed, 25)
            self.assertEqual(leader.role, "role")
            self.assertEqual(leader.fee, None)
            self.assertEqual(leader.public_key, None)
            self.assertEqual(leader.webhook_url, None)
            self.assertEqual(leader.website, None)
            self.assertEqual(leader.url, None)
            self.assertEqual(leader.job_types, ["type1", "type2"])
            self.assertEqual(leader.registration_needed, True)
            self.assertEqual(leader.registration_instructions, "www.google.com")
            self.assertEqual(leader.reputation_networks, ["0x01"])
            self.assertEqual(leader.name, "Alice")
            self.assertEqual(leader.category, "machine_learning")

    def test_get_leader_when_job_types_is_none(self):
        staker_address = "0x1234567890123456789012345678901234567891"

        mock_function = MagicMock()

        with patch(
            "human_protocol_sdk.operator.operator_utils.get_data_from_subgraph"
        ) as mock_function:
            mock_function.side_effect = [
                {
                    "data": {
                        "leader": {
                            "id": staker_address,
                            "address": staker_address,
                            "amountStaked": "100",
                            "amountLocked": "25",
                            "lockedUntilTimestamp": "0",
                            "amountWithdrawn": "25",
                            "amountSlashed": "25",
                            "reward": "25",
                            "amountJobsProcessed": "25",
                            "role": "role",
                            "fee": None,
                            "publicKey": None,
                            "webhookUrl": None,
                            "website": None,
                            "url": None,
                            "jobTypes": None,
                            "reputationNetworks": [{"address": "0x01"}],
                            "name": "Alice",
                            "category": "machine_learning",
                        }
                    }
                }
            ]

            leader = OperatorUtils.get_leader(ChainId.POLYGON, staker_address)

            mock_function.assert_any_call(
                NETWORKS[ChainId.POLYGON],
                query=get_leader_query,
                params={"address": staker_address},
            )

            self.assertNotEqual(leader, None)
            self.assertEqual(leader.id, staker_address)
            self.assertEqual(leader.address, staker_address)
            self.assertEqual(leader.amount_staked, 100)
            self.assertEqual(leader.amount_locked, 25)
            self.assertEqual(leader.locked_until_timestamp, 0)
            self.assertEqual(leader.amount_withdrawn, 25)
            self.assertEqual(leader.amount_slashed, 25)
            self.assertEqual(leader.reward, 25)
            self.assertEqual(leader.amount_jobs_processed, 25)
            self.assertEqual(leader.role, "role")
            self.assertEqual(leader.fee, None)
            self.assertEqual(leader.public_key, None)
            self.assertEqual(leader.webhook_url, None)
            self.assertEqual(leader.website, None)
            self.assertEqual(leader.url, None)
            self.assertEqual(leader.job_types, [])
            self.assertEqual(leader.registration_needed, None)
            self.assertEqual(leader.registration_instructions, None)
            self.assertEqual(leader.reputation_networks, ["0x01"])
            self.assertEqual(leader.name, "Alice")
            self.assertEqual(leader.category, "machine_learning")

    def test_get_leader_when_job_types_is_array(self):
        staker_address = "0x1234567890123456789012345678901234567891"

        mock_function = MagicMock()

        with patch(
            "human_protocol_sdk.operator.operator_utils.get_data_from_subgraph"
        ) as mock_function:
            mock_function.side_effect = [
                {
                    "data": {
                        "leader": {
                            "id": staker_address,
                            "address": staker_address,
                            "amountStaked": "100",
                            "amountLocked": "25",
                            "lockedUntilTimestamp": "0",
                            "amountWithdrawn": "25",
                            "amountSlashed": "25",
                            "reward": "25",
                            "amountJobsProcessed": "25",
                            "role": "role",
                            "fee": None,
                            "publicKey": None,
                            "webhookUrl": None,
                            "website": None,
                            "url": None,
                            "jobTypes": ["type1", "type2", "type3"],
                            "reputationNetworks": [{"address": "0x01"}],
                            "name": "Alice",
                            "category": "machine_learning",
                        }
                    }
                }
            ]

            leader = OperatorUtils.get_leader(ChainId.POLYGON, staker_address)

            mock_function.assert_any_call(
                NETWORKS[ChainId.POLYGON],
                query=get_leader_query,
                params={"address": staker_address},
            )

            self.assertNotEqual(leader, None)
            self.assertEqual(leader.id, staker_address)
            self.assertEqual(leader.address, staker_address)
            self.assertEqual(leader.amount_staked, 100)
            self.assertEqual(leader.amount_locked, 25)
            self.assertEqual(leader.locked_until_timestamp, 0)
            self.assertEqual(leader.amount_withdrawn, 25)
            self.assertEqual(leader.amount_slashed, 25)
            self.assertEqual(leader.reward, 25)
            self.assertEqual(leader.amount_jobs_processed, 25)
            self.assertEqual(leader.role, "role")
            self.assertEqual(leader.fee, None)
            self.assertEqual(leader.public_key, None)
            self.assertEqual(leader.webhook_url, None)
            self.assertEqual(leader.website, None)
            self.assertEqual(leader.url, None)
            self.assertEqual(leader.job_types, ["type1", "type2", "type3"])
            self.assertEqual(leader.reputation_networks, ["0x01"])
            self.assertEqual(leader.name, "Alice")
            self.assertEqual(leader.category, "machine_learning")

    def test_get_leader_empty_data(self):
        staker_address = "0x1234567890123456789012345678901234567891"

        mock_function = MagicMock()

        with patch(
            "human_protocol_sdk.operator.operator_utils.get_data_from_subgraph"
        ) as mock_function:
            mock_function.return_value = [{"data": {"leader": None}}]

            leader = OperatorUtils.get_leader(ChainId.POLYGON, staker_address)

            mock_function.assert_any_call(
                NETWORKS[ChainId.POLYGON],
                query=get_leader_query,
                params={"address": staker_address},
            )

            self.assertEqual(leader, None)

    def test_get_reputation_network_operators(self):
        reputation_address = "0x1234567890123456789012345678901234567891"
        operator_address = "0x1234567890123456789012345678901234567891"
        role = "Job Launcher"
        url = "https://example.com"
        job_types = "type1,type2"

        mock_function = MagicMock()

        with patch(
            "human_protocol_sdk.operator.operator_utils.get_data_from_subgraph"
        ) as mock_function:
            mock_function.side_effect = [
                {
                    "data": {
                        "reputationNetwork": {
                            "id": reputation_address,
                            "address": reputation_address,
                            "operators": [
                                {
                                    "address": operator_address,
                                    "role": role,
                                    "url": url,
                                    "jobTypes": job_types,
                                    "registrationNeeded": True,
                                    "registrationInstructions": url,
                                }
                            ],
                        }
                    }
                }
            ]

            operators = OperatorUtils.get_reputation_network_operators(
                ChainId.POLYGON, reputation_address
            )

        mock_function.assert_any_call(
            NETWORKS[ChainId.POLYGON],
            query=get_reputation_network_query(None),
            params={"address": reputation_address, "role": None},
        )

        self.assertNotEqual(operators, [])
        self.assertEqual(operators[0].address, operator_address)
        self.assertEqual(operators[0].role, role)
        self.assertEqual(operators[0].url, url)
        self.assertEqual(operators[0].job_types, ["type1", "type2"])
        self.assertEqual(operators[0].registration_needed, True)
        self.assertEqual(operators[0].registration_instructions, url)

    def test_get_reputation_network_operators_when_job_types_is_none(self):
        reputation_address = "0x1234567890123456789012345678901234567891"
        operator_address = "0x1234567890123456789012345678901234567891"
        role = "Job Launcher"
        url = "https://example.com"
        job_types = None

        mock_function = MagicMock()

        with patch(
            "human_protocol_sdk.operator.operator_utils.get_data_from_subgraph"
        ) as mock_function:
            mock_function.side_effect = [
                {
                    "data": {
                        "reputationNetwork": {
                            "id": reputation_address,
                            "address": reputation_address,
                            "operators": [
                                {
                                    "address": operator_address,
                                    "role": role,
                                    "url": url,
                                    "jobTypes": job_types,
                                    "registrationNeeded": True,
                                    "registrationInstructions": url,
                                }
                            ],
                        }
                    }
                }
            ]

            operators = OperatorUtils.get_reputation_network_operators(
                ChainId.POLYGON, reputation_address
            )

        mock_function.assert_any_call(
            NETWORKS[ChainId.POLYGON],
            query=get_reputation_network_query(None),
            params={"address": reputation_address, "role": None},
        )

        self.assertNotEqual(operators, [])
        self.assertEqual(operators[0].address, operator_address)
        self.assertEqual(operators[0].role, role)
        self.assertEqual(operators[0].url, url)
        self.assertEqual(operators[0].job_types, [])
        self.assertEqual(operators[0].registration_needed, True)
        self.assertEqual(operators[0].registration_instructions, url)

    def test_get_reputation_network_operators_when_job_types_is_array(self):
        reputation_address = "0x1234567890123456789012345678901234567891"
        operator_address = "0x1234567890123456789012345678901234567891"
        role = "Job Launcher"
        url = "https://example.com"
        job_types = ["type1", "type2", "type3"]

        mock_function = MagicMock()

        with patch(
            "human_protocol_sdk.operator.operator_utils.get_data_from_subgraph"
        ) as mock_function:
            mock_function.side_effect = [
                {
                    "data": {
                        "reputationNetwork": {
                            "id": reputation_address,
                            "address": reputation_address,
                            "operators": [
                                {
                                    "address": operator_address,
                                    "role": role,
                                    "url": url,
                                    "jobTypes": job_types,
                                    "registrationNeeded": True,
                                    "registrationInstructions": url,
                                }
                            ],
                        }
                    }
                }
            ]

            operators = OperatorUtils.get_reputation_network_operators(
                ChainId.POLYGON, reputation_address
            )

        mock_function.assert_any_call(
            NETWORKS[ChainId.POLYGON],
            query=get_reputation_network_query(None),
            params={"address": reputation_address, "role": None},
        )

        self.assertNotEqual(operators, [])
        self.assertEqual(operators[0].address, operator_address)
        self.assertEqual(operators[0].role, role)
        self.assertEqual(operators[0].url, url)
        self.assertEqual(operators[0].job_types, ["type1", "type2", "type3"])
        self.assertEqual(operators[0].registration_needed, True)
        self.assertEqual(operators[0].registration_instructions, url)

    def test_get_reputation_network_operators_empty_data(self):
        reputation_address = "0x1234567890123456789012345678901234567891"

        mock_function = MagicMock()

        with patch(
            "human_protocol_sdk.operator.operator_utils.get_data_from_subgraph"
        ) as mock_function:
            mock_function.return_value = [{"data": {"reputationNetwork": None}}]

            operators = OperatorUtils.get_reputation_network_operators(
                ChainId.POLYGON, reputation_address
            )

        mock_function.assert_any_call(
            NETWORKS[ChainId.POLYGON],
            query=get_reputation_network_query(None),
            params={"address": reputation_address, "role": None},
        )

        self.assertEqual(operators, [])

    def test_get_rewards_info(self):
        slasher = "0x1234567890123456789012345678901234567891"

        mock_function = MagicMock()
        with patch(
            "human_protocol_sdk.operator.operator_utils.get_data_from_subgraph"
        ) as mock_function:
            mock_function.return_value = {
                "data": {
                    "rewardAddedEvents": [
                        {
                            "escrowAddress": "escrow1",
                            "amount": 10,
                        },
                        {
                            "escrowAddress": "escrow2",
                            "amount": 20,
                        },
                    ]
                }
            }
            rewards_info = OperatorUtils.get_rewards_info(ChainId.POLYGON, slasher)

            mock_function.assert_called_once_with(
                NETWORKS[ChainId.POLYGON],
                query=get_reward_added_events_query,
                params={"slasherAddress": slasher},
            )

            self.assertEqual(len(rewards_info), 2)
            self.assertEqual(rewards_info[0].escrow_address.lower(), "escrow1")
            self.assertEqual(rewards_info[0].amount, 10)
            self.assertEqual(rewards_info[1].escrow_address.lower(), "escrow2")
            self.assertEqual(rewards_info[1].amount, 20)

    def test_get_rewards_info_empty_data(self):
        slasher = "0x1234567890123456789012345678901234567891"

        mock_function = MagicMock()
        with patch(
            "human_protocol_sdk.operator.operator_utils.get_data_from_subgraph"
        ) as mock_function:
            mock_function.return_value = {"data": {"rewardAddedEvents": None}}
            rewards_info = OperatorUtils.get_rewards_info(ChainId.POLYGON, slasher)

            mock_function.assert_called_once_with(
                NETWORKS[ChainId.POLYGON],
                query=get_reward_added_events_query,
                params={"slasherAddress": slasher},
            )

            self.assertEqual(rewards_info, [])


if __name__ == "__main__":
    unittest.main(exit=True)
