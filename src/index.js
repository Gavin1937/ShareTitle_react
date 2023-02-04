import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Main from './pages/Main'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route exact path="/" element={ <Navigate to="/sharetitle" /> } />
      <Route exact path="/sharetitle" element={ <Main /> } />
    </Routes>
  </Router>
);
