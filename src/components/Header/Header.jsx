import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Header.css';

const Header = React.forwardRef(function HeaderFn(props, ref) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeSection, setActiveSection] = useState(null);
    const location = useLocation();

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
        const path = location.pathname;
        let sectionId = path.replace("/", "");
        sectionId = sectionId.replace(/[^a-z0-9-_]/g, "");
        setActiveSection(sectionId || "keaton-nemes"); // Set default to home
    }, [location.pathname]);

    return (
        <header className="header">
            <div className="header-content">
                <nav className="left-links">
                    <a href="#keaton-nemes" className={activeSection === "keaton-nemes" ? "active" : ""}>Keaton Nemes</a>
                </nav>
                <nav className="right-links regular-links" ref={ref}> 
                    <a href="#about" className={activeSection === "about" ? "active" : ""}>About</a>
                    <a href="#projects" className={activeSection === "projects" ? "active" : ""}>Projects</a>
                    <a href="#contact" className={activeSection === "contact" ? "active" : ""}>Contact</a>
                </nav>
                <button className="dropdown-button" onClick={toggleDropdown}>
                    Menu
                </button>
                {isDropdownOpen && (
                    <div className="dropdown-menu">
                        <a href="#about" className={activeSection === "about" ? "active" : ""}>About</a>
                        <a href="#projects" className={activeSection === "projects" ? "active" : ""}>Projects</a>
                        <a href="#contact" className={activeSection === "contact" ? "active" : ""}>Contact</a>
                    </div>
                )}
            </div>
        </header>
    );
});

export default Header;