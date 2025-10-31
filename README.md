# ZCraft - Encrypted Grid Selection dApp

A privacy-preserving decentralized application that enables users to make private on-chain selections using Fully Homomorphic Encryption (FHE). Built on Zama's FHEVM protocol, this project demonstrates how blockchain applications can maintain complete data privacy while remaining fully transparent and verifiable.

## 🎯 Project Overview

ZCraft is a production-ready implementation of an encrypted grid selection system where users can select cells in a 4×4 grid, encrypt their choices using FHE technology, and store the encrypted data on Ethereum's blockchain. The encrypted data remains private and can only be decrypted by the original user, while still being verifiable on-chain.

This project serves as both a demonstration of FHEVM capabilities and a practical template for building privacy-preserving dApps that require confidential user inputs.

## ✨ Key Features

### Privacy-First Architecture
- **End-to-End Encryption**: All user selections are encrypted client-side before being submitted to the blockchain
- **Zero-Knowledge Privacy**: Smart contracts process encrypted data without ever seeing the underlying values
- **User-Controlled Decryption**: Only the user who created the selection can decrypt and view their data
- **On-Chain Confidentiality**: Encrypted data is stored on-chain while maintaining complete privacy

### Advanced Cryptographic Features
- **Fully Homomorphic Encryption**: Leverage Zama's FHEVM to perform computations on encrypted data
- **Efficient Bitmask Encoding**: Uses 16-bit encrypted integers to represent 4×4 grid selections compactly
- **Secure Key Management**: Client-side keypair generation for secure decryption
- **EIP-712 Signatures**: Implements typed structured data signing for enhanced security

### User Experience
- **Modern React UI**: Clean, responsive interface built with React 19 and TypeScript
- **Wallet Integration**: Seamless connection via RainbowKit supporting multiple wallet providers
- **Real-Time Feedback**: Live status updates during encryption, transaction submission, and decryption
- **Grid Visualization**: Interactive 4×4 grid with visual feedback for cell selection
- **Transaction Transparency**: Clear display of encrypted handles and decrypted results

### Developer-Friendly
- **Type-Safe Contracts**: Full TypeScript support with auto-generated contract types
- **Comprehensive Testing**: Unit tests covering all contract functionality
- **Hardhat Integration**: Professional development environment with deployment scripts
- **Modular Architecture**: Clean separation between contract logic, frontend, and utilities

## 🔧 Technologies Used

### Blockchain & Smart Contracts
- **Solidity 0.8.27**: Latest stable version with Cancun EVM support
- **FHEVM (@fhevm/solidity ^0.8.0)**: Zama's Fully Homomorphic Encryption library
- **Hardhat 2.26.0**: Ethereum development environment
- **Ethers.js 6.15.0**: Ethereum wallet implementation and contract interaction
- **Encrypted Types (^0.0.4)**: Type definitions for FHE encrypted values

### Frontend Framework
- **React 19.1.1**: Latest React with improved performance and concurrent features
- **TypeScript 5.8.3**: Type-safe JavaScript for better code quality
- **Vite 7.1.6**: Next-generation frontend build tool for blazing-fast development
- **Wagmi 2.17.0**: React hooks for Ethereum wallet integration
- **RainbowKit 2.2.8**: Beautiful wallet connection UI
- **TanStack Query 5.89.0**: Powerful data synchronization for React

### Development Tools
- **Hardhat Deploy (0.11.45)**: Deployment management and contract versioning
- **TypeChain (8.3.2)**: TypeScript bindings for Ethereum smart contracts
- **Hardhat Ethers Plugin**: Seamless integration between Hardhat and Ethers.js
- **Solhint & ESLint**: Code linting for Solidity and TypeScript
- **Prettier**: Code formatting for consistent style
- **Mocha & Chai**: Testing framework and assertion library

### Cryptography & Security
- **Zama FHE Protocol**: Fully Homomorphic Encryption for blockchain
- **Zama Relayer SDK (0.3.0)**: Client-side encryption and decryption utilities
- **EIP-712**: Typed structured data hashing and signing
- **Infura**: Reliable Ethereum node infrastructure

### Infrastructure
- **Ethereum Sepolia Testnet**: Testing environment for smart contracts
- **Netlify**: Frontend hosting with automatic deployments
- **GitHub**: Version control and collaboration

## 🚀 Problems Solved

### 1. On-Chain Privacy Paradox
**Problem**: Traditional blockchain applications face a fundamental dilemma - all data stored on-chain is publicly visible, making it impossible to build applications that require user privacy while maintaining transparency.

**Solution**: ZCraft leverages Fully Homomorphic Encryption to enable private data storage on public blockchains. Users' selections remain completely confidential while still being verifiable and stored on-chain, solving the privacy-transparency paradox.

### 2. Private Voting and Selection Systems
**Problem**: Implementing fair voting or selection systems on blockchain is challenging because vote visibility before counting can influence outcomes, and traditional solutions require trusted third parties.

**Solution**: This project demonstrates how FHE can be used to build trustless private voting or selection systems where choices remain encrypted until reveal time, with no central authority needed for counting or verification.

### 3. Secure Multi-Party Computation
**Problem**: Many applications require users to submit private data that later needs to be compared or computed against without revealing individual inputs (e.g., sealed-bid auctions, private polls, confidential surveys).

**Solution**: The encrypted grid selection pattern shown in ZCraft can be extended to various secure multi-party computation scenarios where private inputs need to be collected and processed without exposing individual data.

### 4. Developer Accessibility to FHE
**Problem**: Implementing cryptographic solutions like FHE traditionally requires deep expertise in cryptography, making it inaccessible to most blockchain developers.

**Solution**: This project provides a complete, production-ready template with comprehensive documentation, making FHE technology accessible to standard Web3 developers through familiar tools like Hardhat, React, and Ethers.js.

### 5. User Experience in Privacy-Preserving dApps
**Problem**: Privacy-focused applications often sacrifice user experience due to complex cryptographic operations, confusing interfaces, and poor integration with existing wallet infrastructure.

**Solution**: ZCraft demonstrates how to build privacy-preserving applications with excellent UX through modern React patterns, seamless wallet integration via RainbowKit, and clear status feedback during cryptographic operations.

## 🎁 Advantages

### For Users
- **True Privacy**: Your selections are never visible to anyone else, including contract owners or blockchain observers
- **Ownership**: Only you can decrypt and view your encrypted data
- **Transparency**: All operations are verifiable on-chain, ensuring no tampering
- **Familiar Experience**: Works with existing Ethereum wallets like MetaMask, Coinbase Wallet, etc.
- **No Compromises**: Enjoy privacy without sacrificing blockchain's security benefits

### For Developers
- **Battle-Tested Foundation**: Built on Zama's production-ready FHEVM protocol
- **Type Safety**: Full TypeScript support throughout the stack reduces bugs
- **Modern Stack**: Uses latest versions of React, Vite, and Ethereum tooling
- **Comprehensive Examples**: Contract tests and frontend integration serve as learning resources
- **Production Ready**: Includes deployment scripts, environment configuration, and error handling
- **Extensible**: Modular architecture allows easy adaptation to different use cases

### For Enterprises
- **Compliance-Friendly**: Enables private data handling on public blockchains
- **No Trusted Third Parties**: Eliminates intermediaries and centralized points of failure
- **Auditability**: Contract logic is transparent while user data remains private
- **Scalable Architecture**: Can be adapted for enterprise-grade applications
- **Cost-Effective**: Uses standard Ethereum infrastructure with minimal overhead

### Technical Advantages
- **Efficient Encoding**: Bitmask representation allows storing 16 boolean choices in a single encrypted uint16
- **Gas Optimization**: Contract optimized with 800 runs to balance deployment and execution costs
- **Secure by Design**: Follows security best practices including proper access control and input validation
- **EVM Compatibility**: Works on any FHEVM-compatible EVM chain
- **Client-Side Encryption**: Sensitive operations happen locally, reducing attack surface

## 📁 Project Structure

```
zcraft/
├── contracts/                          # Solidity smart contracts
│   └── EncryptedGridSelection.sol     # Main FHE-enabled grid selection contract
├── deploy/                             # Hardhat deployment scripts
│   └── deploy.ts                       # Automated deployment configuration
├── tasks/                              # Hardhat custom tasks
│   ├── accounts.ts                     # Account management utilities
│   └── GridSelection.ts                # Contract interaction helpers
├── test/                               # Contract test suites
│   ├── EncryptedGridSelection.ts      # Local/mock FHE tests
│   └── EncryptedGridSelectionSepolia.ts # Sepolia testnet integration tests
├── app/                                # React frontend application
│   ├── src/
│   │   ├── components/                # React components
│   │   │   ├── GridSelectionApp.tsx   # Main application component
│   │   │   └── Header.tsx             # Navigation header
│   │   ├── hooks/                     # Custom React hooks
│   │   │   ├── useZamaInstance.ts    # FHE instance initialization
│   │   │   └── useEthersSigner.ts    # Wallet signer hook
│   │   ├── config/                    # Configuration files
│   │   │   ├── wagmi.ts              # Wagmi/wallet configuration
│   │   │   └── contracts.ts          # Contract addresses and ABIs
│   │   ├── styles/                    # CSS stylesheets
│   │   ├── App.tsx                    # Root application component
│   │   └── main.tsx                   # Application entry point
│   ├── package.json                   # Frontend dependencies
│   ├── vite.config.ts                # Vite build configuration
│   └── netlify.toml                  # Netlify deployment config
├── hardhat.config.ts                  # Hardhat configuration
├── package.json                       # Project dependencies and scripts
├── tsconfig.json                      # TypeScript configuration
├── .env.example                       # Environment variables template
└── README.md                          # This file
```

## 🚦 Getting Started

### Prerequisites

- **Node.js**: Version 20 or higher
- **npm**: Version 7.0.0 or higher
- **Ethereum Wallet**: MetaMask or other Web3 wallet
- **Testnet ETH**: Sepolia testnet ETH for deployment and testing (get from [Sepolia faucet](https://sepoliafaucet.com/))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/zcraft.git
   cd zcraft
   ```

2. **Install contract dependencies**

   ```bash
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd app
   npm install
   cd ..
   ```

4. **Set up environment variables**

   Create a `.env` file in the project root:

   ```bash
   cat <<EOF > .env
   PRIVATE_KEY=your_private_key_hex_without_0x_prefix
   INFURA_API_KEY=your_infura_api_key
   ETHERSCAN_API_KEY=your_etherscan_api_key_for_verification
   EOF
   ```

   **Important Security Notes:**
   - Never commit your `.env` file to version control
   - Use a dedicated wallet for development/testing
   - Never use your main wallet's private key

### Compile Smart Contracts

```bash
npm run compile
```

This will:
- Compile all Solidity contracts
- Generate TypeScript type definitions
- Create contract artifacts in the `artifacts/` directory

### Run Tests

```bash
# Run local tests with mock FHE
npm run test

# Run integration tests on Sepolia testnet
npm run test:sepolia
```

### Deploy to Local Network

```bash
# Terminal 1: Start local Hardhat node
npx hardhat node

# Terminal 2: Deploy contracts
npx hardhat deploy --network localhost
```

### Deploy to Sepolia Testnet

```bash
# Deploy contract
npx hardhat deploy --network sepolia

# Verify on Etherscan (optional)
npx hardhat verify --network sepolia <DEPLOYED_CONTRACT_ADDRESS>
```

### Run Frontend Locally

1. **Update contract address**

   After deployment, update the contract address in `app/src/config/contracts.ts`:

   ```typescript
   export const CONTRACT_ADDRESS = '0xYourDeployedContractAddress';
   ```

2. **Start development server**

   ```bash
   cd app
   npm run dev
   ```

3. **Open your browser**

   Navigate to `http://localhost:5173` (or the port shown in terminal)

4. **Connect your wallet**

   - Click "Connect Wallet" in the header
   - Select your preferred wallet (MetaMask, Coinbase Wallet, etc.)
   - Ensure you're connected to Sepolia testnet
   - Approve the connection request

### Deploy Frontend to Netlify

```bash
cd app
npm run build
# Deploy the dist/ folder to Netlify
```

Or connect your GitHub repository to Netlify for automatic deployments.

## 📜 Available Scripts

### Root Level (Contract Development)

| Script | Description |
|--------|-------------|
| `npm run compile` | Compile all Solidity contracts |
| `npm run test` | Run contract tests with mock FHE |
| `npm run test:sepolia` | Run integration tests on Sepolia |
| `npm run coverage` | Generate test coverage report |
| `npm run lint` | Run Solidity and TypeScript linting |
| `npm run lint:sol` | Run Solhint on Solidity files |
| `npm run lint:ts` | Run ESLint on TypeScript files |
| `npm run prettier:check` | Check code formatting |
| `npm run prettier:write` | Auto-format all code files |
| `npm run clean` | Remove build artifacts and cache |
| `npm run typechain` | Generate TypeScript contract types |
| `npm run chain` | Start local Hardhat network |
| `npm run deploy:localhost` | Deploy to local network |
| `npm run deploy:sepolia` | Deploy to Sepolia testnet |
| `npm run verify:sepolia` | Verify contract on Etherscan |

### App Directory (Frontend Development)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run build` | Build production-ready frontend |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint on frontend code |

## 🏗️ Architecture Deep Dive

### Smart Contract Architecture

**EncryptedGridSelection.sol** (contracts/EncryptedGridSelection.sol:1-48)

The contract uses three main components:

1. **Storage Mappings**:
   - `_encryptedSelections`: Maps user addresses to encrypted euint16 values
   - `_hasSelection`: Tracks which users have saved selections

2. **Core Functions**:
   - `saveSelection()`: Accepts encrypted input and proof, stores on-chain
   - `getSelection()`: Retrieves encrypted selection for a user
   - `hasSelection()`: Checks if user has saved data

3. **Security Features**:
   - Custom error handling for missing selections
   - Access control via FHE.allow() for proper encryption key management
   - Input validation through FHEVM's proof system

### Frontend Architecture

The React application follows modern best practices:

1. **State Management**:
   - React hooks for local state
   - TanStack Query for server state synchronization
   - Wagmi for blockchain state

2. **Wallet Integration**:
   - RainbowKit provides beautiful wallet UI
   - Wagmi hooks (useAccount, useReadContract) for contract interaction
   - Custom useEthersSigner hook bridges Wagmi to Ethers.js

3. **Encryption Flow**:
   - useZamaInstance hook initializes FHE capabilities
   - Client-side encryption before transaction submission
   - EIP-712 signing for secure decryption authorization

### Data Flow

1. **Encryption & Storage**:
   ```
   User Selection → Bitmask Encoding → Client Encryption → Transaction → On-Chain Storage
   ```

2. **Retrieval & Decryption**:
   ```
   Contract Query → Encrypted Handle → User Signature → Relayer Decryption → Plain Data
   ```

## 🔐 Security Considerations

### Smart Contract Security
- ✅ No reentrancy vulnerabilities (read-only external calls)
- ✅ Access control via FHE permission system
- ✅ Input validation through cryptographic proofs
- ✅ No unchecked external calls
- ✅ Events for monitoring state changes

### Frontend Security
- ✅ Client-side encryption (private keys never leave device)
- ✅ EIP-712 typed data signatures
- ✅ Secure environment variable handling
- ✅ No sensitive data in localStorage/sessionStorage
- ✅ HTTPS required for production deployment

### Operational Security
- ⚠️ Keep private keys secure and never commit them
- ⚠️ Use dedicated development wallets
- ⚠️ Verify contract addresses before interaction
- ⚠️ Audit dependencies regularly
- ⚠️ Test thoroughly on testnet before mainnet deployment

## 🗺️ Roadmap & Future Development

### Phase 1: Current Features (✅ Completed)
- ✅ Basic encrypted grid selection
- ✅ React frontend with wallet integration
- ✅ Deployment on Sepolia testnet
- ✅ Comprehensive documentation
- ✅ Unit and integration tests

### Phase 2: Enhanced Functionality (🚧 In Progress)
- 🚧 Multi-user comparison without revealing individual selections
- 🚧 Time-locked reveals (selections hidden until deadline)
- 🚧 Batch operations for multiple selections
- 🚧 Encrypted metadata support

### Phase 3: Advanced Features (📋 Planned)
- 📋 Integration with Zama's production mainnet (when available)
- 📋 Support for larger grids (8×8, 16×16, custom sizes)
- 📋 Encrypted scoring and ranking system
- 📋 Multi-party computation features
- 📋 Cross-chain bridges for encrypted data
- 📋 Mobile-responsive progressive web app (PWA)

### Phase 4: Ecosystem Integration (💡 Future)
- 💡 NFT integration (encrypted trait selection)
- 💡 DAO governance with private voting
- 💡 Gaming applications (fog of war, hidden information games)
- 💡 Sealed-bid auction implementation
- 💡 Private prediction markets
- 💡 Confidential credential verification
- 💡 ZK-rollup integration for scalability

### Research Directions
- Optimizing gas costs for FHE operations
- Advanced homomorphic operations (comparison, sorting)
- Privacy-preserving data analytics on-chain
- Integration with other privacy protocols (zkSNARKs, MPC)

## 📚 Documentation & Resources

### Official Zama Documentation
- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [FHEVM Hardhat Setup](https://docs.zama.ai/protocol/solidity-guides/getting-started/setup)
- [FHEVM Testing Guide](https://docs.zama.ai/protocol/solidity-guides/development-guide/hardhat/write_test)
- [FHEVM Hardhat Plugin](https://docs.zama.ai/protocol/solidity-guides/development-guide/hardhat)

### Ethereum & Tooling
- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/v6/)
- [Wagmi Documentation](https://wagmi.sh)
- [RainbowKit Documentation](https://www.rainbowkit.com/docs/introduction)
- [Vite Documentation](https://vitejs.dev)

### Learning Resources
- [Solidity Documentation](https://docs.soliditylang.org/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Understanding FHE](https://www.zama.ai/post/what-is-fully-homomorphic-encryption-fhe)

## 🤝 Contributing

Contributions are welcome! This project serves as both a production template and a learning resource for the community.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow existing code style and formatting
- Add tests for new features
- Update documentation as needed
- Keep commits atomic and well-described
- Ensure all tests pass before submitting PR

### Areas for Contribution

- Additional use case examples
- Performance optimizations
- UI/UX improvements
- Documentation enhancements
- Bug fixes and security improvements
- Translation to other languages

## 🐛 Known Issues & Limitations

### Current Limitations
- **Gas Costs**: FHE operations are more expensive than regular operations (~2-5x more gas)
- **Network Support**: Currently only works on FHEVM-compatible networks (Sepolia testnet)
- **Computation Limits**: Complex homomorphic operations are limited by current FHE capabilities
- **Decryption Time**: User decryption can take 2-10 seconds depending on network conditions

### Known Issues
- Relayer services occasionally experience delays during high network usage
- Large batch operations may timeout on slower networks
- MetaMask signature popup may appear behind window on some browsers

### Workarounds
- Split large operations into smaller batches
- Implement retry logic for relayer timeouts
- Use latest browser versions for best experience

## 📄 License

This project is licensed under the **BSD-3-Clause-Clear License**.

This means you are free to:
- Use the code commercially
- Modify the code
- Distribute the code
- Use the code privately

Under the conditions that:
- You include the original license and copyright notice
- You don't use contributors' names for endorsement

See the [LICENSE](LICENSE) file for full details.

## 🙏 Acknowledgments

- **Zama Team**: For developing FHEVM and making FHE accessible to blockchain developers
- **Ethereum Foundation**: For the robust EVM platform
- **Hardhat Team**: For the excellent development environment
- **Rainbow Team**: For beautiful wallet connection UI
- **Open Source Community**: For the amazing tools and libraries that make this project possible

## 🆘 Support & Community

### Get Help

- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/zcraft/issues)
- **Zama Discord**: [Join the community](https://discord.gg/zama)
- **Zama Documentation**: [Official FHEVM docs](https://docs.zama.ai)
- **Stack Overflow**: Tag questions with `fhevm` and `zama`

### Stay Updated

- Follow [@zama_fhe on Twitter](https://twitter.com/zama_fhe)
- Star this repository for updates
- Watch for new releases

### Professional Support

For enterprise implementations or professional consulting:
- Contact: [your-email@example.com]
- Professional auditing services available
- Custom development for specific use cases

## 🌟 Showcase

Built with ZCraft or FHEVM? We'd love to feature your project! Submit a PR adding your project to our showcase section.

---

**Built with privacy and security in mind** | **Powered by Zama FHEVM** | **Made for the decentralized future**

---

*Last Updated: October 2025*
