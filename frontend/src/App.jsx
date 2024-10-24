// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './sign-in/SignIn';
import SignUp from '../src/sign-up/SignUp'; // your signup component
import MarketingPage from './MarketingPage'; // your marketing page component
function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<MarketingPage />}/>
        <Route path="/login" element={<SignIn/>} />
        <Route path="/signup" element={<SignUp/>} />

      </Routes>
    </Router>
  );
}

export default App;
