import { useLocation } from 'react-router-dom';
import './Footer.css'; 
import SocialLinks from '../SocialLinks';


function Footer() {
    const location = useLocation();

    const getPageNumber = () => {
        switch (location.pathname) {
            case '/':
                return '1';
            case '/about':
                return '2';
            case '/project':
                return '3';
            case '/contact':
                return '4';
            default:
                return '';
        }
    };

    return (
        <footer className="footer"> 
            <div className="social-media-container">
                <SocialLinks />
            </div>
            <div className="footer-content">
                <p className="page-number"><sup>{getPageNumber()}</sup>/<sub>4</sub></p>
            </div>
        </footer>
    );
}

export default Footer;