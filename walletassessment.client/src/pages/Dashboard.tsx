// src/pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface Balance {
  total: number;
  currencies: CurrencyBalance[];
}

interface CurrencyBalance {
  currency: string;
  amount: number;
  rate: number;
}

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  date: string;
  description: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<Balance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [balanceRes, transactionsRes] = await Promise.all([
          api.get('/balance') as Promise<{ data: Balance }>,
          api.get('/transactions') as Promise<{ data: Transaction[] }>
        ]);
        
        setBalance(balanceRes.data);
        setTransactions(transactionsRes.data.slice(0, 5));
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.email}!
      </Typography>

      <Grid container spacing={3}>
        {/* Total Balance Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Total Balance
              </Typography>
              <Typography variant="h3">
                ${balance?.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Currency Distribution Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Currency Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={balance?.currencies || []}
                    dataKey="amount"
                    nameKey="currency"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {balance?.currencies.map((entry, index) => (
                      <Cell key={entry.currency} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Transactions Table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Currency</TableCell>
                    <TableCell>Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {new Date(transaction.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell
                        sx={{
                          color: transaction.type === 'deposit' ? 'success.main' : 'error.main'
                        }}
                      >
                        {transaction.type === 'deposit' ? '+' : '-'}
                        {transaction.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>{transaction.currency}</TableCell>
                      <TableCell>
                        <Typography
                          variant="caption"
                          sx={{
                            textTransform: 'capitalize',
                            color: transaction.type === 'deposit' ? 'success.main' : 'error.main'
                          }}
                        >
                          {transaction.type}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {transactions.length === 0 && (
                <Typography sx={{ p: 2 }}>No recent transactions</Typography>
              )}
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;