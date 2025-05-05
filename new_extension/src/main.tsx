
import { createRoot } from 'react-dom/client'
import './index.css'
import { HashRouter, Navigate, Route, Routes } from 'react-router';
import App from './App.tsx'
import { ClerkProvider,SignIn, useAuth } from '@clerk/clerk-react';


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
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
<ClerkProvider publishableKey={PUBLISHABLE_KEY} >
<HashRouter>
  <Routes>
      <Route path="/" element={
        <ProtectedRoute>
        <App />
      </ProtectedRoute>
      } />
      <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
    </Routes>
</HashRouter>
  
</ClerkProvider>
  
)
