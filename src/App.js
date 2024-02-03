import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import SignUp from './components/SignUp';
import Mail from './components/Mail';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/mail" element={<Mail />} />
        </Routes>

      </Router>
    </>
  );
}

export default App;
