
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import App from './App.tsx'
import { SignIn, useAuth } from '@clerk/clerk-react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth();
  
  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  
  if (!isSignedIn) {
    return <Navigate to="/sign-in" />;
  
  }
  return <>{children}</>;
};

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <Routes>
      <Route path="/" element={
        <ProtectedRoute>
        <App />
      </ProtectedRoute>
      } />
      <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
    </Routes>
</BrowserRouter>
  
  
)
