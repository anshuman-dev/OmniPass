// Import page modules
import HomePage from './pages/home.js';
import CreatePassportPage from './pages/create-passport.js';
import AddCredentialPage from './pages/add-credential.js';
import VerifyAccessPage from './pages/verify-access.js';
import TransactionHistoryPage from './pages/transaction-history.js';
import { initWeb3, connectWallet, getAccount, getChainId } from './utils/web3.js';

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
  await initWeb3();
  renderCurrentPage();
  addEventListeners();
}

// Render the current page
async function renderCurrentPage() {
  if (!pages[currentPage]) {
    console.error(`Page '${currentPage}' not found`);
    return;
  }

  // Clear current content
  pageContent.innerHTML = '';
  
  // Create page instance
  const page = new pages[currentPage](pageContent);
  
  // Render page
  await page.render();
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
  
  // Connect wallet button
  connectButton.addEventListener('click', async () => {
    if (!walletConnected) {
      try {
        await connectWallet();
        walletConnected = true;
        
        // Update button text
        const account = await getAccount();
        connectButton.textContent = `${account.substring(0, 6)}...${account.substring(account.length - 4)}`;
        
        // Re-render current page
        renderCurrentPage();
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        // Show error message
        alert('Failed to connect wallet. Please make sure MetaMask is installed and unlocked.');
      }
    }
  });
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
