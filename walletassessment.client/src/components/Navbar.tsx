import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={{ backgroundColor: '#1E3A8A', padding: '1rem', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/" style={{ color: 'white', fontWeight: '600', textDecoration: 'none' }}>Home</Link>
          {user ? (
            <>
              <Link to="/profile" style={{ color: 'white', fontWeight: '600', textDecoration: 'none' }}>Profile</Link>
              <Link to="/dashboard" style={{ color: 'white', fontWeight: '600', textDecoration: 'none' }}>Dashboard</Link>
              <Link to="/transaction" style={{ color: 'white', fontWeight: '600', textDecoration: 'none' }}>Transactions</Link>
              <Link to="/transfer" style={{ color: 'white', fontWeight: '600', textDecoration: 'none' }}>Transfer</Link>
              <button 
                onClick={logout} 
                style={{ backgroundColor: 'white', color: 'black', padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: 'white', fontWeight: '600', textDecoration: 'none' }}>Login</Link>
              <Link to="/register" style={{ color: 'white', fontWeight: '600', textDecoration: 'none' }}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
