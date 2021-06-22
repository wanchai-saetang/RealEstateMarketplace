# Real Estate Marketplace project (Udacity Capstone projects)

Real Estate Marketplace project for buying and selling house, by using zk-SNARKs (Zokrates) to approve token.
For learning Blockchain, zk-SNARKs, NFT, and ERC721 concepts.

## Information

- Contract Address: 0xaeF4901BEBf274DEf8488D04E308889AF8d74DaF
- Contract ABI: eth-contracts/build/contracts/SolnSquareVerifier.json
- OpenSea TestNet: https://testnets.opensea.io/collection/real-estate-dv13c19a2s

## Truffle version

- Truffle v5.3.9 (core: 5.3.9)
- Solidity - 0.6.9 (solc-js)
- Node v14.17.0
- Web3.js v1.3.6

## Installation

Open your terminal and type in

```sh
$ git clone https://github.com/wanchai-saetang/RealEstateMarketplace.git
$ cd eth-contracts
$ npm i
$ ganache-cli
$ truffle migrate --network=<network name in truffle-config.js>
(for testing, please look at test/ directory)
$ truffle console
$ compile
$ migrate
$ test
```

## Main Directory & Main Files

```text
├── eth-contracts
│   ├── contracts
│   │   ├── ERC721Mintable.sol
│   │   ├── provableAPI_0.6.sol
│   │   ├── SolnSquareVerifier.sol
│   │   └── verifier.sol
│   ├── test
│   │   ├── TestERC721Mintable.sol
│   │   ├── TestSolnSquareVerifier.sol
│   │   └── TestSquareVerifier.sol
├── zokrates
│   └── proof.json
└── README.md
```

## Notes

- There are files called minttoken.html and minttoken.js in eth-contract directory.
- Run npm run mint to start minttoken.html for test mint some token using Metamask.
- Using provableAPI_0.6.sol instead of Oraclize due to it's name have been changed and I want to use latest version as possible.
