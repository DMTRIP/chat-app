import React from 'react';
import Auth from '../../Auth';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import EditIcon from './EditIcon';
import { register } from '../../../redux/actions';

export default function RegisterPage() {
  const { registerError, isAuth } = useSelector((state) => state);
  const dispatch = useDispatch();

  if (isAuth) {
    return <Redirect to="/" />;
  }

  function handleSubmit({ email, nickname, password }) {
    dispatch(register({ email, nickname, password }));
  }

  return (
    <div className="RegisterPage">
      <Auth
        register
        icon={<EditIcon />}
        flip={<Link to="/login">Member Login</Link>}
        title="Register"
        submitText="register"
        handleSubmit={handleSubmit}
        error={registerError}
      />
    </div>
  );
}
