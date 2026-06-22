import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-theme-muted">
        Loading...
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default GuestRoute;
