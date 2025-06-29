
import React from 'react';
import LoginForm from '../../components/Auth/LoginForm';

const LoginPage = ({ onAuthChange }) => {
  return <LoginForm onAuthChange={onAuthChange} />;
};

export default LoginPage;