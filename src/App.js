import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import CompanyList from './components/CompanyList';
import CompanyDetails from './components/CompanyDetails';
import './App.css';

function App() {
  return (  
    <Router>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/companies" element={<CompanyList />} />
        <Route path="/company/:id" element={<CompanyDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
