<p align="center">
<a href="https://www.humanprotocol.org/"><img src="https://user-images.githubusercontent.com/104898604/201488028-2b0f29cb-c620-484f-991f-4a8b16efd7cc.png" /></a></p>

| | | | |
| --- | --- | --- | --- |
| [![Lint Check](https://github.com/humanprotocol/human-protocol/actions/workflows/ci-lint.yaml/badge.svg?branch=main)](https://github.com/humanprotocol/human-protocol/actions/workflows/ci-lint.yaml) | [![Protocol Check](https://github.com/humanprotocol/human-protocol/actions/workflows/ci-test-core.yaml/badge.svg?branch=main)](https://github.com/humanprotocol/human-protocol/actions/workflows/ci-test-core.yaml) | [![Python SDK Check](https://github.com/humanprotocol/human-protocol/actions/workflows/ci-test-python-sdk.yaml/badge.svg?branch=main)](https://github.com/humanprotocol/human-protocol/actions/workflows/ci-test-python-sdk.yaml) | [![Node.js SDK Check](https://github.com/humanprotocol/human-protocol/actions/workflows/ci-test-node-sdk.yaml/badge.svg?branch=main)](https://github.com/humanprotocol/human-protocol/actions/workflows/ci-test-node-sdk.yaml) |
| [![Subgraph Check](https://github.com/humanprotocol/human-protocol/actions/workflows/ci-test-subgraph.yaml/badge.svg?branch=main)](https://github.com/humanprotocol/human-protocol/actions/workflows/ci-test-subgraph.yaml) | [![Dashboard UI Check](https://github.com/humanprotocol/human-protocol/actions/workflows/ci-test-dashboard-ui.yaml/badge.svg?branch=main)](https://github.com/humanprotocol/human-protocol/actions/workflows/ci-test-dashboard-ui.yaml) | [![Faucet Server Check](https://github.com/humanprotocol/human-protocol/actions/workflows/ci-test-faucet-server.yaml/badge.svg?branch=main)](https://github.com/humanprotocol/human-protocol/actions/workflows/ci-test-faucet-server.yaml) | [![Meta Code Verify Check](https://github.com/humanprotocol/human-protocol/actions/workflows/ci-test-meta-code-verify.yaml/badge.svg?branch=main)](https://github.com/humanprotocol/human-protocol/actions/workflows/ci-test-meta-code-verify.yaml) |
| [![Core NPM Publish](https://github.com/humanprotocol/human-protocol/actions/workflows/cd-core.yaml/badge.svg?event=release)](https://github.com/humanprotocol/human-protocol/actions/workflows/cd-core.yaml) | [![Python SDK Publish](https://github.com/humanprotocol/human-protocol/actions/workflows/cd-python-sdk.yaml/badge.svg?event=release)](https://github.com/humanprotocol/human-protocol/actions/workflows/cd-python-sdk.yaml) | [![Node.js SDK Publish](https://github.com/humanprotocol/human-protocol/actions/workflows/cd-node-sdk.yaml/badge.svg?event=release)](https://github.com/humanprotocol/human-protocol/actions/workflows/cd-node-sdk.yaml) | [![Subgraph Deploy](https://github.com/humanprotocol/human-protocol/actions/workflows/cd-subgraph.yaml/badge.svg?branch=main)](https://github.com/humanprotocol/human-protocol/actions/workflows/cd-subgraph.yaml) |
| [![Contract Deploy](https://github.com/humanprotocol/human-protocol/actions/workflows/cd-deploy-contracts.yaml/badge.svg?event=workflow_dispatch)](https://github.com/humanprotocol/human-protocol/actions/workflows/cd-deploy-contracts.yaml) |  |  |  |


## All work on-chain

Tokenized, verified, rewarded.

Join us on [Discord](http://hmt.ai/discord)

**What is the HUMAN Network?**

HUMAN is a permissionless protocol to facilitate the exchange of HUMAN work, knowledge, and contribution.  Using HUMAN, individuals, organizations or businesses can either create or complete tasks.  These are tasks that cannot typically be automated or completed by a machine.  The types of work that are currently being completed using the HUMAN Protocol are:

* [Data labeling](https://app.humanprotocol.org/) - HUMAN is currently being used to label raw image data which can subsequently be used to train Machine Learning algorithms.
* HuFi - HuFi allows for the streamlined deployment of market-making bots, to launch campaigns and market make in a safe, transparent way.
* …

### Description

As part of our efforts to increase open source contributions we have consolidated all our codebase into a single monorepo.  This monorepo provides an easy and reliable way to  build applications that interact with the HUMAN Protocol.  It has been designed so that it can be extended to meet the requirements of a wide variety of blockchain application use-cases involving human work or contribution.  We have also included various example applications and reference implementations for the core infrastructure components that make up the HUMAN Protocol.

### Documentation

For a more detailed description of the HUMAN Protocol architecture and vision see [here](https://docs.humanprotocol.org/human-tech-docs)

### Contributing to this repository

If you're looking to contribute, check out our active projects and see where you can lend a hand:
* Contributions: Explore our [Contribution Projects](https://github.com/orgs/humanprotocol/projects/20) for areas where you can contribute.
* Bug Bounty Program: Security is a top priority for us. If you've discovered a security vulnerability, we encourage you to let us know through our [Bug Bounty Program](https://github.com/humanprotocol/bugbounty). Your efforts in making our project more secure are greatly appreciated, and rewards may be available for eligible reports.

You can find contribution guidelines in CONTRIBUTING.MD file.

### Roadmap

For those interested in the latest advancements and contributions from our core team, our [Core Project](https://github.com/orgs/humanprotocol/projects/20) is the place to be. Here, you can keep up with the progress, milestones, and updates directly from our dedicated team members.

### Project Structure

```raw
├── packages
│   ├── apps
│   │   ├── dashboard
│   │   │   ├── ui                           # A UI that queries The Graph for escrow data
│   │   │   ├── admin                        # Dashboard content admin app
│   │   ├── faucet-server                    # Faucet server
│   │   ├── fortune                          # Fortune application is test app to showcase the protocol
│   │   │   ├── exchange-oracle              # Fortune Exchange Oracle
│   │   │   ├── recording-oracle             # Fortune Recording Oracle
│   │   ├── job-launcher                     # Job launcher server, and UI
│   │   ├── human-app                        # Human App server
│   │   ├── meta-code-verify                 # Browser extensions to verify code
│   │   │                                      running in the browser against a
│   │   │                                      published manifest
│   │   ├── reputation-oracle                # Reputation Oracle server
│   ├── core                                 # EVM compatible smart contracts for HUMAN
│   ├── examples
│   │   ├── cvat                             # An open source annotation tool for labeling video and images
│   │   │   ├── exchange-oracle              # Cvat Exchange Oracle
│   │   │   ├── recording-oracle             # Cvat Recording Oracle
│   ├── sdk
│   │   ├── python
│   │   │   ├── human-protocol-sdk           # Python SDK to interact with Human Protocol
│   │   ├── typescript
│   │   │   ├── human-protocol-sdk           # Node.js SDK to interact with Human Protocol
│   │   │   ├── subgraph                     # Human Protocol Subgraph
```

### Smart contracts
To access comprehensive information about the smart contracts, please visit the following URL: https://docs.humanprotocol.org/contracts. This resource provides detailed documentation that covers various aspects of the smart contracts used within the Human Protocol ecosystem. 

Additionally, for a complete list of all our deployed contract addresses, please visit [Human Contract Addresses](https://docs.humanprotocol.org/human-tech-docs/contract-addresses). This page contains up-to-date information on the addresses of contracts deployed by the Human Protocol across different networks, ensuring developers and users alike have the essential data needed for interaction with our ecosystem.

### Join the HUMAN Network

Interested in becoming an operator within the HUMAN network? Our [technical documentation](https://docs.humanprotocol.org/human-tech-docs) provides all the necessary information on setting up operators, guiding you through the technical setup process step by step.

### Building New Applications for HUMAN ecosystem

If you're a developer interested in building on top of HUMAN, you can explore our [SDK documentation](https://sdk.humanprotocol.org/) and [tech docs](https://docs.humanprotocol.org/human-tech-docs), or take a look at our example applications:
* [Fortune](https://github.com/humanprotocol/human-protocol/tree/main/packages/apps/fortune)
* [CVAT](https://github.com/humanprotocol/human-protocol/tree/main/packages/examples/cvat)

#### Usage and Installation

Navigate to the folder that you would like to install and follow the instructions in the README file

## LEGAL NOTICE

The Protocol is an open-source, blockchain-based network that organizes, evaluates, and compensates human labor (the “Protocol”).  Your use of the Protocol is entirely at your own risk. The Protocol is available on an “as is” basis without warranties of any kind, either express or implied, including, but not limited to, warranties of merchantability, title, fitness for a particular purpose and non-infringement. You assume all risks associated with using the Protocol, and digital assets   and   decentralized   systems   generally,   including   but   not
limited to, that: (a) digital assets are highly volatile; (b) using digital assets is inherently risky due to both features of such assets and the potential unauthorized acts of third parties; (c) you may not have ready access to digital assets; and (d) you may lose some or all of your tokens or other digital assets. You agree that you will have no recourse against anyone else for any losses due to the use of the Protocol. For example, these losses may arise from or relate to: (i) incorrect   information;   (ii)   software   or   network   failures;  (iii) corrupted digital wallet files; (iv) unauthorized access; (v) errors, mistakes, or inaccuracies; or (vi) third-party activities. The Protocol does not collect any personal data, and your interaction with the Protocol will solely be through your public digital wallet address. Any personal or other data that you may make available in connection with the Protocol may not be private or secure.
