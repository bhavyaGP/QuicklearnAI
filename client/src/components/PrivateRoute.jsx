import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, allowedRoles }) => {
  const userInfo = JSON.parse(localStorage.getItem('user-info'));
  
  // If user is not logged in, redirect to login
  if (!userInfo) {
    return <Navigate to="/" replace />;
  }

  // If user's role is not in allowed roles, redirect to their dashboard
  if (!allowedRoles.includes(userInfo.role)) {
    return <Navigate to={userInfo.role === 'teacher' ? '/teacher-dashboard' : '/dashboard'} replace />;
  }

  // If all checks pass, render the protected component
  return element;
};

export default PrivateRoute; 