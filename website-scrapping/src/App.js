import React from "react";
import { Routes, Route } from "react-router-dom";
import CombinedPage from "./components/CombinedPage";
import CompanyDetails from "./components/CompanyDetails";
import "./App.css";
import { ToastProvider } from "./hooks.js/useToast";

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route exact path="/" element={<CombinedPage />} />
        <Route path="/company/:id" element={<CompanyDetails />} />
      </Routes>
    </ToastProvider>
  );
}

export default App;
