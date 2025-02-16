import { useState } from 'react';
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
  Box
} from '@mui/material';

const TransferSchema = Yup.object().shape({
  amount: Yup.number()
    .min(0.01, 'Amount must be at least $0.01')
    .required('Required'),
  recipientEmail: Yup.string()
    .email('Invalid email')
    .required('Required'),
  description: Yup.string()
    .max(100, 'Description too long')
});

const Transfer = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
        
        await api.post('/wallet/transfer',{ 
            params: { email: user?.email } 
          } ,values);
        
        setSuccess('Transfer completed successfully!');
        formik.resetForm();
      } catch (err) {
        setError('Transfer failed. Please check the details and try again.');
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Transfer Funds
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Recipient Email"
          name="recipientEmail"
          value={formik.values.recipientEmail}
          onChange={formik.handleChange}
          error={formik.touched.recipientEmail && !!formik.errors.recipientEmail}
          helperText={formik.touched.recipientEmail && formik.errors.recipientEmail}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Amount"
          name="amount"
          type="number"
          value={formik.values.amount}
          onChange={formik.handleChange}
          error={formik.touched.amount && !!formik.errors.amount}
          helperText={formik.touched.amount && formik.errors.amount}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Description"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          error={formik.touched.description && !!formik.errors.description}
          helperText={formik.touched.description && formik.errors.description}
        />

        <Box sx={{ mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            fullWidth
            size="large"
          >
            {loading ? <CircularProgress size={24} /> : 'Transfer Funds'}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default Transfer;