import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStatus } from '../hooks/useAuthStatus';
import Spinner from './Spinner';

const PrivateRoute = () => {
  const { loggedIn, checkingAuthStatus } = useAuthStatus();

  // todo: show a spinner
  if (checkingAuthStatus) {
    return <Spinner />;
  }

  // Outlet will be our nested Route @ App.js
  // In this implementation, we want a private profile route
  return loggedIn ? <Outlet /> : <Navigate to='/sign-in' />;
};

export default PrivateRoute;
