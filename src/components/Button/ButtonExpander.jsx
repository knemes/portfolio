import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import './ButtonExpander.css';
import PencilIcon from '../../assets/SVG/PencilIcon.svg';
import ColorWheel from '../../assets/SVG/ColorWheel.svg';
import EraserIcon from '../../assets/SVG/EraserIcon.svg';
import SaveIcon from '../../assets/SVG/SaveIcon.svg';
import TrashIcon from '../../assets/SVG/TrashIcon.svg';
import BrushIcon from '../../assets/SVG/BrushIcon.svg';
import MarkerBrush from '../../assets/SVG/MarkerBrush.svg';
import PencilBrush from '../../assets/SVG/PencilBrush.svg';
import HighlighterBrush from '../../assets/SVG/HighlighterBrush.svg';


function ButtonExpander({ children, isDrawing, setIsDrawing}) {
    const [brushOptionsOpen, setBrushOptionsOpen] = useState(false);
    const [selectedBrush, setSelectedBrush] = useState('Pencil');
    const brushOptionsRef = useRef(null);
    const brushButtonRef = useRef(null);

    const toggleDrawing = () => {
        setIsDrawing(!isDrawing);
    };

    const toggleBrushOptions = () => {
        setBrushOptionsOpen(!brushOptionsOpen);
    };

    const handleBrushSelection = (brush) => {
        setSelectedBrush(brush);
        console.log('selected brush:', brush);
    };

    const handleClickOutside = (event) => {
        if (brushButtonRef.current && brushButtonRef.current.contains(event.target)) {
            return; // Ignore click if it's the brush button or its children
        }
        if (brushOptionsRef.current && !brushOptionsRef.current.contains(event.target)) {
            setBrushOptionsOpen(false);
        }
    };

    useEffect(() => {
        if (brushOptionsOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [brushOptionsOpen]);

    return (
        <div className="button-expander" >
            <div className={`island ${isDrawing ? 'open' : ''}`}>
                <button className="island-button" onClick={toggleBrushOptions} ref={brushButtonRef}>
                    <img src={BrushIcon} alt="Brush Icon" />
                </button>
                {brushOptionsOpen && (
                    <div className="brush-options" ref={brushOptionsRef}>
                        <button className={`brush-button
                        ${selectedBrush === 'Pencil' ? 'active' : ''}`}
                            onClick={() => handleBrushSelection('Pencil')}
                        ><img src={PencilBrush} alt="Pencil Button" />
                        </button>
                        <button className={`brush-button
                        ${selectedBrush === 'Marker' ? 'active' : ''}`}
                            onClick={() => handleBrushSelection('Marker')}
                        ><img src={MarkerBrush} alt="Marker Button" />
                        </button>
                        <button className={`brush-button
                        ${selectedBrush === 'Highlight' ? 'active' : ''}`}
                            onClick={() => handleBrushSelection('Highlight')}
                        ><img src={HighlighterBrush} alt="Highlight Button" />
                        </button>
                    </div>
                )}
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