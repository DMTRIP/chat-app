import React from 'react';
import './LoginPage.scss';
import Auth from '../../Auth';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../../redux/actions';
import { Link, Redirect } from 'react-router-dom';
import UserIcon from './UserIcon';

export default function LoginPage() {
  const dispatch = useDispatch();
  const { loginError, isAuth } = useSelector((state) => state);

  function handleSubmit({ email, password }) {
    dispatch(login(email, password));
  }

  if (isAuth) {
    return <Redirect to="/" />;
  }

  return (
    <div className="login-page">
      <Auth
        icon={<UserIcon />}
        flip={<Link to="/recovery">Forgot Password?</Link>}
        title="Member Login"
        submitText="login"
        handleSubmit={handleSubmit}
        error={loginError}
      />
    </div>
  );
}
