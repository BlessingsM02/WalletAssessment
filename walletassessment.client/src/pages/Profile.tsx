// src/pages/Profile.tsx
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Divider,
  Box,
  FormControlLabel,
  Switch
} from '@mui/material';

interface ProfileFormValues {
  email: string;
  name?: string;
}

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Profile Form Configuration
  const profileForm = useFormik<ProfileFormValues>({
    initialValues: {
      email: user?.email || '',
      name: user?.name || ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      username: Yup.string()
        .min(3, 'Username must be at least 3 characters')
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError('');
        // await api.put('/user', values);
        setSuccess('Profile updated successfully');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError('Failed to update profile');
      } finally {
        setLoading(false);
      }
    }
  });

  // Password Form Configuration
  const passwordForm = useFormik<PasswordFormValues>({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required('Current password is required'),
      newPassword: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('New password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords must match')
        .required('Confirm password is required')
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError('');
        // await api.post('/change-password', values);
        passwordForm.resetForm();
        setSuccess('Password changed successfully');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError('Failed to change password');
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Account Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Button
                fullWidth
                variant={activeTab === 'profile' ? 'contained' : 'text'}
                onClick={() => setActiveTab('profile')}
                sx={{ mb: 1 }}
              >
                Profile
              </Button>
              <Button
                fullWidth
                variant={activeTab === 'security' ? 'contained' : 'text'}
                onClick={() => setActiveTab('security')}
              >
                Security
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={9}>
          {activeTab === 'profile' ? (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>

                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <form onSubmit={profileForm.handleSubmit}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Email"
                    name="email"
                    value={profileForm.values.email}
                    onChange={profileForm.handleChange}
                    error={profileForm.touched.email && Boolean(profileForm.errors.email)}
                    helperText={profileForm.touched.email && profileForm.errors.email}
                  />

                  <TextField
                    fullWidth
                    margin="normal"
                    label="Name"
                    name="name"
                    value={profileForm.values.name}
                    onChange={profileForm.handleChange}
                    error={profileForm.touched.name && Boolean(profileForm.errors.name)}
                    helperText={profileForm.touched.name && profileForm.errors.name}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{ mt: 2 }}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Security Settings
                </Typography>

                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Change Password
                  </Typography>
                  <form onSubmit={passwordForm.handleSubmit}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Current Password"
                      name="currentPassword"
                      type="password"
                      value={passwordForm.values.currentPassword}
                      onChange={passwordForm.handleChange}
                      error={passwordForm.touched.currentPassword && Boolean(passwordForm.errors.currentPassword)}
                      helperText={passwordForm.touched.currentPassword && passwordForm.errors.currentPassword}
                    />

                    <TextField
                      fullWidth
                      margin="normal"
                      label="New Password"
                      name="newPassword"
                      type="password"
                      value={passwordForm.values.newPassword}
                      onChange={passwordForm.handleChange}
                      error={passwordForm.touched.newPassword && Boolean(passwordForm.errors.newPassword)}
                      helperText={passwordForm.touched.newPassword && passwordForm.errors.newPassword}
                    />

                    <TextField
                      fullWidth
                      margin="normal"
                      label="Confirm New Password"
                      name="confirmPassword"
                      type="password"
                      value={passwordForm.values.confirmPassword}
                      onChange={passwordForm.handleChange}
                      error={passwordForm.touched.confirmPassword && Boolean(passwordForm.errors.confirmPassword)}
                      helperText={passwordForm.touched.confirmPassword && passwordForm.errors.confirmPassword}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      sx={{ mt: 2 }}
                    >
                      {loading ? 'Changing...' : 'Change Password'}
                    </Button>
                  </form>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Two-Factor Authentication
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={twoFactorEnabled}
                        onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                      />
                    }
                    label="Enable two-factor authentication"
                  />
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Account Actions
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={logout}
                  >
                    Logout
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;