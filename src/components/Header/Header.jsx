import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Header.css';

const Header = React.forwardRef(function HeaderFn(props, ref) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeSection, setActiveSection] = useState(null);
    const mainContainerRef = React.useRef(null);

    useEffect(() => {
        if (props.mainContainerRef) {
            mainContainerRef.current = props.mainContainerRef.current;
        }
    }, [props.mainContainerRef]);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const scrollToSection = (sectionId) => {
        if (mainContainerRef.current) {
            const targetSection = mainContainerRef.current.querySelector(`#${sectionId}`);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                window.history.pushState(null, '', `#${sectionId}`);
                window.dispatchEvent(new HashChangeEvent('hashchange')); 
            }
        }
        setIsDropdownOpen(false);
    };

    return (
        <header className="header">
            <div className="header-content">
                <nav className="regular-links" ref={ref}> 
                    <a href="#keaton-nemes" className={`left-links ${activeSection === "keaton-nemes" ? "active" : ""}`} onClick={(e) => { e.preventDefault(); scrollToSection("keaton-nemes") }}>Keaton Nemes</a>
                    <a href="#projects" className={`right-links ${activeSection === "projects" ? "active" : ""}`} onClick={(e) => { e.preventDefault(); scrollToSection("projects") }}>Projects</a>
                    <a href="#about" className={`right-links ${activeSection === "about" ? "active" : ""}`} onClick={(e) => { e.preventDefault(); scrollToSection("about") }}>About</a>              
                    <a href="#contact" className={`right-links ${activeSection === "contact" ? "active" : ""}`} onClick={(e) => { e.preventDefault(); scrollToSection("contact") }}>Contact</a>
                </nav>
                <button className="dropdown-button" onClick={toggleDropdown}>
                    Menu
                </button>
                {isDropdownOpen && (
                    <div className="dropdown-menu">
                        <a href="#projects" className={activeSection === "projects" ? "active" : ""} onClick={() => scrollToSection("projects")}>Projects</a>
                        <a href="#about" className={activeSection === "about" ? "active" : ""} onClick={() => scrollToSection("about")}>About</a>                       
                        <a href="#contact" className={activeSection === "contact" ? "active" : ""} onClick={() => scrollToSection("contact")}>Contact</a>
                    </div>
                )}
            </div>
        </header>
    );
});

Header.propTypes = {
    mainContainerRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }), // Add mainContainerRef propType
};

export default Header;