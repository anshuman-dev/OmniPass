import { getAccount, getChainId, switchChain } from '../utils/web3.js';
import { getUserPassports } from '../services/passport-service.js';

// Sample access requirements
const ACCESS_REQUIREMENTS = [
  {
    id: 'defi_app',
    name: 'DeFi Protocol Access',
    description: 'Access special features in a DeFi application',
    required_credentials: ['defi_lp']
  },
  {
    id: 'creator_platform',
    name: 'Creator Platform',
    description: 'Access to an exclusive NFT creator platform',
    required_credentials: ['nft_creator']
  },
  {
    id: 'governance',
    name: 'Governance Portal',
    description: 'Participate in protocol governance',
    required_credentials: ['dao_vote']
  }
];

// Sample credential types for reference
const CREDENTIAL_TYPES = [
  { id: 'dao_vote', name: 'DAO Participation', description: 'Simulates voting in a DAO' },
  { id: 'defi_lp', name: 'DeFi Liquidity Provider', description: 'Simulates providing liquidity' },
  { id: 'nft_creator', name: 'NFT Creator', description: 'Simulates creating an NFT collection' }
];

export default class VerifyAccessPage {
  constructor(container) {
    this.container = container;
    this.selectedChainId = null;
    this.selectedAccessId = null;
    this.isVerifying = false;
    this.error = null;
    this.verificationResult = null;
  }
  
  async render() {
    const account = await getAccount();
    const currentChainId = await getChainId();
    
    const template = `
      <div class="card">
        <h2 class="card-title">Access Verification Demo</h2>
        
        <p class="mb-4 text-secondary">
          This demo shows how applications can verify a user's credentials across chains.
          The verification happens on the current chain but can see credentials from all chains.
        </p>
        
        <div class="form-group">
          <label class="form-label">Select Verification Chain</label>
          <select id="chain-select" class="form-control">
            <option value="">Select a chain</option>
            <option value="11155111">Ethereum Sepolia</option>
            <option value="421613">Arbitrum Goerli</option>
            <option value="84531">Base Goerli</option>
          </select>
          <p class="text-tertiary mt-1" style="font-size: 0.8rem;">
            This is the chain where verification will happen, but it can see credentials from everywhere.
          </p>
        </div>
        
        <div class="form-group">
          <label class="form-label">Select Access Type</label>
          <select id="access-select" class="form-control">
            <option value="">Select what to access</option>
            ${ACCESS_REQUIREMENTS.map(req => `
              <option value="${req.id}">${req.name}</option>
            `).join('')}
          </select>
        </div>
        
        <div id="access-info" class="mb-4" style="display: none;"></div>
        
        <div id="alert-container"></div>
        
        <button id="verify-btn" class="btn btn-primary w-100" disabled>
          Verify Access
        </button>
      </div>
    `;
    
    this.container.innerHTML = template;
    
    // Get DOM elements
    this.chainSelect = document.getElementById('chain-select');
    this.accessSelect = document.getElementById('access-select');
    this.accessInfo = document.getElementById('access-info');
    this.verifyButton = document.getElementById('verify-btn');
    this.alertContainer = document.getElementById('alert-container');
    
    // Add event listeners
    this.chainSelect.addEventListener('change', this.handleChainSelect.bind(this));
    this.accessSelect.addEventListener('change', this.handleAccessSelect.bind(this));
    this.verifyButton.addEventListener('click', this.handleVerifyAccess.bind(this));
    
    // Update button state
    this.updateButtonState();
  }
  
  async handleChainSelect(event) {
    this.selectedChainId = parseInt(event.target.value);
    this.updateButtonState();
  }
  
  async handleAccessSelect(event) {
    this.selectedAccessId = event.target.value;
    
    if (this.selectedAccessId) {
      const accessReq = ACCESS_REQUIREMENTS.find(r => r.id === this.selectedAccessId);
      
      this.accessInfo.innerHTML = `
        <div class="p-3 bg-primary" style="border: 1px solid var(--line-color); border-radius: 4px;">
          <h4 class="mb-1">${accessReq.name}</h4>
          <p class="text-secondary mb-2" style="font-size: 0.9rem;">${accessReq.description}</p>
          
          <div class="mt-2">
            <p class="mb-1 text-tertiary" style="font-size: 0.8rem;">Required credentials:</p>
            <ul style="list-style-type: disc; padding-left: 1.5rem; font-size: 0.8rem;">
              ${accessReq.required_credentials.map(cred => {
                const credInfo = CREDENTIAL_TYPES.find(c => c.id === cred);
                return `<li>${credInfo ? credInfo.name : cred}</li>`;
              }).join('')}
            </ul>
          </div>
        </div>
      `;
      this.accessInfo.style.display = 'block';
    } else {
      this.accessInfo.style.display = 'none';
    }
    
    this.updateButtonState();
  }
  
  async handleVerifyAccess() {
    if (this.isVerifying) return;
    
    this.isVerifying = true;
    this.error = null;
    this.verificationResult = null;
    this.updateUI();
    
    try {
      const account = await getAccount();
      
      if (!account) {
        throw new Error("Please connect your wallet first");
      }
      
      if (!this.selectedChainId) {
        throw new Error("Please select a verification chain");
      }
      
      if (!this.selectedAccessId) {
        throw new Error("Please select what to access");
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
      
      // Get access requirements
      const accessReq = ACCESS_REQUIREMENTS.find(r => r.id === this.selectedAccessId);
      
      // Mock verification process
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      
      // For demo purposes, we'll randomly determine if verification passes
      // In a real app, this would be a call to your backend
      const mockVerification = {
        passport_id: passportId,
        access_granted: Math.random() > 0.5, // 50% chance of success
        verification_details: {}
      };
      
      // Add details for each required credential
      accessReq.required_credentials.forEach(cred => {
        // Randomly determine if this credential is verified
        const hasCredential = mockVerification.access_granted ? true : Math.random() > 0.7;
        
        mockVerification.verification_details[cred] = {
          has_credential: hasCredential,
          chain_verified: this.getChainName(this.selectedChainId)
        };
        
        // If any credential is missing, access is denied
        if (!hasCredential) {
          mockVerification.access_granted = false;
        }
      });
      
      this.verificationResult = mockVerification;
    } catch (error) {
      console.error("Error verifying access:", error);
      this.error = error.message;
    } finally {
      this.isVerifying = false;
      this.updateUI();
    }
  }
  
  getChainName(chainId) {
    const chains = {
      11155111: 'Ethereum Sepolia',
      421613: 'Arbitrum Goerli',
      84531: 'Base Goerli'
    };
    
    return chains[chainId] || 'Unknown Chain';
  }
  
  updateButtonState() {
    const account = getAccount();
    this.verifyButton.disabled = this.isVerifying || !account || !this.selectedChainId || !this.selectedAccessId;
    
    if (this.isVerifying) {
      this.verifyButton.textContent = "Verifying...";
    } else {
      this.verifyButton.textContent = "Verify Access";
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
    
    // Show verification result if any
    if (this.verificationResult) {
      const resultAlert = `
        <div class="alert ${this.verificationResult.access_granted ? 'alert-success' : 'alert-error'}">
          <h3 class="mb-2">
            ${this.verificationResult.access_granted ? '✅ Access Granted!' : '❌ Access Denied'}
          </h3>
          
          <div>
            <p class="mb-1 text-tertiary">Verification results:</p>
            <ul style="list-style: none; padding: 0;">
              ${Object.entries(this.verificationResult.verification_details).map(([cred, result]) => {
                const credInfo = CREDENTIAL_TYPES.find(c => c.id === cred);
                return `
                  <li class="mb-1" style="display: flex; align-items: center;">
                    <span class="mr-2" style="margin-right: 0.5rem;">
                      ${result.has_credential ? '✓' : '✗'}
                    </span>
                    <span>
                      ${credInfo ? credInfo.name : cred}
                      <span class="text-tertiary" style="font-size: 0.8rem; margin-left: 0.5rem;">
                        (verified on ${result.chain_verified})
                      </span>
                    </span>
                  </li>
                `;
              }).join('')}
            </ul>
          </div>
        </div>
      `;
      this.alertContainer.innerHTML = resultAlert;
      
      // Show explanation if access is granted
      if (this.verificationResult.access_granted) {
        const explanation = `
          <div class="mt-4 pt-4" style="border-top: 1px solid var(--line-color);">
            <h3 class="mb-2">What's happening?</h3>
            <ol class="ml-4" style="list-style-position: inside;">
              <li class="mb-1">Your credentials were verified on ${this.getChainName(this.selectedChainId)}</li>
              <li class="mb-1">The verification could see credentials from all chains</li>
              <li class="mb-1">No need to move your passport NFT to the verification chain</li>
              <li>LayerZero enables this cross-chain verification seamlessly</li>
            </ol>
          </div>
        `;
        this.alertContainer.insertAdjacentHTML('afterend', explanation);
      }
    }
  }
}
