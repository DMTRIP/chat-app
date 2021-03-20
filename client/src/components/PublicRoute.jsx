import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchUser } from '../redux/actions';

export default function PublicRoute({ path, component }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, []);

  return <Route path={path} component={component} />;
}
