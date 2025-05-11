// Import page modules
import HomePage from './pages/home.js';
import CreatePassportPage from './pages/create-passport.js';
import AddCredentialPage from './pages/add-credential.js';
import VerifyAccessPage from './pages/verify-access.js';
import TransactionHistoryPage from './pages/transaction-history.js';
import { initWeb3, connectWallet, getAccount, getChainId } from './utils/web3.js';
import { initDebug } from './utils/debug.js';

// Page components
const pages = {
  'home': HomePage,
  'create-passport': CreatePassportPage,
  'add-credential': AddCredentialPage,
  'verify-access': VerifyAccessPage,
  'history': TransactionHistoryPage,
};

// DOM Elements
const pageContent = document.getElementById('page-content');
const navLinks = document.querySelectorAll('.nav-link');
const connectButton = document.getElementById('connect-wallet');

// App State
let currentPage = 'home';
let walletConnected = false;

// Initialize the app
async function initApp() {
  // Initialize debug mode
  initDebug();
  
  console.log('Initializing app...');
  
  if (typeof ethers === 'undefined') {
    console.error('Ethers.js is not loaded. App initialization failed.');
    alert('Required libraries not loaded. Please refresh the page and try again.');
    return;
  }
  
  try {
    await initWeb3();
    renderCurrentPage();
    addEventListeners();
    
    // Check if already connected
    const account = await getAccount();
    if (account) {
      walletConnected = true;
      updateConnectButton(account);
    }
  } catch (error) {
    console.error('Error initializing app:', error);
  }
}

// Update connect button with account
function updateConnectButton(account) {
  if (account && connectButton) {
    connectButton.textContent = `${account.substring(0, 6)}...${account.substring(account.length - 4)}`;
  }
}

// Render the current page
async function renderCurrentPage() {
  if (!pages[currentPage]) {
    console.error(`Page '${currentPage}' not found`);
    return;
  }

  try {
    // Clear current content
    pageContent.innerHTML = '';
    
    // Create page instance
    const page = new pages[currentPage](pageContent);
    
    // Render page
    await page.render();
  } catch (error) {
    console.error(`Error rendering page ${currentPage}:`, error);
    pageContent.innerHTML = `
      <div class="card">
        <h2 class="card-title">Error</h2>
        <div class="alert alert-error">
          <p>An error occurred while loading this page. Please try again.</p>
          <p class="text-tertiary" style="font-size: 0.8rem;">${error.message}</p>
        </div>
      </div>
    `;
  }
}

// Add event listeners
function addEventListeners() {
  // Navigation
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const pageName = e.target.getAttribute('data-page');
      if (pageName && pageName !== currentPage) {
        // Update active link
        navLinks.forEach(item => item.classList.remove('active'));
        e.target.classList.add('active');
        
        // Update current page and render
        currentPage = pageName;
        renderCurrentPage();
      }
    });
  });
  
  // Connect wallet button - with better error handling
  if (connectButton) {
    connectButton.addEventListener('click', async () => {
      if (!walletConnected) {
        try {
          console.log('Connecting wallet...');
          const account = await connectWallet();
          if (account) {
            console.log('Connected to account:', account);
            walletConnected = true;
            updateConnectButton(account);
            
            // Re-render current page
            renderCurrentPage();
          }
        } catch (error) {
          console.error('Failed to connect wallet:', error);
          // Error alerts are now handled in the connectWallet function
        }
      }
    });
  }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing app...');
  
  // Delay initialization slightly to ensure all scripts are loaded
  setTimeout(initApp, 100);
});
