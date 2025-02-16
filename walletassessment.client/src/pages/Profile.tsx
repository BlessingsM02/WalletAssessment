import { useAuth } from '../context/AuthContext';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar
} from '@mui/material';
import { deepPurple } from '@mui/material/colors';

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <Container maxWidth="md" sx={{ 
      mt: 4,
      mb: 6,
      backgroundColor: 'background.paper',
      borderRadius: 4,
      p: 4,
      boxShadow: 3
    }}>
      <Typography variant="h4" gutterBottom sx={{
        textAlign: 'center',
        fontWeight: 700,
        color: 'primary.main',
        mb: 4,
        textTransform: 'uppercase',
        letterSpacing: 1
      }}>
        User Profile
      </Typography>

      
        <Grid item xs={12} md={4}>
          <Card sx={{
            borderRadius: 2,
            boxShadow: 3,
            textAlign: 'center',
            p: 3
          }}>
            <Avatar sx={{
              width: 100,
              height: 100,
              bgcolor: deepPurple[500],
              fontSize: '2.5rem',
              margin: '0 auto 1rem'
            }}>
              {user?.name?.[0] || user?.email?.[0]}
            </Avatar>
            
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {user?.name || 'Anonymous User'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Button
              fullWidth
              variant="contained"
              color="error"
              onClick={logout}
              sx={{
                borderRadius: 2,
                py: 1.5,
                textTransform: 'uppercase',
                letterSpacing: 1,
                boxShadow: 2
              }}
            >
              Sign Out
            </Button>
          </Card>
        </Grid>

      
    </Container>
  );
};

export default Profile;