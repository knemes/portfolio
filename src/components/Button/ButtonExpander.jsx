import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import './ButtonExpander.css';
import PencilIcon from '../../assets/SVG/PencilIcon.svg';

function ButtonExpander({ children, isDrawing, setIsDrawing, toggleLabel = '>', collapseLabel = '<' }) {
    const [isPaletteOpen, setIsPaletteOpen] = useState(false);
    const paletteRef = useRef(null);

    const togglePalette = () => {
        setIsPaletteOpen(!isPaletteOpen);
        if (!isPaletteOpen) {
            setIsDrawing(true)
        } else {
            setIsDrawing(false)
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (paletteRef.current && !paletteRef.current.contains(event.target) && !event.target.closest('.button-expander')) {
                setIsPaletteOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="button-expander" >
            <button className="expander-button" onClick={togglePalette}>
                <img src={PencilIcon} alt="Drawing Tool" className="pencil-icon" />
            </button>
            <div ref={paletteRef} className={`palette ${isPaletteOpen ? 'open' : ''}`}>
                {children}
            </div>
        </div>
    );
}

ButtonExpander.propTypes = {
    children: PropTypes.node.isRequired,
    expandDirection: PropTypes.oneOf(['left', 'right', 'up', 'down']),
    isDrawing: PropTypes.bool.isRequired,
    setIsDrawing: PropTypes.func.isRequired,
    toggleLabel: PropTypes.string,
    collapseLabel: PropTypes.string,
};

export default ButtonExpander;