import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>Wallet App</h1>
      {user ? (
        <div>
          <p>Welcome back, {user.email}!</p>
          <Link to="/dashboard">Go to Dashboard</Link>
        </div>
      ) : (
        <div>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
    </div>
  );
};

export default Home;