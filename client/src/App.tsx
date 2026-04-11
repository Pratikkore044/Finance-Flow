import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { FinancialRecordsProvider } from './context/financial-record-context';

// --- IMPORTS ---
import HomePage from './pages/HomePage'; 
import Dashboard from './pages/Dashboard'; // Updated path if you moved it to pages/dashboard/index.tsx
import Transactions from './pages/TransactionsPage'; // Import the new page

function App() {
  return (
    <Router>
      <div className='app-container'>
        <Routes>
          {/* Route 1: Landing Page (Public) */}
          <Route
            path="/"
            element={
              <>
                <SignedIn>
                  <Navigate to="/dashboard" replace />
                </SignedIn>
                <SignedOut>
                  <HomePage />
                </SignedOut>
              </>
            }
          />

          <Route path="/dashboard" element={
            <SignedIn>
              <FinancialRecordsProvider>
                 <Dashboard /> 
              </FinancialRecordsProvider>
            </SignedIn>
          }/>

          {/* TRANSACTIONS ROUTE */}
          <Route path="/transactions" element={
            <SignedIn>
              <FinancialRecordsProvider>
                 <Transactions /> 
              </FinancialRecordsProvider>
            </SignedIn>
          }/>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;