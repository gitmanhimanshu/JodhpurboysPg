import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="relative">
              {/* Professional Logo SVG */}
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Building/Home Shape */}
                <rect x="8" y="16" width="24" height="20" fill="#F97316" rx="2"/>
                <rect x="8" y="16" width="24" height="20" stroke="#EA580C" strokeWidth="1.5" rx="2"/>
                
                {/* Roof */}
                <path d="M4 18L20 6L36 18" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 18L20 6L36 18" fill="#F97316" fillOpacity="0.3"/>
                
                {/* Windows */}
                <rect x="13" y="21" width="5" height="5" fill="white" rx="1"/>
                <rect x="22" y="21" width="5" height="5" fill="white" rx="1"/>
                <rect x="13" y="28" width="5" height="5" fill="white" rx="1"/>
                
                {/* Door */}
                <rect x="22" y="28" width="5" height="8" fill="white" rx="1"/>
                <circle cx="25" cy="32" r="0.5" fill="#F97316"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-xl font-bold text-gray-900">Jodhpur Boys PG & Tiffin Center</span>
              <span className="text-xs text-gray-500 -mt-1 hidden sm:block">Your Home Away From Home</span>
            </div>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-orange-600 transition duration-200 font-medium">
              Home
            </Link>
            <Link to="/services" className="text-gray-700 hover:text-orange-600 transition duration-200 font-medium">
              Services
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-orange-600 transition duration-200 font-medium">
                  Dashboard
                </Link>
                {user.isAdmin && (
                  <Link to="/admin" className="text-gray-700 hover:text-orange-600 transition duration-200 font-medium">
                    Admin Panel
                  </Link>
                )}
                <button 
                  onClick={logout} 
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition duration-200 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition duration-200 font-semibold shadow-sm"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link 
              to="/" 
              onClick={() => setIsOpen(false)}
              className="block text-gray-700 hover:bg-orange-50 px-4 py-2 rounded-lg transition duration-200"
            >
              Home
            </Link>
            <Link 
              to="/services" 
              onClick={() => setIsOpen(false)}
              className="block text-gray-700 hover:bg-orange-50 px-4 py-2 rounded-lg transition duration-200"
            >
              Services
            </Link>
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  onClick={() => setIsOpen(false)}
                  className="block text-gray-700 hover:bg-orange-50 px-4 py-2 rounded-lg transition duration-200"
                >
                  Dashboard
                </Link>
                {user.isAdmin && (
                  <Link 
                    to="/admin" 
                    onClick={() => setIsOpen(false)}
                    className="block text-gray-700 hover:bg-orange-50 px-4 py-2 rounded-lg transition duration-200"
                  >
                    Admin Panel
                  </Link>
                )}
                <button 
                  onClick={() => { logout(); setIsOpen(false); }} 
                  className="w-full text-left bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                onClick={() => setIsOpen(false)}
                className="block bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition duration-200 text-center font-semibold"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
