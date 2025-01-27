import React from 'react';
import './Footer.css'; // Import Footer-specific styles

function Footer() {
    return (
        <footer className="footer"> {/* Apply the layout-footer class here */}
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} My Awesome App</p>
                {/* Add other footer content (links, etc.) */}
            </div>
        </footer>
    );
}

export default Footer;