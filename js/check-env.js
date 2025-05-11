(function() {
  console.log('Checking environment...');
  
  // Check if running in a browser
  if (typeof window === 'undefined') {
    console.error('Not running in a browser environment');
    return;
  }
  
  // Check for basic browser features
  if (!window.localStorage) {
    console.warn('LocalStorage is not available');
  }
  
  // Check for ethers.js
  window.addEventListener('load', function() {
    setTimeout(function() {
      if (typeof ethers === 'undefined') {
        console.error('ethers.js library failed to load');
        document.body.innerHTML = `
          <div style="max-width: 600px; margin: 100px auto; padding: 20px; background-color: #161616; color: #F2F2F2; font-family: sans-serif; border-radius: 8px; text-align: center;">
            <h2>Application Error</h2>
            <p>Required libraries failed to load. This might be due to network issues or content blockers.</p>
            <p>Please try:</p>
            <ul style="text-align: left; margin: 20px 0;">
              <li>Refreshing the page</li>
              <li>Checking your internet connection</li>
              <li>Disabling any content blockers or VPN</li>
              <li>Using a different browser</li>
            </ul>
            <button style="background-color: #6CADF5; border: none; padding: 10px 20px; color: #000; border-radius: 4px; cursor: pointer;" onclick="window.location.reload()">
              Refresh Page
            </button>
          </div>
        `;
      }
    }, 1000);
  });
})();
