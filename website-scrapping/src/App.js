
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CombinedPage from './components/CombinedPage';
// import CompanyList from './components/CompanyList';
import CompanyDetails from './components/CompanyDetails';
import './App.css';

function App() {
  return (  
      <Routes>
        <Route exact path="/" element={<CombinedPage />} />
        {/* <Route path="/companies" element={<CompanyList />} /> */}
        <Route path="/company/:id" element={<CompanyDetails />} />

      </Routes>
  );
}

export default App;