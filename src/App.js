import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import SignUp from './components/SignUp';
import Mail from './components/Mail';
import Inbox from './components/Inbox';
import SentMail from './components/SentMail';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/mail" element={<Mail />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/sent" element={<SentMail />} />
        </Routes>

      </Router>
    </>
  );
}

export default App;
