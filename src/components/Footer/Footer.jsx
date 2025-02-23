import { useLocation } from 'react-router-dom';
import './Footer.css'; 
import SocialLinks from '../SocialLinks';
import PropTypes from 'prop-types';


function Footer({ currentPage, totalPages }) {
    return (
        <footer className="footer"> 
            <div className="social-media-container">
                <SocialLinks />
            </div>
            <div className="footer-content">
                <p className="page-number"><sup>{currentPage}</sup>/<sub>{totalPages}</sub></p>
            </div>
        </footer>
    );
}

Footer.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
};

export default Footer;