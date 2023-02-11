import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

// include bootstrap css
import 'bootstrap/dist/css/bootstrap.css';

// other pages
import Main from './pages/Main';
import Login from './pages/Login';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route exact path="/" element={ <Navigate to="/home" /> } />
      <Route exact path="/home" element={ <Main /> } />
      <Route exact path="/login" element={ <Login /> } />
    </Routes>
  </Router>
);
