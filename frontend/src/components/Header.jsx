import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link, useLocation } from 'react-router-dom';

const Header = ({ user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isLandingPage = location.pathname === '/landing';
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`bg-slate-900 text-white p-4 flex justify-between items-center w-full ${isLandingPage ? 'fixed' : ''}`}>
      <Link className="flex items-center space-x-4" to="/landing#hero">
        <img src="/logo.png" alt="Logo" className="h-12 w-12" />
        <span className="text-2xl font-bold mr-4">SinúCode</span>
      </Link>

      {isLandingPage ? (
        <>
          <button 
            className="sm:hidden text-white" 
            onClick={toggleMobileMenu}
          >
            {/* Hamburger icon */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          
          {/* Mobile Menu */}
          <div 
            className={`sm:hidden absolute top-full right-0 mt-2 w-48 bg-slate-900 rounded-lg shadow-lg z-10 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'scale-100' : 'scale-0'}`}
          >
            <ul className="flex flex-col space-y-2 p-4 font-semibold">
              <li><a href="#features" className="hover:text-green-600 block">Características</a></li>
              <li><a href="#about" className="hover:text-green-600 block">Acerca de</a></li>
              <li><a href="#contact" className="hover:text-green-600 block">Contacto</a></li>
              <hr className="my-3" />
              <li><a href="/" className="hover:text-green-600 block">Iniciar Sesión</a></li>
              <li><a href="/register" className="bg-green-600 p-2 rounded hover:bg-green-600/30 block">Registrarse</a></li>
            </ul>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden sm:flex space-x-4 font-semibold">
            <li><a href="#features" className="hover:text-green-600">Características</a></li>
            <li><a href="#about" className="hover:text-green-600">Acerca de</a></li>
            <li><a href="#contact" className="hover:text-green-600 mr-10">Contacto</a></li>
            <li><a href="/" className="hover:text-green-600">Iniciar Sesión</a></li>
            <li><a href="/register" className="bg-green-600 p-2 rounded hover:bg-green-600/30">Registrarse</a></li>
          </ul>
        </>
      ) : (
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs">{user.career}</p>
          </div>
          {!isLoginPage && !isRegisterPage && (
            <Button
            onClick={onLogout}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            {user.isLoggedIn ? 'Cerrar Sesión' : 'Iniciar Sesión'}
          </Button>
          )}
          
        </div>
      )}
    </header>
  );
};

export default Header;
