import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Import Header-specific styles

function Header() {
    return (
        <header className="header">
            <div className="header-content"> {/* Container for header content */}
                <nav className="right-links">
                    <Link to="/about">About</Link>
                    <Link to="/project">Projects</Link>
                    <Link to="/contact">Contact</Link>
                    <Link to="/draw">Draw</Link>
                    {/* Add more navigation links */}
                </nav>
                <nav className="left-links">
                    <Link to="/">Home</Link>
                </nav>
                {/* Add other header elements (logo, search bar, etc.) */}
            </div>
        </header>
    );
}

export default Header;