import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  AppBar,
  Toolbar,
  Container,
  Button,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Navbar = () => {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const mobileMenuId = 'primary-search-account-menu-mobile';

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ 
      backgroundColor: 'background.paper',
      boxShadow: 1,
      borderBottom: `1px solid ${theme.palette.divider}`
    }}>
      <Container maxWidth="xl">
        <Toolbar sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          padding: '0 !important'
        }}>
          {/* Left */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Typography
              variant="h6"
              component={Link}
              to="/Dashboard"
              sx={{
                textDecoration: 'none',
                fontWeight: 700,
                color: 'primary.main',
                letterSpacing: 1
              }}
            >
              DIGITAL WALLET
            </Typography>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
              {user && (
                <>
                  <Button
                    component={Link}
                    to="/dashboard"
                    sx={{
                      color: 'text.primary',
                      '&:hover': { backgroundColor: 'action.hover' }
                    }}
                  >
                    Dashboard
                  </Button>
                  <Button
                    component={Link}
                    to="/profile"
                    sx={{
                      color: 'text.primary',
                      '&:hover': { backgroundColor: 'action.hover' }
                    }}
                  >
                    Profile
                  </Button>
                </>
              )}
            </Box>
          </Box>

          {/* Right Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {user ? (
              <>
                <IconButton
                  size="large"
                  edge="end"
                  onClick={logout}
                  sx={{
                    color: 'error.main',
                    '&:hover': { backgroundColor: 'error.light' }
                  }}
                >
                  <ExitToAppIcon />
                </IconButton>
                
                {/* Mobile Menu */}
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="menu"
                  aria-controls={mobileMenuId}
                  onClick={handleMenuOpen}
                  sx={{ display: { md: 'none' } }}
                >
                  <MenuIcon />
                </IconButton>

                <Menu
                  id={mobileMenuId}
                  anchorEl={anchorEl}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  keepMounted
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem 
                    component={Link} 
                    to="/dashboard"
                    onClick={handleMenuClose}
                  >
                    Dashboard
                  </MenuItem>
                  <MenuItem 
                    component={Link} 
                    to="/profile"
                    onClick={handleMenuClose}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  sx={{
                    color: 'primary.main',
                    borderColor: 'primary.main',
                    '&:hover': { borderColor: 'primary.dark' }
                  }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  sx={{
                    backgroundColor: 'primary.main',
                    '&:hover': { backgroundColor: 'primary.dark' }
                  }}
                >
                  Register
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;