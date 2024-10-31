// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './sign-in/SignIn';
import SignUp from '../src/sign-up/SignUp'; // your signup component
import MarketingPage from './MarketingPage'; // your marketing page component
import ChatWithAI from './components/ChatWithAI';
import AppTheme from './shared-theme/AppTheme';
import { CssBaseline } from '@mui/material';
function App() {
  return (
    <Router>
      <AppTheme >
      <CssBaseline enableColorScheme />
      <Routes>
        <Route path="/" element={<MarketingPage />}/>
        <Route path="/login" element={<SignIn/>} />
        <Route path="/signup" element={<SignUp/>} />
        
        <Route path="/chatwithai" element={<ChatWithAI/>}/>
      
      </Routes>
      </AppTheme>
    </Router>
  );
}

export default App;
