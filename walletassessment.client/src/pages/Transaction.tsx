import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Pagination
} from '@mui/material';

interface Transaction {
  id: string;
  amount: number;
  type: string;
  timestamp: string;
  description: string;
}

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTransactions = async (page: number) => {
    try {
      setLoading(true);
      const response = await api.get(`/wallet/transactions?page=${page}&pageSize=10`, { 
        params: { email: user?.email } 
      });
      
      setTransactions(response.data.transactions);
      setTotalPages(Math.ceil(response.data.totalCount / 10));
    } catch (err) {
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(page);
  }, [page]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Transaction History
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {new Date(transaction.timestamp).toLocaleDateString()}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>
                  <Typography 
                    variant="caption"
                    sx={{ 
                      textTransform: 'capitalize',
                      color: transaction.type.toLowerCase().includes('deposit') 
                        ? 'success.main' 
                        : 'error.main'
                    }}
                  >
                    {transaction.type}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    color={transaction.type.toLowerCase().includes('deposit') 
                      ? 'success.main' 
                      : 'error.main'}
                  >
                    {transaction.type.toLowerCase().includes('deposit') ? '+' : '-'}
                    ${transaction.amount.toFixed(2)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={totalPages}
        page={page}
        onChange={(_, value) => setPage(value)}
        sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
      />
    </Container>
  );
};

export default Transactions;