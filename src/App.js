import {BrowserRouter as Router } from 'react-router-dom';
import Routes from './routes'

import './App.css';
import { ListUsersProvider } from './Context/UserContext';

function App() {
  return (
    <Router>
      <ListUsersProvider>
      <Routes />
      </ListUsersProvider>
    </Router>
  );
}

export default App;
