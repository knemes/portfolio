import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import './ButtonExpander.css';
import PencilIcon from '../../assets/SVG/PencilIcon.svg';
import ColorWheel from '../../assets/SVG/ColorWheel.svg';
import EraserIcon from '../../assets/SVG/EraserIcon.svg';
import SaveIcon from '../../assets/SVG/SaveIcon.svg';
import TrashIcon from '../../assets/SVG/TrashIcon.svg';
import BrushIcon from '../../assets/SVG/BrushIcon.svg';


function ButtonExpander({ children, isDrawing, setIsDrawing, toggleLabel = '>', collapseLabel = '<' }) {
    const paletteRef = useRef(null);

    const toggleDrawing = () => {
        setIsDrawing(!isDrawing);
    };

    return (
        <div className="button-expander" >
            <div className={`island ${isDrawing ? 'open' : ''}`}>
                <button className="island-button"><img src={BrushIcon} alt="Brush Icon" /></button>
                <button className="island-button"><img src={ColorWheel} alt="Color Button" /></button>
                <button className="island-button"><img src={EraserIcon} alt="Eraser Button" /></button>
                <button className="island-button"><img src={SaveIcon} alt="Save Button" /></button>
                <button className="island-button"><img src={TrashIcon} alt="Trash Button" /></button>
            </div>
            <button className="expander-button" onClick={toggleDrawing}>
                <img src={PencilIcon} alt="Drawing Tool" className="pencil-icon" />
            </button>
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