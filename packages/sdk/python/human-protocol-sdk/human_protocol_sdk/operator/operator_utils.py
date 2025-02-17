"""
Utility class for operator-related operations.

Code Example
------------

.. code-block:: python

    from human_protocol_sdk.constants import ChainId
    from human_protocol_sdk.operator import OperatorUtils, LeaderFilter

    print(
        OperatorUtils.get_leaders(
            LeaderFilter(chain_id=ChainId.POLYGON_AMOY, roles=["Job Launcher"])
        )
    )

Module
------
"""

import logging
import os
from typing import List, Optional

from human_protocol_sdk.constants import NETWORKS, ChainId, OrderDirection
from human_protocol_sdk.gql.reward import get_reward_added_events_query
from human_protocol_sdk.utils import get_data_from_subgraph
from web3 import Web3

LOG = logging.getLogger("human_protocol_sdk.operator")


class OperatorUtilsError(Exception):
    """
    Raised when an error occurs while interacting with the operator.
    """

    pass


class LeaderFilter:
    """
    A class used to filter leaders.
    """

    def __init__(
        self,
        chain_id: ChainId,
        roles: Optional[str] = [],
        min_amount_staked: int = None,
        order_by: Optional[str] = None,
        order_direction: OrderDirection = OrderDirection.DESC,
        first: int = 10,
        skip: int = 0,
    ):
        """
        Initializes a LeaderFilter instance.

        :param chain_id: Chain ID to request data
        :param roles: Roles to filter by
        :param min_amount_staked: Minimum amount staked to filter by
        :param order_by: Property to order by, e.g., "role"
        :param order_direction: Order direction of results, "asc" or "desc"
        :param first: Number of items per page
        :param skip: Number of items to skip (for pagination)
        """

        if chain_id not in ChainId:
            raise OperatorUtilsError("Invalid ChainId")

        if order_direction.value not in set(
            order_direction.value for order_direction in OrderDirection
        ):
            raise OperatorUtilsError("Invalid order direction")

        self.chain_id = chain_id
        self.roles = roles
        self.min_amount_staked = min_amount_staked
        self.order_by = order_by
        self.order_direction = order_direction
        self.first = min(max(first, 1), 1000)
        self.skip = max(skip, 0)


class LeaderData:
    def __init__(
        self,
        chain_id: ChainId,
        id: str,
        address: str,
        amount_staked: int,
        amount_locked: int,
        locked_until_timestamp: int,
        amount_withdrawn: int,
        amount_slashed: int,
        reward: int,
        amount_jobs_processed: int,
        role: Optional[str] = None,
        fee: Optional[int] = None,
        public_key: Optional[str] = None,
        webhook_url: Optional[str] = None,
        website: Optional[str] = None,
        url: Optional[str] = None,
        job_types: Optional[List[str]] = None,
        registration_needed: Optional[bool] = None,
        registration_instructions: Optional[str] = None,
        reputation_networks: Optional[List[str]] = None,
        name: Optional[str] = None,
        category: Optional[str] = None,
    ):
        """
        Initializes a LeaderData instance.

        :param chain_id: Chain Identifier
        :param id: Identifier
        :param address: Address
        :param amount_staked: Amount staked
        :param amount_locked: Amount locked
        :param locked_until_timestamp: Locked until timestamp
        :param amount_withdrawn: Amount withdrawn
        :param amount_slashed: Amount slashed
        :param reward: Reward
        :param amount_jobs_processed: Amount of jobs launched
        :param role: Role
        :param fee: Fee
        :param public_key: Public key
        :param webhook_url: Webhook URL
        :param website: Website URL
        :param url: URL
        :param job_types: Job types
        :param registration_needed: Whether registration is needed
        :param registration_instructions: Registration instructions
        :param reputation_networks: List of reputation networks
        :param name: Name
        :param category: Category
        """

        self.chain_id = chain_id
        self.id = id
        self.address = address
        self.amount_staked = amount_staked
        self.amount_locked = amount_locked
        self.locked_until_timestamp = locked_until_timestamp
        self.amount_withdrawn = amount_withdrawn
        self.amount_slashed = amount_slashed
        self.reward = reward
        self.amount_jobs_processed = amount_jobs_processed
        self.role = role
        self.fee = fee
        self.public_key = public_key
        self.webhook_url = webhook_url
        self.website = website
        self.url = url
        self.job_types = job_types
        self.registration_needed = registration_needed
        self.registration_instructions = registration_instructions
        self.reputation_networks = reputation_networks
        self.name = name
        self.category = category


class RewardData:
    def __init__(
        self,
        escrow_address: str,
        amount: int,
    ):
        """
        Initializes a RewardData instance.

        :param escrow_address: Escrow address
        :param amount: Amount
        """

        self.escrow_address = escrow_address
        self.amount = amount


class Operator:
    def __init__(
        self,
        address: str,
        role: str,
        url: str = "",
        job_types: List[str] = [],
        registration_needed: Optional[bool] = None,
        registration_instructions: Optional[str] = None,
    ):
        """
        Initializes an Operator instance.

        :param address: Operator address
        :param role: Role of the operator
        :param url: URL of the operator
        :param job_types: List of job types
        :param registration_needed: Whether registration is needed
        :param registration_instructions: Registration instructions
        """

        self.address = address
        self.role = role
        self.url = url
        self.job_types = job_types
        self.registration_needed = registration_needed
        self.registration_instructions = registration_instructions


class OperatorUtils:
    """
    A utility class that provides additional operator-related functionalities.
    """

    @staticmethod
    def get_leaders(filter: LeaderFilter) -> List[LeaderData]:
        """Get leaders data of the protocol.

        :param filter: Leader filter

        :return: List of leaders data

        :example:
            .. code-block:: python

                from human_protocol_sdk.constants import ChainId
                from human_protocol_sdk.operator import OperatorUtils, LeaderFilter

                print(
                    OperatorUtils.get_leaders(
                        LeaderFilter(chain_id=ChainId.POLYGON_AMOY, roles=["Job Launcher"])
                    )
                )
        """

        from human_protocol_sdk.gql.operator import get_leaders_query

        leaders = []
        network = NETWORKS[filter.chain_id]

        if not network.get("subgraph_url"):
            return []

        leaders_data = get_data_from_subgraph(
            network,
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

        if (
            not leaders_data
            or "data" not in leaders_data
            or "leaders" not in leaders_data["data"]
            or not leaders_data["data"]["leaders"]
        ):
            return []

        leaders_raw = leaders_data["data"]["leaders"]

        for leader in leaders_raw:
            job_types = []
            reputation_networks = []

            if isinstance(leader.get("jobTypes"), str):
                job_types = leader["jobTypes"].split(",")
            elif isinstance(leader.get("jobTypes"), list):
                job_types = leader["jobTypes"]

            if leader.get("reputationNetworks") and isinstance(
                leader.get("reputationNetworks"), list
            ):
                reputation_networks = [
                    network["address"] for network in leader["reputationNetworks"]
                ]

            leaders.append(
                LeaderData(
                    chain_id=filter.chain_id,
                    id=leader.get("id", ""),
                    address=leader.get("address", ""),
                    amount_staked=int(leader.get("amountStaked", 0)),
                    amount_locked=int(leader.get("amountLocked", 0)),
                    locked_until_timestamp=int(leader.get("lockedUntilTimestamp", 0)),
                    amount_withdrawn=int(leader.get("amountWithdrawn", 0)),
                    amount_slashed=int(leader.get("amountSlashed", 0)),
                    reward=int(leader.get("reward", 0)),
                    amount_jobs_processed=int(leader.get("amountJobsProcessed", 0)),
                    role=leader.get("role", None),
                    fee=int(leader.get("fee")) if leader.get("fee", None) else None,
                    public_key=leader.get("publicKey", None),
                    webhook_url=leader.get("webhookUrl", None),
                    website=leader.get("website", None),
                    url=leader.get("url", None),
                    job_types=(
                        leader.get("jobTypes").split(",")
                        if isinstance(leader.get("jobTypes"), str)
                        else (
                            leader.get("jobTypes", [])
                            if isinstance(leader.get("jobTypes"), list)
                            else []
                        )
                    ),
                    registration_needed=leader.get("registrationNeeded", None),
                    registration_instructions=leader.get(
                        "registrationInstructions", None
                    ),
                    reputation_networks=reputation_networks,
                    name=leader.get("name", None),
                    category=leader.get("category", None),
                )
            )

        return leaders

    @staticmethod
    def get_leader(
        chain_id: ChainId,
        leader_address: str,
    ) -> Optional[LeaderData]:
        """Gets the leader details.

        :param chain_id: Network in which the leader exists
        :param leader_address: Address of the leader

        :return: Leader data if exists, otherwise None

        :example:
            .. code-block:: python

                from human_protocol_sdk.constants import ChainId
                from human_protocol_sdk.operator import OperatorUtils

                chain_id = ChainId.POLYGON_AMOY
                leader_address = '0x62dD51230A30401C455c8398d06F85e4EaB6309f'

                leader_data = OperatorUtils.get_leader(chain_id, leader_address)
                print(leader_data)
        """

        from human_protocol_sdk.gql.operator import get_leader_query

        if chain_id.value not in set(chain_id.value for chain_id in ChainId):
            raise OperatorUtilsError(f"Invalid ChainId")

        if not Web3.is_address(leader_address):
            raise OperatorUtilsError(f"Invalid leader address: {leader_address}")

        network = NETWORKS[chain_id]

        leader_data = get_data_from_subgraph(
            network,
            query=get_leader_query,
            params={"address": leader_address.lower()},
        )

        if (
            not leader_data
            or "data" not in leader_data
            or "leader" not in leader_data["data"]
            or not leader_data["data"]["leader"]
        ):
            return None

        leader = leader_data["data"]["leader"]

        job_types = []
        reputation_networks = []

        if isinstance(leader.get("jobTypes"), str):
            job_types = leader["jobTypes"].split(",")
        elif isinstance(leader.get("jobTypes"), list):
            job_types = leader["jobTypes"]

        if leader.get("reputationNetworks") and isinstance(
            leader.get("reputationNetworks"), list
        ):
            reputation_networks = [
                network["address"] for network in leader["reputationNetworks"]
            ]

        return LeaderData(
            chain_id=chain_id,
            id=leader.get("id", ""),
            address=leader.get("address", ""),
            amount_staked=int(leader.get("amountStaked", 0)),
            amount_locked=int(leader.get("amountLocked", 0)),
            locked_until_timestamp=int(leader.get("lockedUntilTimestamp", 0)),
            amount_withdrawn=int(leader.get("amountWithdrawn", 0)),
            amount_slashed=int(leader.get("amountSlashed", 0)),
            reward=int(leader.get("reward", 0)),
            amount_jobs_processed=int(leader.get("amountJobsProcessed", 0)),
            role=leader.get("role", None),
            fee=int(leader.get("fee")) if leader.get("fee", None) else None,
            public_key=leader.get("publicKey", None),
            webhook_url=leader.get("webhookUrl", None),
            website=leader.get("website", None),
            url=leader.get("url", None),
            job_types=(
                leader.get("jobTypes").split(",")
                if isinstance(leader.get("jobTypes"), str)
                else (
                    leader.get("jobTypes", [])
                    if isinstance(leader.get("jobTypes"), list)
                    else []
                )
            ),
            registration_needed=leader.get("registrationNeeded", None),
            registration_instructions=leader.get("registrationInstructions", None),
            reputation_networks=reputation_networks,
            name=leader.get("name", None),
            category=leader.get("category", None),
        )

    @staticmethod
    def get_reputation_network_operators(
        chain_id: ChainId,
        address: str,
        role: Optional[str] = None,
    ) -> List[Operator]:
        """Get the reputation network operators of the specified address.

        :param chain_id: Network in which the reputation network exists
        :param address: Address of the reputation oracle
        :param role: (Optional) Role of the operator

        :return: Returns an array of operator details

        :example:
            .. code-block:: python

                from human_protocol_sdk.constants import ChainId
                from human_protocol_sdk.operator import OperatorUtils

                operators = OperatorUtils.get_reputation_network_operators(
                    ChainId.POLYGON_AMOY,
                    '0x62dD51230A30401C455c8398d06F85e4EaB6309f'
                )
                print(operators)
        """

        from human_protocol_sdk.gql.operator import get_reputation_network_query

        if chain_id.value not in set(chain_id.value for chain_id in ChainId):
            raise OperatorUtilsError(f"Invalid ChainId")

        if not Web3.is_address(address):
            raise OperatorUtilsError(f"Invalid reputation address: {address}")

        network = NETWORKS[chain_id]

        reputation_network_data = get_data_from_subgraph(
            network,
            query=get_reputation_network_query(role),
            params={"address": address.lower(), "role": role},
        )

        if (
            not reputation_network_data
            or "data" not in reputation_network_data
            or "reputationNetwork" not in reputation_network_data["data"]
            or not reputation_network_data["data"]["reputationNetwork"]
        ):
            return []

        operators = reputation_network_data["data"]["reputationNetwork"]["operators"]

        return [
            Operator(
                address=operator.get("address", ""),
                role=operator.get("role", ""),
                url=operator.get("url", ""),
                job_types=(
                    operator.get("jobTypes").split(",")
                    if isinstance(operator.get("jobTypes"), str)
                    else (
                        operator.get("jobTypes", [])
                        if isinstance(operator.get("jobTypes"), list)
                        else []
                    )
                ),
                registration_needed=operator.get("registrationNeeded", ""),
                registration_instructions=operator.get("registrationInstructions", ""),
            )
            for operator in operators
        ]

    @staticmethod
    def get_rewards_info(chain_id: ChainId, slasher: str) -> List[RewardData]:
        """Get rewards of the given slasher.

        :param chain_id: Network in which the slasher exists
        :param slasher: Address of the slasher

        :return: List of rewards info

        :example:
            .. code-block:: python

                from human_protocol_sdk.constants import ChainId
                from human_protocol_sdk.operator import OperatorUtils

                rewards_info = OperatorUtils.get_rewards_info(
                    ChainId.POLYGON_AMOY,
                    '0x62dD51230A30401C455c8398d06F85e4EaB6309f'
                )
                print(rewards_info)
        """

        if chain_id.value not in set(chain_id.value for chain_id in ChainId):
            raise OperatorUtilsError(f"Invalid ChainId")

        if not Web3.is_address(slasher):
            raise OperatorUtilsError(f"Invalid slasher address: {slasher}")

        network = NETWORKS[chain_id]

        reward_added_events_data = get_data_from_subgraph(
            network,
            query=get_reward_added_events_query,
            params={"slasherAddress": slasher.lower()},
        )

        if (
            not reward_added_events_data
            or "data" not in reward_added_events_data
            or "rewardAddedEvents" not in reward_added_events_data["data"]
            or not reward_added_events_data["data"]["rewardAddedEvents"]
        ):
            return []

        reward_added_events = reward_added_events_data["data"]["rewardAddedEvents"]

        return [
            RewardData(
                escrow_address=reward_added_event.get("escrowAddress", ""),
                amount=int(reward_added_event.get("amount", 0)),
            )
            for reward_added_event in reward_added_events
        ]
