import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useWeb3 } from '../contexts/Web3Context';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import colors from '../theme/colors';

const PageTitle = styled.h1`
  font-family: 'Roboto', sans-serif;
  font-size: 2rem;
  font-weight: 400;
  color: ${colors.text.primary};
  margin-bottom: 1.5rem;
`;

const FilterSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const FilterButton = styled.button`
  font-family: 'Roboto Mono', monospace;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  background-color: ${props => props.active ? colors.accent.blue : 'transparent'};
  color: ${props => props.active ? colors.background.primary : colors.text.secondary};
  border: 1px solid ${props => props.active ? colors.accent.blue : colors.lines.primary};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${colors.accent.blue};
    color: ${props => props.active ? colors.background.primary : colors.text.primary};
  }
`;

const TransactionTable = styled.div`
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${colors.lines.primary};
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  padding: 1rem;
  background-color: ${colors.background.secondary};
  border-bottom: 1px solid ${colors.lines.primary};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const HeaderCell = styled.div`
  font-family: 'Roboto Mono', monospace;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${colors.text.secondary};
  text-transform: uppercase;
  
  @media (max-width: 768px) {
    &.hide-md {
      display: none;
    }
  }
  
  @media (max-width: 480px) {
    &.hide-sm {
      display: none;
    }
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  padding: 1rem;
  background-color: ${colors.background.primary};
  border-bottom: 1px solid ${colors.lines.primary};
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${colors.background.secondary};
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Cell = styled.div`
  font-family: 'Roboto Mono', monospace;
  font-size: 0.875rem;
  color: ${colors.text.primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  @media (max-width: 768px) {
    &.hide-md {
      display: none;
    }
  }
  
  @media (max-width: 480px) {
    &.hide-sm {
      display: none;
    }
  }
`;

const TransactionType = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  
  background-color: ${props => {
    switch (props.type) {
      case 'Create Passport':
        return 'rgba(108, 173, 245, 0.1)';
      case 'Add Credential':
        return 'rgba(138, 224, 108, 0.1)';
      case 'Move Passport':
        return 'rgba(241, 223, 56, 0.1)';
      case 'Verify Credential':
        return 'rgba(167, 125, 255, 0.1)';
      default:
        return 'rgba(117, 117, 117, 0.1)';
    }
  }};
  
  color: ${props => {
    switch (props.type) {
      case 'Create Passport':
        return colors.accent.blue;
      case 'Add Credential':
        return colors.accent.green;
      case 'Move Passport':
        return colors.accent.yellow;
      case 'Verify Credential':
        return colors.accent.purple;
      default:
        return colors.text.secondary;
    }
  }};
`;

const TransactionLink = styled.a`
  color: ${colors.accent.blue};
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ChainBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  
  color: ${props => {
    switch (props.chain) {
      case 'sepolia':
        return colors.accent.blue;
      case 'arbitrumGoerli':
        return colors.accent.green;
      case 'baseGoerli':
        return colors.accent.yellow;
      default:
        return colors.text.secondary;
    }
  }};
`;

const ChainIcon = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  
  background-color: ${props => {
    switch (props.chain) {
      case 'sepolia':
        return colors.accent.blue;
      case 'arbitrumGoerli':
        return colors.accent.green;
      case 'baseGoerli':
        return colors.accent.yellow;
      default:
        return colors.text.secondary;
    }
  }};
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  
  background-color: ${props => 
    props.status === 'Completed' ? 'rgba(138, 224, 108, 0.1)' : 
    props.status === 'Pending' ? 'rgba(241, 223, 56, 0.1)' : 
    props.status === 'Failed' ? 'rgba(245, 104, 104, 0.1)' : 
    'rgba(117, 117, 117, 0.1)'
  };
  
  color: ${props => 
    props.status === 'Completed' ? colors.accent.green : 
    props.status === 'Pending' ? colors.accent.yellow : 
    props.status === 'Failed' ? colors.accent.red : 
    colors.text.secondary
  };
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PageButton = styled.button`
  font-family: 'Roboto Mono', monospace;
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
  background-color: ${props => props.active ? colors.accent.blue : 'transparent'};
  color: ${props => props.active ? colors.background.primary : colors.text.secondary};
  border: 1px solid ${props => props.active ? colors.accent.blue : colors.lines.primary};
  border-radius: 4px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    border-color: ${colors.accent.blue};
    color: ${props => props.active ? colors.background.primary : colors.text.primary};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background-color: ${colors.background.secondary};
  border-radius: 8px;
  border: 1px solid ${colors.lines.primary};
  text-align: center;
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  color: ${colors.text.secondary};
`;

const EmptyStateTitle = styled.h3`
  font-family: 'Roboto', sans-serif;
  font-size: 1.25rem;
  font-weight: 400;
  color: ${colors.text.primary};
  margin-bottom: 1rem;
`;

const EmptyStateText = styled.p`
  font-family: 'Roboto Mono', monospace;
  font-size: 0.875rem;
  color: ${colors.text.secondary};
  margin-bottom: 1.5rem;
  max-width: 400px;
`;

const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
};

const getShortHash = (hash) => {
  if (!hash) return '';
  return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
};

const getExplorerUrl = (chain, hash) => {
  switch (chain) {
    case 'sepolia':
      return `https://sepolia.etherscan.io/tx/${hash}`;
    case 'arbitrumGoerli':
      return `https://goerli.arbiscan.io/tx/${hash}`;
    case 'baseGoerli':
      return `https://goerli.basescan.org/tx/${hash}`;
    default:
      return `https://layerzeroscan.com/tx/${hash}`;
  }
};

const HistoryPage = () => {
  const { isConnected, connectWallet } = useWeb3();
  
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    if (isConnected) {
      loadTransactions();
    }
  }, [isConnected, filter, currentPage]);
  
  const loadTransactions = async () => {
    setLoading(true);
    
    try {
      // In a real implementation, you would fetch transactions from the contracts or an indexer
      // For demo purposes, we'll create dummy transactions
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const dummyTransactions = [
        {
          id: 1,
          type: 'Create Passport',
          timestamp: Math.floor(Date.now() / 1000) - 86400 * 5, // 5 days ago
          chain: 'sepolia',
          hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
          status: 'Completed',
          details: {
            passportId: 0,
            name: 'My OmniPass'
          }
        },
        {
          id: 2,
          type: 'Add Credential',
          timestamp: Math.floor(Date.now() / 1000) - 86400 * 3, // 3 days ago
          chain: 'sepolia',
          hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          status: 'Completed',
          details: {
            passportId: 0,
            credentialType: 'Proof of Humanity'
          }
        },
        {
          id: 3,
          type: 'Add Credential',
          timestamp: Math.floor(Date.now() / 1000) - 86400 * 2, // 2 days ago
          chain: 'sepolia',
          hash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
          status: 'Completed',
          details: {
            passportId: 0,
            credentialType: 'DAO Membership'
          }
        },
        {
          id: 4,
          type: 'Move Passport',
          timestamp: Math.floor(Date.now() / 1000) - 86400, // 1 day ago
          chain: 'sepolia',
          hash: '0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc',
          status: 'Completed',
          details: {
            passportId: 0,
            fromChain: 'sepolia',
            toChain: 'arbitrumGoerli'
          }
        },
        {
          id: 5,
          type: 'Verify Credential',
          timestamp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
          chain: 'arbitrumGoerli',
          hash: '0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234',
          status: 'Completed',
          details: {
            passportId: 0,
            credentialType: 'Proof of Humanity'
          }
        }
      ];
      
      // Filter transactions based on the selected filter
      let filteredTransactions = dummyTransactions;
      if (filter !== 'all') {
        filteredTransactions = dummyTransactions.filter(tx => tx.type === filter);
      }
      
      setTransactions(filteredTransactions);
      setTotalPages(Math.ceil(filteredTransactions.length / 10)); // 10 items per page
    } catch (err) {
      console.error("Error loading transactions:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  if (!isConnected) {
    return (
      <div>
        <PageTitle>Transaction History</PageTitle>
        <EmptyState>
          <EmptyStateIcon>🔒</EmptyStateIcon>
          <EmptyStateTitle>Wallet Not Connected</EmptyStateTitle>
          <EmptyStateText>
            Please connect your wallet to view your transaction history.
          </EmptyStateText>
          <Button onClick={connectWallet}>
            Connect Wallet
          </Button>
        </EmptyState>
      </div>
    );
  }
  
  return (
    <div>
      <PageTitle>Transaction History</PageTitle>
      
      <FilterSection>
        <FilterButton 
          active={filter === 'all'} 
          onClick={() => setFilter('all')}
        >
          All
        </FilterButton>
        <FilterButton 
          active={filter === 'Create Passport'} 
          onClick={() => setFilter('Create Passport')}
        >
          Create Passport
        </FilterButton>
        <FilterButton 
          active={filter === 'Add Credential'} 
          onClick={() => setFilter('Add Credential')}
        >
          Add Credential
        </FilterButton>
        <FilterButton 
          active={filter === 'Move Passport'} 
          onClick={() => setFilter('Move Passport')}
        >
          Move Passport
        </FilterButton>
        <FilterButton 
          active={filter === 'Verify Credential'} 
          onClick={() => setFilter('Verify Credential')}
        >
          Verify Credential
        </FilterButton>
      </FilterSection>
      
      {loading ? (
        <Loader text="Loading transaction history..." />
      ) : transactions.length === 0 ? (
        <EmptyState>
          <EmptyStateIcon>📜</EmptyStateIcon>
          <EmptyStateTitle>No Transactions Found</EmptyStateTitle>
          <EmptyStateText>
            {filter === 'all' 
              ? "You don't have any transactions yet." 
              : `You don't have any ${filter} transactions yet.`}
          </EmptyStateText>
        </EmptyState>
      ) : (
        <>
          <TransactionTable>
            <TableHeader>
              <HeaderCell>Type</HeaderCell>
              <HeaderCell>Time</HeaderCell>
              <HeaderCell className="hide-sm">Chain</HeaderCell>
              <HeaderCell className="hide-md">Transaction</HeaderCell>
              <HeaderCell>Status</HeaderCell>
            </TableHeader>
            
            {transactions.map(tx => (
              <TableRow key={tx.id}>
                <Cell>
                  <TransactionType type={tx.type}>
                    {tx.type}
                  </TransactionType>
                </Cell>
                
                <Cell>{formatDate(tx.timestamp)}</Cell>
                
                <Cell className="hide-sm">
                  <ChainBadge chain={tx.chain}>
                    <ChainIcon chain={tx.chain} />
                    {tx.chain.charAt(0).toUpperCase() + tx.chain.slice(1)}
                  </ChainBadge>
                </Cell>
                
                <Cell className="hide-md">
                  <TransactionLink 
                    href={getExplorerUrl(tx.chain, tx.hash)} 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {getShortHash(tx.hash)}
                  </TransactionLink>
                </Cell>
                
                <Cell>
                  <StatusBadge status={tx.status}>
                    {tx.status}
                  </StatusBadge>
                </Cell>
              </TableRow>
            ))}
          </TransactionTable>
          
          {totalPages > 1 && (
            <Pagination>
              <PageButton 
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </PageButton>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <PageButton
                  key={page}
                  active={currentPage === page}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PageButton>
              ))}
              
              <PageButton 
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </PageButton>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default HistoryPage;
