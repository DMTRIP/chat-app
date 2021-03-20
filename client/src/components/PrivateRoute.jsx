import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { fetchUser } from '../redux/actions';

export default function PrivateRoute({ path, component }) {
  return (
    <Route exact
      path={path}
      render={() => <RenderComponent component={component} />}
    />
  );
}

function RenderComponent({ component: Component }) {
  const { isAuth, userLoading } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, []);

  if (userLoading) {
    return <h1>User loading</h1>;
  }

  if (!isAuth) {
    return <Redirect to="/login" />;
  }

  return <Component />;
}
