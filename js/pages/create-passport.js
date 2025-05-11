import { getAccount, getChainId, switchChain, signTransaction } from '../utils/web3.js';
import { createPassport } from '../services/passport-service.js';

export default class CreatePassportPage {
  constructor(container) {
    this.container = container;
    this.selectedChainId = null;
    this.isCreating = false;
    this.error = null;
    this.success = null;
  }
  
  async render() {
    const account = await getAccount();
    const currentChainId = await getChainId();
    
    const template = `
      <div class="card">
        <h2 class="card-title">Create Your Credential Passport</h2>
        
        <p class="mb-4 text-secondary">
          Your credential passport is a digital identity that works across multiple blockchains.
          It will store your credentials and achievements in a way that can be verified anywhere.
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
            This is the chain where your passport will be initially created.
          </p>
        </div>
        
        <div id="alert-container"></div>
        
        <button id="create-passport-btn" class="btn btn-primary w-100" disabled>
          Create Passport
        </button>
      </div>
    `;
    
    this.container.innerHTML = template;
    
    // Get DOM elements
    this.chainSelect = document.getElementById('chain-select');
    this.createButton = document.getElementById('create-passport-btn');
    this.alertContainer = document.getElementById('alert-container');
    
    // Add event listeners
    this.chainSelect.addEventListener('change', this.handleChainSelect.bind(this));
    this.createButton.addEventListener('click', this.handleCreatePassport.bind(this));
    
    // Update button state
    this.updateButtonState();
  }
  
  async handleChainSelect(event) {
    this.selectedChainId = parseInt(event.target.value);
    this.updateButtonState();
  }
  
  async handleCreatePassport() {
    if (this.isCreating) return;
    
    this.isCreating = true;
    this.error = null;
    this.success = null;
    this.updateUI();
    
    try {
      if (!await getAccount()) {
        throw new Error("Please connect your wallet first");
      }
      
      if (!this.selectedChainId) {
        throw new Error("Please select a chain");
      }
      
      // Switch chain if needed
      const currentChainId = await getChainId();
      if (currentChainId !== this.selectedChainId) {
        await switchChain(this.selectedChainId);
      }
      
      // Prepare passport creation
      const account = await getAccount();
      const txData = await createPassport({
        wallet_address: account,
        chain_id: this.selectedChainId,
        metadata_uri: `ipfs://QmExample/${account}` // Example URI
      });
      
      // Sign and send transaction
      const tx = await signTransaction(txData.transaction_data);
      
      // Set success message
      this.success = {
        message: "Passport created successfully!",
        txHash: tx.hash,
        chainId: this.selectedChainId
      };
      
      // Redirect to manage page after 2 seconds
      setTimeout(() => {
        const managePassportLink = document.querySelector('.nav-link[data-page="manage-passport"]');
        if (managePassportLink) {
          managePassportLink.click();
        } else {
          // If manage passport link doesn't exist, go to add credentials
          const addCredentialLink = document.querySelector('.nav-link[data-page="add-credential"]');
          if (addCredentialLink) {
            addCredentialLink.click();
          }
        }
      }, 2000);
    } catch (error) {
      console.error("Error creating passport:", error);
      this.error = error.message;
    } finally {
      this.isCreating = false;
      this.updateUI();
    }
  }
  
  updateButtonState() {
    const account = getAccount();
    this.createButton.disabled = this.isCreating || !account || !this.selectedChainId;
    
    if (this.isCreating) {
      this.createButton.textContent = "Creating...";
    } else {
      this.createButton.textContent = "Create Passport";
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
          <p class="mt-1">
            <a href="https://sepolia.etherscan.io/tx/${this.success.txHash}" 
               target="_blank" 
               class="text-accent-green">
              View transaction
            </a>
          </p>
        </div>
      `;
      this.alertContainer.innerHTML = successAlert;
    }
  }
}
