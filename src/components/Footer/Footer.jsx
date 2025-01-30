import React from 'react';
import './Footer.css'; 

function Footer() {
    return (
        <footer className="footer"> {/* Apply the layout-footer class here */}
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} My Awesome App</p>
                
            </div>
        </footer>
    );
}

export default Footer;