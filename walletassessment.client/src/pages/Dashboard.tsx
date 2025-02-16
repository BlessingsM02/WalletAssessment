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
  Alert 
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface Balance {
  total: number;
  currencies: { currency: string; amount: number }[];
}

interface Transaction {
  id: string;
  amount: number;
  type: string;
  timestamp: string;
  description: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<Balance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const balanceRes = await api.get('/wallet/balance', { 
          params: { email: user?.email } 
        });
        
        // Verify the response structure here
        console.log('API Response:', balanceRes.data.balance);
        
        setBalance(balanceRes.data.balance);
        
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchData();
    }
  }, [user?.email]);

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
        Welcome, {user?.email}!
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
                K {balance}
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
                    {balance?.currencies?.map((entry, index) => (
                      <Cell 
                        key={entry.currency} 
                        fill={['#0088FE', '#00C49F', '#FFBB28'][index % 3]} 
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Transactions - Removed for simplicity */}
      </Grid>
    </Container>
  );
};

export default Dashboard;