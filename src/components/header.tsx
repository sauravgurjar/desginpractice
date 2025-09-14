// Header.tsx
import React from 'react';
import  action  from  '../assets/account.svg'

const Header: React.FC = () => {
    return (
        <header className=" ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    {/* Logo */}
                    <div className="text-2xl font-bold text-gray-800">
                        MyApp
                    </div>

                    {/* Navigation */}
                    <nav className="space-x-6">
                        <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
                        <a href="/about" className="text-gray-600 hover:text-gray-900">About</a>
                        <a href="/contact" className="text-gray-600 hover:text-gray-900">Contact</a>
                    </nav>

                    {/* Actions */}
                    <button
                        className="
    flex items-center justify-center
    w-10 h-10
    rounded-xl
    bg-white
    shadow-md
    hover:bg-gray-100
    active:scale-95
    transition
  "
                    >
                        <img src={action} alt="Bell" className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
