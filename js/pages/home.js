export default class HomePage {
  constructor(container) {
    this.container = container;
  }
  
  async render() {
    const template = `
      <div class="card">
        <h2 class="card-title">Cross-Chain Credential Passport</h2>
        <p class="mb-3">Welcome to the Credential Passport system, powered by LayerZero!</p>
        
        <div class="mb-4">
          <h3 class="mb-2">Motivation</h3>
          <p>The blockchain ecosystem is severely fragmented, with users building separate identities, reputations, and credentials across multiple chains. Our Credential Passport solves this by enabling true omnichain applications.</p>
        </div>
        
        <div class="mb-4">
          <h3 class="mb-2">About</h3>
          <p>The Cross-Chain Credential Passport is a proof-of-concept application that allows users to maintain a unified digital identity across multiple blockchains, enabling:</p>
          <ul class="mb-2 ml-4">
            <li>Unified Identity: A single passport NFT that represents a user's core identity</li>
            <li>Cross-Chain Credentials: Achievements and verifications that automatically sync across chains</li>
            <li>Seamless Verification: Projects can verify user eligibility based on their complete cross-chain history</li>
            <li>Chain-Agnostic Experience: Users interact with the system from their preferred chain</li>
          </ul>
        </div>
        
        <div class="mb-4">
          <h3 class="mb-2">Supported Technologies</h3>
          <div class="feature-list">
            <div class="feature">
              <h4 class="text-accent-blue">OApp</h4>
              <p>For synchronizing credential status across chains</p>
            </div>
            <div class="feature">
              <h4 class="text-accent-green">ONFT</h4>
              <p>The core identity passport that can move between chains</p>
            </div>
            <div class="feature">
              <h4 class="text-accent-purple">OFT</h4>
              <p>Tokens used for credential verification services</p>
            </div>
          </div>
        </div>
        
        <div class="cta-container">
          <button class="btn btn-primary" id="get-started-btn">Get Started</button>
        </div>
      </div>
    `;
    
    this.container.innerHTML = template;
    
    // Add event listener for Get Started button
    document.getElementById('get-started-btn').addEventListener('click', () => {
      // Find the create-passport nav link and click it
      const createPassportLink = document.querySelector('.nav-link[data-page="create-passport"]');
      if (createPassportLink) {
        createPassportLink.click();
      }
    });
  }
}

// Add some CSS for the home page
document.head.insertAdjacentHTML('beforeend', `
<style>
  .feature-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .feature {
    background-color: rgba(22, 22, 22, 0.6);
    padding: 1.5rem;
    border-radius: 6px;
    border-left: 3px solid var(--line-color);
  }
  
  .feature h4 {
    margin-bottom: 0.75rem;
    font-family: var(--font-mono);
    font-weight: 500;
  }
  
  .feature:nth-child(1) {
    border-left-color: var(--accent-blue);
  }
  
  .feature:nth-child(2) {
    border-left-color: var(--accent-green);
  }
  
  .feature:nth-child(3) {
    border-left-color: var(--accent-purple);
  }
  
  .cta-container {
    text-align: center;
    margin-top: 2rem;
  }
</style>
`);
