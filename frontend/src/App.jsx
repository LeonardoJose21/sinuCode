import React, { useEffect, useState } from "react";
import {
 BrowserRouter, Routes, Route, Navigate,
 // Remove useNavigate import from here
} from "react-router-dom";
import axios from "axios";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import './index.css';
import Header from "./components/Header";
import { ProblemProvider } from "./ProblemContext";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants"; // Ensure you have REFRESH_TOKEN if used
import LandingPage from "./pages/landing";
import SurveyPage from "./pages/Encuesta";
import SolicitarMonitoriaForm from "./pages/SolicitarMonitoria";
import Posiciones from "./pages/Pocisiones";
import SolvedProblemsPage from "./pages/EjResueltos";


// Remove the LogOut component definition as it's not needed
// const LogOut = () => {
//  const navigate = useNavigate();
//  localStorage.clear()
//  return navigate('/login')
// }


function RegisterAndLogout() {
  // Clear local storage when rendering register, just in case
 localStorage.clear();
 return <Register />;
}

function App() {
 const [user, setUser] = useState({
  name: '',
  career: '',
  isLoggedIn: false, // Default to false
  });

  // Remove useNavigate() from here
  // const navigate = useNavigate(); // NOT HERE

  // Function to handle logout
  const handleLogout = () => {
      console.log("Logging out...");
      localStorage.clear(); // Clear authentication tokens (ACCESS_TOKEN, REFRESH_TOKEN, etc.)
      // Set user state to logged out. ProtectedRoute will handle the navigation.
      setUser({ name: '', career: '', isLoggedIn: false });
      // refresh the page to ensure all components are updated
      window.location.reload();
  };

 useEffect(() => {
  const fetchUserData = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);

    if (!token) {
            // If no token exists, user is not logged in. Ensure state reflects this.
      console.log('No token found on mount. User is not logged in.');
      setUser({ name: '', career: '', isLoggedIn: false }); // Explicitly set to not logged in
      return;
     }

    try {
            console.log('Token found. Attempting to fetch user data...');
      const response = await axios.get(import.meta.env.VITE_API_URL + 'api/user/', {
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        }
      });

      const data = response.data; // axios puts data directly in response.data
            console.log('User data fetched successfully:', data);
      setUser({
       name: data.nombre_completo,
       career: data.programa_academico,
       isLoggedIn: true, // Set to true if data fetched successfully
      });

    } catch (error) {
    console.error('Error fetching user data:', error);
        // If fetching user data fails (e.g., invalid or expired token),
        // treat as logged out. handleLogout clears tokens and sets isLoggedIn=false.
        // ProtectedRoute will then redirect based on isLoggedIn state.
        handleLogout();
    }
   };

   // Check immediately on mount and whenever the login status might change
     // (though isLoggedIn change is a result of this fetch or logout)
     // Running once on mount is generally sufficient for initial check.
   fetchUserData();

  }, [user.isLoggedIn]); // Empty dependency array means this effect runs once after the initial render


  // The Header is placed inside the BrowserRouter, so it has access to routing context.
  // It receives the user state and the handleLogout function.
  return (
   <BrowserRouter>
        {/* Header is inside the Router context */}
    <Header user={user} onLogout={handleLogout} />
    <Routes>
     {/* Protected Routes */}
         {/* ProtectedRoute uses the isAuthenticated prop to decide whether to render */}
         {/* or redirect using its own useNavigate hook internally. */}
     <Route
      path="/"
      element={
       <ProtectedRoute isAuthenticated={user.isLoggedIn}> {/* Pass auth status */}
        <ProblemProvider>
         <Home />
        </ProblemProvider>
       </ProtectedRoute>
      }
     />
     <Route path="/encuesta" element={
             <ProtectedRoute isAuthenticated={user.isLoggedIn}>
               <ProblemProvider>
         <SurveyPage />
        </ProblemProvider>
             </ProtectedRoute>
     } />
     <Route path="/solicitud" element={
             <ProtectedRoute isAuthenticated={user.isLoggedIn}>
        <ProblemProvider>
         <SolicitarMonitoriaForm />
        </ProblemProvider>
             </ProtectedRoute>
     } />
     <Route path="/problemas_resueltos" element={
             <ProtectedRoute isAuthenticated={user.isLoggedIn}>
        <ProblemProvider>
         <SolvedProblemsPage />
        </ProblemProvider>
             </ProtectedRoute>
     } />
     <Route path="/tablero_posiciones" element={
             <ProtectedRoute isAuthenticated={user.isLoggedIn}>
               <Posiciones />
             </ProtectedRoute>
         } />


         {/* Public Routes (or routes handling auth) */}
     <Route path="/login" element={<Login />} />
     <Route path="/landing" element={<LandingPage />} />
         {/* RegisterAndLogout clears localStorage and renders Register */}
     <Route path="/register" element={<RegisterAndLogout />} />

         {/* Handle redirects for login/register if user is already logged in */}
         {/* Add these if you want users to be redirected AWAY from auth pages when logged in */}
         {/* <Route
             path="/login"
             element={user.isLoggedIn ? <Navigate to="/" replace /> : <Login />}
         />
         <Route
             path="/register"
             element={user.isLoggedIn ? <Navigate to="/" replace /> : <RegisterAndLogout />}
         /> */}

     <Route path="*" element={<NotFound />}></Route>
    </Routes>
   </BrowserRouter>
  )
}

export default App;