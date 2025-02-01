import React from 'react';
import { FaGithub, FaLinkedin, FaSpotify } from 'react-icons/fa'; // Import icons from react-icons

const SocialLinks = () => {
    return (
        <div className="social-links">
            <a href="https://linkedin.com/in/keaton-nemes" target="_blank" rel="noopener noreferrer">
                <FaLinkedin className="social-icon" />
            </a>
            <a href="https://github.com/knemes" target="_blank" rel="noopener noreferrer">
                <FaGithub className="social-icon" />
            </a>
            <a href="https://open.spotify.com/user/nemes006shadowfax?si=4b7d7325f9854b9b" target="_blank" rel="noopener noreferrer">
                <FaSpotify className="social-icon" />
            </a>
        </div>
    );
};

export default SocialLinks;