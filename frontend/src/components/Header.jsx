import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Link, useLocation } from 'react-router-dom';
// Import lucide-react icons, including ClipboardList
import { LogOut, Home, CheckCircle, BarChart, User as UserIcon, ClipboardList } from 'lucide-react';

const Header = ({ user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();

  // Refs for dropdowns to close them when clicking outside
  const mobileMenuRef = useRef(null);
  const userMenuRef = useRef(null);
  const mobileMenuButtonRef = useRef(null); // Ref for the burger button itself
  const userMenuButtonRef = useRef(null); // Ref for the user button itself

  const isLandingPage = location.pathname === '/landing';
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';

  // Function to close both menus
  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  // Toggle functions using functional state updates
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prevState => !prevState); // Use functional update
    setIsUserMenuOpen(false); // Close user menu
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(prevState => !prevState); // Use functional update
    setIsMobileMenuOpen(false); // Close mobile menu
  };

  // Close menus on route change
  useEffect(() => {
    closeMenus();
  }, [location.pathname]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside mobile menu AND not the burger button
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) &&
          mobileMenuButtonRef.current && !mobileMenuButtonRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
      // Check if click is outside user menu AND not the user button
      if (userMenuRef.current && !userMenuRef.current.contains(event.target) &&
          userMenuButtonRef.current && !userMenuButtonRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuRef, userMenuRef, mobileMenuButtonRef, userMenuButtonRef]);


  const activeLinkStyle = "text-green-500 font-bold underline underline-offset-4"; // Style for active links

  // Determine which links to show based on login status and page
  const showNavAndUserInfo = !isLoginPage && !isRegisterPage && user.isLoggedIn === true;

  // Helper component for navigation links
  const NavLinks = ({ isMobile = false }) => (
    <>
      <Link
        to="/"
        className={`flex items-center text-sm font-semibold hover:text-green-500 transition-colors ${location.pathname === '/' ? activeLinkStyle : ''}`}
        onClick={isMobile ? closeMenus : undefined} // Close menu on mobile click
      >
        <Home className={`inline-block ${isMobile ? 'mr-3' : 'mr-2'}`} size={isMobile ? 20 : 16} /> Inicio
      </Link>
      <Link
        to="/problemas_resueltos"
        className={`flex items-center text-sm font-semibold hover:text-green-500 transition-colors ${location.pathname === '/problemas_resueltos' ? activeLinkStyle : ''}`}
        onClick={isMobile ? closeMenus : undefined}
      >
        <CheckCircle className={`inline-block ${isMobile ? 'mr-3' : 'mr-2'}`} size={isMobile ? 20 : 16} /> Problemas resueltos
      </Link>
      <Link
        to="/tablero_posiciones"
        className={`flex items-center text-sm font-semibold hover:text-green-500 transition-colors ${location.pathname === '/tablero_posiciones' ? activeLinkStyle : ''}`}
        onClick={isMobile ? closeMenus : undefined}
      >
        <BarChart className={`inline-block ${isMobile ? 'mr-3' : 'mr-2'}`} size={isMobile ? 20 : 16} /> Tablero de posiciones
      </Link>
      <Link
        to="/solicitud"
        className={`flex items-center text-sm font-semibold hover:text-green-500 transition-colors ${location.pathname === '/solicitud' ? activeLinkStyle : ''}`}
        onClick={isMobile ? closeMenus : undefined}
      >
         <UserIcon className={`inline-block ${isMobile ? 'mr-3' : 'mr-2'}`} size={isMobile ? 20 : 16} /> Solicitar monitoria
      </Link>
      {/* Encuesta Link with Icon */}
      <Link
        to="/encuesta"
        className={`flex items-center text-sm font-semibold hover:text-green-500 transition-colors ${location.pathname === '/encuesta' ? activeLinkStyle : ''}`}
         onClick={isMobile ? closeMenus : undefined}
      >
         <ClipboardList className={`inline-block ${isMobile ? 'mr-3' : 'mr-2'}`} size={isMobile ? 20 : 16} /> Encuesta
      </Link>
    </>
  );


  return (
    <header className={`bg-slate-900 text-white p-2 flex items-center justify-between w-full ${isLandingPage ? 'fixed top-0 left-0 w-full z-50' : ''}`}>

      {/* Left Section: Logo and Desktop Nav Links */}
      <div className="flex items-center space-x-6"> {/* space-x-6 creates gap between logo and nav start */}
         {/* Logo */}
         <Link className="flex items-center space-x-2" to="/landing#hero">
           <img src="/logo.png" alt="Logo" className="h-12 w-12" />
           {isLandingPage || isLoginPage || isRegisterPage  &&(<span className="text-2xl font-bold">SinúCode</span>)}
         </Link>

         {/* Desktop Navigation Links */}
         {showNavAndUserInfo && (
            <nav className="hidden sm:flex items-center space-x-6"> {/* space-x-6 for links */}
               <NavLinks />
            </nav>
         )}
      </div>


      {/* Right Section: Desktop User Info and Mobile Burger Button */}
      <div className="flex items-center"> {/* This container aligns right */}

        {/* Desktop User Info & Logout Toggle */}
        {showNavAndUserInfo && user && (
          <div className="hidden sm:flex relative" ref={userMenuRef}> {/* Added hidden sm:flex and relative */}
            <button
              ref={userMenuButtonRef} // Attach ref to the button
              onClick={toggleUserMenu}
              className="text-lg ml-3 font-semibold text-white flex items-center space-x-2 focus:outline-none"
              aria-label="User menu"
            >
              {/* Styled first letter */}
              <span className="flex items-center justify-center w-9 h-9 bg-green-600 text-white rounded-full font-bold text-base"> {/* Slightly larger */}
                {user.name ? user.name[0] : <UserIcon size={20} />} {/* Fallback icon if name is missing */}
              </span>
            </button>

            {/* User Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute top-full right-0 mt-2 bg-slate-800 text-white p-3 rounded-lg shadow-lg w-48 z-20 border border-slate-700 animate-fade-in"> {/* Added animation class */}
                <div className="flex flex-col space-y-3">
                  <div className="text-sm font-medium truncate">{user.name}</div> {/* Truncate long names */}
                  <div className="text-xs text-gray-400 truncate">{user.career}</div> {/* Truncate long careers */}
                  <hr className="border-slate-700"/>
                  <Button onClick={onLogout} className="text-white bg-red-600 hover:bg-red-700 text-sm justify-center w-full"> {/* Full width button */}
                     <LogOut className="mr-2" size={16} /> Cerrar Sesión
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mobile Menu Button */}
          {showNavAndUserInfo && ( // Only show burger if nav links are relevant
              <button
                ref={mobileMenuButtonRef} // Attach ref to the button
                className="sm:hidden text-white p-2 focus:outline-none"
                onClick={toggleMobileMenu}
                aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
              >
                {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
                ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
                )}
              </button>
          )}

          {/* Login/Register Links (Desktop, when not logged in on auth pages) */}
         {!user && (isLoginPage || isRegisterPage) && (
             <div className="hidden sm:flex items-center space-x-4">
                 {isLoginPage && (
                     <Link to="/register" className="text-green-500 font-semibold hover:underline transition-colors">
                         Registrarse
                     </Link>
                 )}
                 {isRegisterPage && (
                     <Link to="/login" className="text-green-500 font-semibold hover:underline transition-colors">
                         Iniciar Sesión
                     </Link>
                 )}
             </div>
         )}

      </div> {/* End Right Section */}


      {/* Mobile Menu Dropdown (Absolute Positioned relative to Header) */}
      {showNavAndUserInfo && ( // Only render mobile menu if nav links are relevant
        <div
          ref={mobileMenuRef} // Attach ref to the menu div
          className={`sm:hidden absolute top-12 right-0 mt-2 w-48 bg-slate-900 rounded-lg shadow-lg z-20 transform transition-all duration-300 ease-in-out origin-top-right ${isMobileMenuOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible pointer-events-none'}`} // Added 'visible'/'invisible' and removed pointer-events-none when open
        >
          <ul className="flex flex-col space-y-3 p-4 font-semibold">
            <NavLinks isMobile={true} /> {/* Render navigation links */}
             {user && ( // Show user info/logout in mobile menu if logged in
                <>
                 <hr className="my-2 border-slate-700" />
                 {/* User info in mobile menu (not clickable, just info) */}
                 <li className="text-sm font-medium truncate">{user.name}</li>
                 <li className="text-xs text-gray-400 truncate">{user.career}</li>
                 <li>
                    <Button onClick={onLogout} className="text-white bg-red-600 hover:bg-red-700 text-sm w-full justify-center">
                       <LogOut className="mr-2" size={16} /> Cerrar Sesión
                    </Button>
                 </li>
                </>
             )}
          </ul>
        </div>
      )}

    </header>
  );
};

export default Header;