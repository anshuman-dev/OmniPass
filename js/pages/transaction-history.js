import { getAccount, getChainId } from '../utils/web3.js';
import { getUserPassports } from '../services/passport-service.js';

export default class TransactionHistoryPage {
  constructor(container) {
    this.container = container;
  }
  
  async render() {
    const account = await getAccount();
    
    if (!account) {
      this.container.innerHTML = `
        <div class="card">
          <h2 class="card-title">Transaction History</h2>
          <div class="alert alert-error">
            <p>Please connect your wallet to view transaction history.</p>
          </div>
          <button id="connect-wallet-btn" class="btn btn-primary">Connect Wallet</button>
        </div>
      `;
      
      document.getElementById('connect-wallet-btn').addEventListener('click', () => {
        document.getElementById('connect-wallet').click();
      });
      
      return;
    }
    
    try {
      // Get user's passports
      const passports = await getUserPassports(account);
      
      if (!passports || passports.length === 0) {
        this.container.innerHTML = `
          <div class="card">
            <h2 class="card-title">Transaction History</h2>
            <div class="alert alert-error">
              <p>You don't have a passport yet. Please create one first.</p>
            </div>
            <button id="create-passport-btn" class="btn btn-primary">Create Passport</button>
          </div>
        `;
        
        document.getElementById('create-passport-btn').addEventListener('click', () => {
          const createPassportLink = document.querySelector('.nav-link[data-page="create-passport"]');
          if (createPassportLink) {
            createPassportLink.click();
          }
        });
        
        return;
      }
      
      // For demo, show mock transaction history
      const template = `
        <div class="card">
          <h2 class="card-title">Transaction History</h2>
          
          <p class="mb-4 text-secondary">
            View your passport's cross-chain transaction history. All transactions are powered by LayerZero's
            messaging protocol.
          </p>
          
          <div class="history-filter mb-4">
            <label class="form-label">Filter by Type</label>
            <div class="filter-buttons">
              <button class="btn btn-secondary active" data-filter="all">All</button>
              <button class="btn btn-secondary" data-filter="creation">Creation</button>
              <button class="btn btn-secondary" data-filter="credential">Credentials</button>
              <button class="btn btn-secondary" data-filter="transfer">Transfers</button>
            </div>
          </div>
          
          <div class="transaction-list">
            <div class="transaction-item" data-type="creation">
              <div class="transaction-icon bg-accent-green">
                <span>📜</span>
              </div>
              <div class="transaction-content">
                <div class="transaction-header">
                  <h4>Passport Created</h4>
                  <span class="transaction-date">1 day ago</span>
                </div>
                <p class="transaction-details">
                  Created passport ID #${passports[0].id} on Ethereum Sepolia
                </p>
                <div class="transaction-links">
                  <a href="https://sepolia.etherscan.io/tx/0x123" target="_blank" class="transaction-link">View on Etherscan</a>
                  <a href="https://testnet.layerzeroscan.com/tx/0x123" target="_blank" class="transaction-link">View on LayerZero Scan</a>
                </div>
              </div>
            </div>
            
            <div class="transaction-item" data-type="credential">
              <div class="transaction-icon bg-accent-blue">
                <span>🏆</span>
              </div>
              <div class="transaction-content">
                <div class="transaction-header">
                  <h4>Credential Added</h4>
                  <span class="transaction-date">12 hours ago</span>
                </div>
                <p class="transaction-details">
                  Added "DAO Participation" credential on Ethereum Sepolia, synchronized to 2 chains
                </p>
                <div class="transaction-links">
                  <a href="https://sepolia.etherscan.io/tx/0x456" target="_blank" class="transaction-link">View on Etherscan</a>
                  <a href="https://testnet.layerzeroscan.com/tx/0x456" target="_blank" class="transaction-link">View on LayerZero Scan</a>
                </div>
              </div>
            </div>
            
            <div class="transaction-item" data-type="credential">
              <div class="transaction-icon bg-accent-blue">
                <span>🏆</span>
              </div>
              <div class="transaction-content">
                <div class="transaction-header">
                  <h4>Credential Added</h4>
                  <span class="transaction-date">6 hours ago</span>
                </div>
                <p class="transaction-details">
                  Added "NFT Creator" credential on Base Goerli, synchronized to 2 chains
                </p>
                <div class="transaction-links">
                  <a href="https://goerli.basescan.org/tx/0x789" target="_blank" class="transaction-link">View on BaseScan</a>
                  <a href="https://testnet.layerzeroscan.com/tx/0x789" target="_blank" class="transaction-link">View on LayerZero Scan</a>
                </div>
              </div>
            </div>
            
            <div class="transaction-item" data-type="transfer">
              <div class="transaction-icon bg-accent-purple">
                <span>🔄</span>
              </div>
              <div class="transaction-content">
                <div class="transaction-header">
                  <h4>Passport Transferred</h4>
                  <span class="transaction-date">2 hours ago</span>
                </div>
                <p class="transaction-details">
                  Moved passport from Ethereum Sepolia to Arbitrum Goerli
                </p>
                <div class="transaction-links">
                  <a href="https://sepolia.etherscan.io/tx/0xabc" target="_blank" class="transaction-link">View on Etherscan</a>
                  <a href="https://testnet.layerzeroscan.com/tx/0xabc" target="_blank" class="transaction-link">View on LayerZero Scan</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      
      this.container.innerHTML = template;
      
      // Add CSS for transaction history
      document.head.insertAdjacentHTML('beforeend', `
        <style>
          .history-filter {
            margin-bottom: 2rem;
          }
          
          .filter-buttons {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
          }
          
          .filter-buttons .btn {
            padding: 0.5rem 1rem;
            font-size: 0.8rem;
          }
          
          .filter-buttons .btn.active {
            background-color: var(--bg-secondary);
            border-color: var(--text-primary);
            color: var(--text-primary);
          }
          
          .transaction-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          
          .transaction-item {
            display: flex;
            gap: 1rem;
            padding: 1rem;
            background-color: var(--bg-primary);
            border: 1px solid var(--line-color);
            border-radius: 6px;
          }
          
          .transaction-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }
          
          .transaction-content {
            flex: 1;
          }
          
          .transaction-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
          }
          
          .transaction-date {
            font-size: 0.8rem;
            color: var(--text-tertiary);
          }
          
          .transaction-details {
            margin-bottom: 0.75rem;
            color: var(--text-secondary);
            font-size: 0.9rem;
          }
          
          .transaction-links {
            display: flex;
            gap: 1rem;
          }
          
          .transaction-link {
            font-size: 0.8rem;
            color: var(--accent-blue);
            text-decoration: none;
          }
          
          .transaction-link:hover {
            text-decoration: underline;
          }
        </style>
      `);
      
      // Add filter functionality
      const filterButtons = document.querySelectorAll('.filter-buttons .btn');
      const transactionItems = document.querySelectorAll('.transaction-item');
      
      filterButtons.forEach(button => {
        button.addEventListener('click', () => {
          // Update active button
          filterButtons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');
          
          // Filter transactions
          const filter = button.getAttribute('data-filter');
          
          transactionItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-type') === filter) {
              item.style.display = 'flex';
            } else {
              item.style.display = 'none';
            }
          });
        });
      });
      
    } catch (error) {
      console.error("Error loading transaction history:", error);
      this.container.innerHTML = `
        <div class="card">
          <h2 class="card-title">Transaction History</h2>
          <div class="alert alert-error">
            <p>Error loading transaction history: ${error.message}</p>
          </div>
        </div>
      `;
    }
  }
}
