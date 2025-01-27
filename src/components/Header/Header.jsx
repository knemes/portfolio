import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Import Header-specific styles

function Header() {
    return (
        <header className="header">
            <div className="header-content"> {/* Container for header content */}
                <nav>
                    <Link to="/">Home</Link>
                    <Link to="/about">About</Link>
                    {/* Add more navigation links */}
                </nav>
                {/* Add other header elements (logo, search bar, etc.) */}
                <h1>My Awesome App</h1> {/* Example heading */}
            </div>
        </header>
    );
}

export default Header;