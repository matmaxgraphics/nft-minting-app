# NFT Minting DApp

A minimal, frontend-first NFT minting application that allows users to:

* Upload an image
* Store the image and metadata on IPFS (via Pinata)
* Mint an ERC-721 NFT on-chain using the generated metadata URI
* View the minted NFT immediately after minting

The project is intentionally kept **bare-bones** to focus on fundamentals rather than UI complexity.

---

## Features

* Frontend-first architecture (UI → IPFS → Smart Contract)
* ERC-721 NFT using OpenZeppelin
* Metadata + image storage on IPFS (Pinata)
* Mint price enforced on-chain
* Duplicate metadata prevention
* Displays minted NFT (image, name, description, token ID)
* Modern stack (Hardhat v3, ethers v6, Next.js)

---

## Tech Stack

### Frontend

* Next.js (Pages Router)
* React
* ethers v6
* Plain HTML / minimal inline styles

### Backend

* Next.js API Routes
* Pinata IPFS API

### Smart Contracts

* Solidity ^0.8.21
* OpenZeppelin Contracts
* Hardhat v3

---

## Project Structure

```
├── abi/
│   └── MyNFT.json
├── contracts/
│   └── MyNFT.sol
├── lib/
│   └── contract.ts
├── app/
│   ├── api/
│   │   └── upload.ts
│   └── mint
│       └── page.tsx
├── scripts/
│   └── deploy.ts
├── .env.local
├── hardhat.config.ts
└── README.md
```

---

## Smart Contract Overview

**Contract:** `MyNFT`

### Key Properties

* ERC-721 with URI storage
* Configurable mint price
* Prevents duplicate metadata minting

### Mint Function

```solidity
function mint(address to, string memory uri) public payable returns (uint256)
```

* Requires ETH >= `mintPrice`
* Reverts if metadata URI has already been minted
* Mints NFT and assigns metadata URI

---

## Frontend Flow

1. User selects image
2. User enters name and description
3. Image is uploaded to Pinata (IPFS)
4. Metadata JSON is generated and uploaded
5. Metadata URI is returned
6. Wallet connects via MetaMask
7. `mint()` is called on the smart contract
8. NFT is minted and displayed in UI

---

## Environment Variables

Create a `.env.local` file:

```
PINATA_JWT=your_pinata_jwt_here
```

> The Pinata JWT is used only in the backend API route and is never exposed to the frontend.

---

## Installation & Setup

### 1. Install Dependencies

```
npm install
```

Frontend-specific:

```
npm install ethers
```

Smart contract dependencies:

```
npm install --save-dev hardhat @nomicfoundation/hardhat-ethers
npm install @openzeppelin/contracts
```

---

### 2. Compile Contracts

```
npx hardhat compile
```

---

### 3. Deploy Contract

```
npx hardhat run scripts/deploy.ts --network hardhat
```

Copy the deployed contract address and update:

```ts
// lib/contract.ts
export const CONTRACT_ADDRESS = "YOUR_DEPLOYED_ADDRESS";
```

Copy ABI:

```
artifacts/contracts/MyNFT.sol/MyNFT.json → abi/MyNFT.json
```

---

### 4. Run Frontend

```
npm run dev
```

Open:

```
http://localhost:3000/mint
```

---

## Mint Price

* Default mint price: `0.001 ETH`
* Enforced on-chain
* Can be updated by the contract owner via `setMintPrice`

---

## Duplicate Metadata Protection

* Metadata URI is hashed using `keccak256`
* Each hash can only be minted once
* Prevents duplicate NFTs with identical metadata

---

## Notes

* Ensure MetaMask is connected to the same network the contract is deployed on
* NFT visibility in wallets may require contract verification on testnet explorers
* IPFS links use Pinata gateway for preview

---

## Possible Improvements

* Dynamic mint price fetching from contract
* Withdraw function for mint funds
* Wallet-based mint limits
* NFT gallery page
* ERC-721A for batch minting
* Testnet deployment (Sepolia) + verification

---

## License

MIT
