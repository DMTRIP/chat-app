import React from 'react';
import PrivateRoute from './PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PublicRoute from './PublicRoute';
import ChatPage from './pages/ChatPage';

export default function Routes() {
  return (
    <div className="Routes">
      <PrivateRoute component={ChatPage} path="/" />
      <PublicRoute path="/login" component={LoginPage} />
      <PublicRoute path="/register" component={RegisterPage} />
    </div>
  );
}
