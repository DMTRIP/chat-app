import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import Routes from '../Routes';
import './App.scss';
import './Reset.scss';
import store from '../../redux/store';

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Router>
          <Routes />
        </Router>
      </Provider>
    </div>
  );
}

export default App;
