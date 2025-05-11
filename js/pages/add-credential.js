import { getAccount, getChainId, switchChain, signTransaction } from '../utils/web3.js';
import { getUserPassports } from '../services/passport-service.js';

// Sample credential types
const CREDENTIAL_TYPES = [
  { id: 'dao_vote', name: 'DAO Participation', description: 'Simulates voting in a DAO' },
  { id: 'defi_lp', name: 'DeFi Liquidity Provider', description: 'Simulates providing liquidity' },
  { id: 'nft_creator', name: 'NFT Creator', description: 'Simulates creating an NFT collection' }
];

export default class AddCredentialPage {
  constructor(container) {
    this.container = container;
    this.selectedChainId = null;
    this.selectedCredentialType = null;
    this.isAddingCredential = false;
    this.error = null;
    this.success = null;
    this.txHash = null;
  }
  
  async render() {
    const account = await getAccount();
    const currentChainId = await getChainId();
    
    const template = `
      <div class="card">
        <h2 class="card-title">Add Test Credential</h2>
        
        <p class="mb-4 text-secondary">
          Add a test credential to your passport. This simulates completing an action on a blockchain.
          The credential will be synchronized across all chains using LayerZero.
        </p>
        
        <div class="form-group">
          <label class="form-label">Select Chain</label>
          <select id="chain-select" class="form-control">
            <option value="">Select a chain</option>
            <option value="11155111">Ethereum Sepolia</option>
            <option value="421613">Arbitrum Goerli</option>
            <option value="84531">Base Goerli</option>
          </select>
          <p class="text-tertiary mt-1" style="font-size: 0.8rem;">
            This is the chain where you'll perform the action to earn the credential.
          </p>
        </div>
        
        <div class="form-group">
          <label class="form-label">Select Credential Type</label>
          <select id="credential-type-select" class="form-control">
            <option value="">Select a credential type</option>
            ${CREDENTIAL_TYPES.map(cred => `
              <option value="${cred.id}">${cred.name}</option>
            `).join('')}
          </select>
        </div>
        
        <div id="credential-info" class="mb-4" style="display: none;"></div>
        
        <div id="alert-container"></div>
        
        <button id="add-credential-btn" class="btn btn-primary w-100" disabled>
          Add Credential
        </button>
      </div>
    `;
    
    this.container.innerHTML = template;
    
    // Get DOM elements
    this.chainSelect = document.getElementById('chain-select');
    this.credentialTypeSelect = document.getElementById('credential-type-select');
    this.credentialInfo = document.getElementById('credential-info');
    this.addButton = document.getElementById('add-credential-btn');
    this.alertContainer = document.getElementById('alert-container');
    
    // Add event listeners
    this.chainSelect.addEventListener('change', this.handleChainSelect.bind(this));
    this.credentialTypeSelect.addEventListener('change', this.handleCredentialTypeSelect.bind(this));
    this.addButton.addEventListener('click', this.handleAddCredential.bind(this));
    
    // Update button state
    this.updateButtonState();
  }
  
  async handleChainSelect(event) {
    this.selectedChainId = parseInt(event.target.value);
    this.updateButtonState();
  }
  
  async handleCredentialTypeSelect(event) {
    this.selectedCredentialType = event.target.value;
    
    if (this.selectedCredentialType) {
      const credential = CREDENTIAL_TYPES.find(c => c.id === this.selectedCredentialType);
      
      this.credentialInfo.innerHTML = `
        <div class="p-3 bg-primary" style="border: 1px solid var(--line-color); border-radius: 4px;">
          <h4 class="mb-1">${credential.name}</h4>
          <p class="text-secondary" style="font-size: 0.9rem;">${credential.description}</p>
        </div>
      `;
      this.credentialInfo.style.display = 'block';
    } else {
      this.credentialInfo.style.display = 'none';
    }
    
    this.updateButtonState();
  }
  
  async handleAddCredential() {
    if (this.isAddingCredential) return;
    
    this.isAddingCredential = true;
    this.error = null;
    this.success = null;
    this.txHash = null;
    this.updateUI();
    
    try {
      const account = await getAccount();
      
      if (!account) {
        throw new Error("Please connect your wallet first");
      }
      
      if (!this.selectedChainId) {
        throw new Error("Please select a chain");
      }
      
      if (!this.selectedCredentialType) {
        throw new Error("Please select a credential type");
      }
      
      // Switch chain if needed
      const currentChainId = await getChainId();
      if (currentChainId !== this.selectedChainId) {
        await switchChain(this.selectedChainId);
      }
      
      // Get user's passports
      const passports = await getUserPassports(account);
      
      if (!passports || passports.length === 0) {
        throw new Error("You don't have a passport yet. Please create one first.");
      }
      
      // For demonstration, use the first passport
      const passportId = passports[0].id;
      
      // Get credential details
      const credential = CREDENTIAL_TYPES.find(c => c.id === this.selectedCredentialType);
      
      // Mock credential metadata
      const metadata = JSON.stringify({
        name: credential.name,
        description: credential.description,
        timestamp: new Date().toISOString(),
        proof: `demo_proof_${Date.now()}`
      });
      
      // Mock transaction data
      const txData = {
        transaction_data: {
          to: "0x1234567890123456789012345678901234567890", // Mock credential manager contract
          from: account,
          data: "0x12345678", // Mock function call data
          gas: "3000000",
          value: ethers.utils.parseEther("0.001").toString() // Small amount for fees
        }
      };
      
      // Simulate transaction
      const tx = await signTransaction(txData.transaction_data);
      this.txHash = tx.hash;
      
      // Set success message
      this.success = {
        message: "Credential added successfully! It's being synchronized across chains.",
        txHash: tx.hash,
        chainId: this.selectedChainId,
        lzScanUrl: `https://testnet.layerzeroscan.com/tx/${tx.hash}`
      };
    } catch (error) {
      console.error("Error adding credential:", error);
      this.error = error.message;
    } finally {
      this.isAddingCredential = false;
      this.updateUI();
    }
  }
  
  updateButtonState() {
    const account = getAccount();
    this.addButton.disabled = this.isAddingCredential || !account || !this.selectedChainId || !this.selectedCredentialType;
    
    if (this.isAddingCredential) {
      this.addButton.textContent = "Adding...";
    } else {
      this.addButton.textContent = "Add Credential";
    }
  }
  
  updateUI() {
    this.updateButtonState();
    
    // Clear previous alerts
    this.alertContainer.innerHTML = '';
    
    // Show error if any
    if (this.error) {
      const errorAlert = `
        <div class="alert alert-error">
          <p>${this.error}</p>
        </div>
      `;
      this.alertContainer.innerHTML = errorAlert;
    }
    
    // Show success if any
    if (this.success) {
      const successAlert = `
        <div class="alert alert-success">
          <p>${this.success.message}</p>
          <div class="mt-2">
            <p class="mb-1">
              <a href="https://sepolia.etherscan.io/tx/${this.success.txHash}" 
                 target="_blank" 
                 class="text-accent-green">
                View blockchain transaction
              </a>
            </p>
            <p>
              <a href="${this.success.lzScanUrl}" 
                 target="_blank" 
                 class="text-accent-green">
                View in LayerZero Scan
              </a>
            </p>
          </div>
        </div>
      `;
      this.alertContainer.innerHTML = successAlert;
    }
    
    // Show explanation if transaction is successful
    if (this.txHash) {
      const explanation = `
        <div class="mt-4 pt-4" style="border-top: 1px solid var(--line-color);">
          <h3 class="mb-2">What's happening?</h3>
          <ol class="ml-4" style="list-style-position: inside;">
            <li class="mb-1">Your credential was added to the current chain</li>
            <li class="mb-1">LayerZero messages were sent to all other chains</li>
            <li class="mb-1">The credential is being synchronized across the ecosystem</li>
            <li>You'll be able to verify this credential from any chain</li>
          </ol>
        </div>
      `;
      this.alertContainer.insertAdjacentHTML('afterend', explanation);
    }
  }
}
