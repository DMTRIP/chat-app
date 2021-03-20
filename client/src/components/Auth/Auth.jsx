import React, { useState } from 'react';
import './Auth.scss';
import circleShadow from './images/circle-shadow.png';
import classNames from 'classnames';

export default function Auth({
  icon,
  handleSubmit,
  error,
  register,
  submitText,
  flip,
  title,
}) {
  const [state, setState] = useState({});

  const handleChange = (name) => (e) =>
    setState({ ...state, [name]: e.target.value });

  function onSubmit(e) {
    e.preventDefault();
    handleSubmit(state);
  }

  return (
    <div className={classNames({ auth: true, 'auth--register': register })}>
      <form action="#" onSubmit={onSubmit} className="auth__form">
        <div className="auth__icon">
          <img src={circleShadow} className="auth__circle-shadow" />
          <div className="auth__circle">
            <div className="auth__user">{icon}</div>
          </div>
        </div>
        <div className="auth__title">{title}</div>
        {register && (
          <input
            required
            onChange={handleChange('nickname')}
            placeholder="Nickname"
            className="auth__input"
          />
        )}
        <input
          required
          onChange={handleChange('email')}
          placeholder="Email"
          type="email"
          className="auth__input"
        />
        <input
          required
          onChange={handleChange('password')}
          placeholder="Password"
          type="password"
          className="auth__input"
        />
        <button type="submit" className="auth__submit">
          {submitText}
        </button>
        {error && <p className="auth__error">{error}</p>}
        <div className="auth__flip">{flip}</div>
      </form>
    </div>
  );
}
