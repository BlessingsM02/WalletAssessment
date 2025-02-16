import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Card,
  CardContent
} from '@mui/material';

const TransferSchema = Yup.object().shape({
  amount: Yup.number()
    .min(0.01, 'Amount must be at least K0.01')
    .required('Required'),
  recipientEmail: Yup.string()
    .email('Invalid email')
    .required('Required'),
  description: Yup.string()
    .max(100, 'Description too long')
});

const Dashboard = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const balanceResponse = await api.get('/wallet/balance', { params: { email: user?.email } });
      setBalance(balanceResponse.data.balance);
      fetchTransactions(page);
    } catch (err) {
      setError('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (page) => {
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
    fetchWalletData();
  }, [page]);

  const formik = useFormik({
    initialValues: {
      amount: 0,
      recipientEmail: '',
      description: ''
    },
    validationSchema: TransferSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError('');
        setSuccess('');
        await api.post('/wallet/transfer', values, {
          params: { senderEmail: user?.email, recipientEmail: values.recipientEmail }
        });
        
        setSuccess('Transfer completed successfully!');
        formik.resetForm();
        fetchWalletData();
      } catch (err) {
        setError('Transfer failed. Please check the details and try again.');
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <Container maxWidth="lg" sx={{ 
      mt: 4,
      mb: 6,
      backgroundColor: 'background.paper',
      borderRadius: 4,
      p: 4,
      boxShadow: 3
    }}>
      {/* Header*/}
      <Typography variant="h4" gutterBottom sx={{ 
        textAlign: 'center',
        fontWeight: 700,
        color: 'primary.main',
        mb: 4,
        textTransform: 'uppercase',
        letterSpacing: 1
      }}>
        Digital Wallet Manager
      </Typography>

      {/* Alerts */}
      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}

      {/* Balance */}
      <Card sx={{ 
        mb: 4,
        p: 3,
        textAlign: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        boxShadow: 3,
        border: '1px solid rgba(255, 255, 255, 0.3)'
      }}>
        <CardContent>
          <Typography variant="overline" sx={{ 
            fontSize: '1rem',
            color: 'text.secondary',
            letterSpacing: 1
          }}>
            Available Balance
          </Typography>
          <Typography variant="h2" sx={{ 
            fontWeight: 800,
            color: 'primary.dark',
            mt: 1,
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            K{balance.toFixed(2)}
          </Typography>
        </CardContent>
      </Card>

      {/* Transfer Form */}
      <Box sx={{ 
        mb: 6,
        p: 3,
        borderRadius: 2,
        backgroundColor: 'background.default',
        boxShadow: 1
      }}>
        <Typography variant="h6" sx={{ 
          mb: 3,
          fontWeight: 600,
          color: 'text.primary',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <span style={{ fontSize: '1.5rem' }}>→</span>
          Funds Transfer
        </Typography>
        
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ display: 'grid', gap: 2.5 }}>
            <TextField
              fullWidth
              variant="outlined"
              label="Recipient Email"
              name="recipientEmail"
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': { borderColor: 'divider' }
                }
              }}
              value={formik.values.recipientEmail}
              onChange={formik.handleChange}
              error={formik.touched.recipientEmail && !!formik.errors.recipientEmail}
              helperText={formik.touched.recipientEmail && formik.errors.recipientEmail}
            />
            
            <TextField
              fullWidth
              variant="outlined"
              label="Amount"
              name="amount"
              type="number"
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': { borderColor: 'divider' }
                }
              }}
              value={formik.values.amount}
              onChange={formik.handleChange}
              error={formik.touched.amount && !!formik.errors.amount}
              helperText={formik.touched.amount && formik.errors.amount}
            />

            <Button 
              type="submit" 
              variant="contained" 
              size="large"
              sx={{
                mt: 2,
                py: 2,
                borderRadius: 2,
                fontWeight: 700,
                fontSize: '1rem',
                textTransform: 'uppercase',
                letterSpacing: 1,
                boxShadow: 3,
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: 4
                },
                transition: 'all 0.2s ease'
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Initiate Transfer'}
            </Button>
          </Box>
        </form>
      </Box>

      {/* Transaction History*/}
      <Box sx={{ 
        backgroundColor: 'background.paper',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: 1
      }}>
        <Typography variant="h6" sx={{ 
          p: 3,
          fontWeight: 600,
          backgroundColor: 'grey.50',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          Transaction History
        </Typography>
        
        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: 'grey.50' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Type</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: 'text.secondary' }}>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow 
                  key={transaction.id}
                  sx={{ 
                    '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                    '&:last-child td': { border: 0 },
                    '&:hover': { backgroundColor: 'action.selected' }
                  }}
                >
                  <TableCell sx={{ color: 'text.secondary' }}>
                    {new Date(transaction.timestamp).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{transaction.description}</TableCell>
                  <TableCell>
                    <Box component="span" sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      backgroundColor: transaction.transactionType === 'Recieve' ? 
                        'success.light' : 'error.light',
                      color: transaction.transactionType === 'Recieve' ? 
                        'success.contrastText' : 'error.contrastText',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase'
                    }}>
                      {transaction.transactionType}
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 500 }}>
                    <Box component="span" sx={{ 
                      color: transaction.transactionType === 'Recieve' ? 
                        'success.main' : 'error.main'
                    }}>
                      {transaction.transactionType === 'Recieve' ? '+' : '-'}K{transaction.amount.toFixed(2)}
                    </Box>
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
          sx={{ 
            p: 3,
            '& .MuiPagination-ul': { justifyContent: 'center' }
          }}
          shape="rounded"
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>
    </Container>
  );
};

export default Dashboard;