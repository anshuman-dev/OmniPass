# OmniPass: Cross-Chain Credential Passport

A decentralized application that allows users to maintain a unified digital identity across multiple blockchains, powered by LayerZero.

## About

The Cross-Chain Credential Passport is a proof-of-concept application that enables:
- A single passport NFT that represents a user's core identity
- Cross-chain credentials that automatically sync across chains
- Seamless verification of user eligibility based on their complete cross-chain history
- Chain-agnostic user experience

This application demonstrates all three key LayerZero technologies:
- OApp: For synchronizing credential status across chains
- ONFT: The core identity passport that can move between chains
- OFT: Tokens used for credential verification services

## Development

This project is being developed incrementally. Each component is built and tested before moving to the next phase.

## Repository Structure

- `/contracts`: Smart contracts for passport, credentials, and verification
- `/backend`: FastAPI backend for API endpoints
- `/frontend`: React frontend application
- `/scripts`: Deployment and utility scripts
- `/docs`: Documentation and guides
