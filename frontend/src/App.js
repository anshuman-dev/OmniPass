import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Provider } from './contexts/Web3Context';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import CreatePassportPage from './pages/CreatePassportPage';

// Placeholder pages - these will be implemented later
const ManagePassportPage = () => <div><h1>Manage Passport Page</h1><p>Coming soon</p></div>;
const AddCredentialPage = () => <div><h1>Add Credential Page</h1><p>Coming soon</p></div>;
const VerifyPage = () => <div><h1>Verify Page</h1><p>Coming soon</p></div>;
const HistoryPage = () => <div><h1>History Page</h1><p>Coming soon</p></div>;

function App() {
  return (
    <Web3Provider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create-passport" element={<CreatePassportPage />} />
            <Route path="/manage-passport" element={<ManagePassportPage />} />
            <Route path="/add-credential" element={<AddCredentialPage />} />
            <Route path="/verify" element={<VerifyPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </Layout>
      </Router>
    </Web3Provider>
  );
}

export default App;
