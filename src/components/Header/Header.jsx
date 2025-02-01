import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Import Header-specific styles

function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    }

    return (
        <header className="header">
            <div className="header-content"> {/* Container for header content */}
                <nav className="left-links">
                    <Link to="/">Keaton Nemes</Link>
                </nav>
                <nav className="right-links regular-links"> {/* Class for regular links */}
                    <Link to="/about">About</Link>
                    <Link to="/project">Projects</Link>
                    <Link to="/contact">Contact</Link>
                </nav>
                <button className="dropdown-button" onClick={toggleDropdown}>
                    Menu
                </button>
                {isDropdownOpen && (
                    <div className="dropdown-menu"> {/* Dropdown menu */}
                        <Link to="/about">About</Link>
                        <Link to="/project">Projects</Link>
                        <Link to="/contact">Contact</Link>
                    </div>
                )}
                {/* Add other header elements (logo, search bar, etc.) */}
            </div>
        </header>
    );
}

export default Header;