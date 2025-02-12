import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Header.css';

function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const [activeSection, setActiveSection] = useState(null);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    }

    useEffect(() => {
        const path = location.pathname;
        let sectionId = path.replace("/", "");
        sectionId = sectionId.replace(/[^a-z0-9-_]/g, "");
        setActiveSection(sectionId || "keaton-nemes"); // Set default to home
    }, [location.pathname]);

    return (
        <header className="header">
            <div className="header-content"> {/* Container for header content */}
                <nav className="left-links">
                    <Link to="/" className={activeSection === "keaton-nemes" ? "active" : ""}>Keaton Nemes</Link>
                </nav>
                <nav className="right-links regular-links"> {/* Class for regular links */}
                    <Link to="/about" className={activeSection === "about" ? "active" : ""}>About</Link>
                    <Link to="/projects" className={activeSection === "projects" ? "active" : ""}>Projects</Link>
                    <Link to="/contact" className={activeSection === "contact" ? "active" : ""}>Contact</Link>
                </nav>
                <button className="dropdown-button" onClick={toggleDropdown}>
                    Menu
                </button>
                {isDropdownOpen && (
                    <div className="dropdown-menu"> 
                        <Link to="/about" className={activeSection === "about" ? "active" : ""}>About</Link>
                        <Link to="/projects" className={activeSection === "projects" ? "active" : ""}>Projects</Link>
                        <Link to="/contact" className={activeSection === "contact" ? "active" : ""}>Contact</Link>
                    </div>
                )}
                {/* Add other header elements (logo, search bar, etc.) */}
            </div>
        </header>
    );
}

export default Header;