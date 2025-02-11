import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Header.css';

function Header({ handleNavigation }) {
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    }

    return (
        <header className="header">
            <div className="header-content"> {/* Container for header content */}
                <nav className="left-links">
                    <Link to="/" onClick={() => handleNavigation("") }>Keaton Nemes</Link>
                </nav>
                <nav className="right-links regular-links"> {/* Class for regular links */}
                    <Link to="/about" onClick={() => handleNavigation("about") }>About</Link>
                    <Link to="/projects" onClick={() => handleNavigation("projects")}>Projects</Link>
                    <Link to="/contact" onClick={() => handleNavigation("contact")}>Contact</Link>
                </nav>
                <button className="dropdown-button" onClick={toggleDropdown}>
                    Menu
                </button>
                {isDropdownOpen && (
                    <div className="dropdown-menu"> 
                        <Link to="/about" onClick={() => handleNavigation("about") }>About</Link>
                        <Link to="/projects" onClick={() => handleNavigation("projects")}>Projects</Link>
                        <Link to="/contact" onClick={() => handleNavigation("contact") }>Contact</Link>
                    </div>
                )}
                {/* Add other header elements (logo, search bar, etc.) */}
            </div>
        </header>
    );
}

Header.propTypes = {  
    handleNavigation: PropTypes.func.isRequired, 
};

export default Header;