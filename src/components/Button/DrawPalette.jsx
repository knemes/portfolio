import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import './DrawPalette.css';
import PencilIcon from '../../assets/SVG/PencilIcon.svg';
import ColorWheel from '../../assets/SVG/ColorWheel.svg';
import EraserIcon from '../../assets/SVG/EraserIcon.svg';
import SaveIcon from '../../assets/SVG/SaveIcon.svg';
import TrashIcon from '../../assets/SVG/TrashIcon.svg';
import BrushIcon from '../../assets/SVG/BrushIcon.svg';
import MarkerBrush from '../../assets/SVG/MarkerBrush.svg';
import PencilBrush from '../../assets/SVG/PencilBrush.svg';
import HighlighterBrush from '../../assets/SVG/HighlighterBrush.svg';


function DrawPalette({ isDrawing, setIsDrawing, onBrushSelection, onColorChange, onToggleEraser, onSave, onTrash}) {
    const [brushOptionsOpen, setBrushOptionsOpen] = useState(false);
    const [selectedBrush, setSelectedBrush] = useState('Pencil');
    const brushOptionsRef = useRef(null);
    const brushButtonRef = useRef(null);

    // Color Picker State
    const [colorPickerOpen, setColorPickerOpen] = useState(false);
    const [hue, setHue] = useState(50);
    const colorPickerRef = useRef(null);
    const colorButtonRef = useRef(null);
    const sliderRef = useRef(null);
    const sliderMax = 362;
    const sliderMin = 0;

    // Selected Tool State
    const [activeTool, setActiveTool] = useState('brush');

    const toggleDrawing = () => {
        setIsDrawing(!isDrawing);
    };

    const toggleBrushOptions = () => {
        setBrushOptionsOpen(!brushOptionsOpen);
        setActiveTool('brush');
    };

    const handleBrushSelection = (brush) => {
        setSelectedBrush(brush);
        onBrushSelection(brush);
    };

    const handleClickOutside = (event) => {
        if (brushButtonRef.current && brushButtonRef.current.contains(event.target)) {
            setColorPickerOpen(false);
        }
        if (brushOptionsRef.current && !brushOptionsRef.current.contains(event.target)) {
            setBrushOptionsOpen(false);
        }

        if (colorButtonRef.current && colorButtonRef.current.contains(event.target)) {
            setBrushOptionsOpen(false);
        }
        if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
            setColorPickerOpen(false);
        }
    };

    const toggleColorPicker = () => {
        setColorPickerOpen(!colorPickerOpen);
    };

    const handleHueChange = (event) => {
        const newHue = parseInt(event.target.value);
        setHue(newHue);
        updateSliderThumbColor(newHue);
        onColorChange(newHue)
    };

    const updateSliderThumbColor = (hue) => {
        const slider = sliderRef.current;

        if (!slider) {
            return;
        }

        const sliderRect = slider.getBoundingClientRect();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const sliderWidth = sliderRect.width;
        canvas.width = sliderWidth;
        canvas.height = 1;

        const gradient = ctx.createLinearGradient(0, 0, sliderWidth, 0);
        gradient.addColorStop(0, 'hsl(0, 0%, 100%)');      // white
        gradient.addColorStop(0.125, 'hsl(0, 0%, 0%)');     // black
        gradient.addColorStop(0.25, 'hsl(0, 100%, 50%)');   // red
        gradient.addColorStop(0.375, 'hsl(60, 100%, 50%)');  // yellow
        gradient.addColorStop(0.5, 'hsl(120, 100%, 50%)');  // green
        gradient.addColorStop(0.625, 'hsl(180, 100%, 50%)'); // teal
        gradient.addColorStop(0.75, 'hsl(240, 100%, 50%)');  // blue
        gradient.addColorStop(0.875, 'hsl(300, 100%, 50%)'); // purple
        gradient.addColorStop(1, 'hsl(300, 100%, 50%)'); 

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, sliderWidth, 1);

        const percentage = (hue - sliderMin) / (sliderMax - sliderMin); // percentage relative to slider's range
        let pixelX = Math.round(percentage * sliderWidth);

        const adjustmentFactor = .875; // Adjust this value as needed
        pixelX = Math.round(pixelX * adjustmentFactor);


        const pixelData = ctx.getImageData(pixelX, 0, 1, 1).data;
        const rgbToHsl = (r, g, b) => {
            r /= 255, g /= 255, b /= 255;
            const max = Math.max(r, g, b), min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;
            if (max === min) {
                h = s = 0;
            } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }
            return `hsl(${h * 360}, ${s * 100}%, ${l * 100}%)`;
        };
        const thumbColor = rgbToHsl(pixelData[0], pixelData[1], pixelData[2]);

        document.documentElement.style.setProperty('--thumb-color', thumbColor);
        document.documentElement.style.setProperty('--thumb-border-color', 'black');
    };

    const handleEraserToggle = () => {
        onToggleEraser();
        setActiveTool('eraser')
    };

    const handleSaveToggle = () => {
        onSave();
    };

    const handleTrashToggle = () => {
        onTrash();
    };

    useEffect(() => {
        updateSliderThumbColor(hue); // Set initial thumb color
    },);

    useEffect(() => {
        if (brushOptionsOpen || colorPickerOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [brushOptionsOpen, colorPickerOpen]);

    return (
        <div className="button-expander" >
            <div className={`island ${isDrawing ? 'open' : ''}`}>
                <button className={`island-button ${activeTool === 'brush' ? 'active-tool' : ''}`} onClick={toggleBrushOptions} ref={brushButtonRef}>
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
                <button className="island-button" onClick={toggleColorPicker} ref={colorButtonRef}><img src={ColorWheel} alt="Color Button" /></button>
                {colorPickerOpen && (
                    <div className="color-picker" ref={colorPickerRef}>
                    <input 
                            type="range"
                            min={sliderMin}
                            max={sliderMax}
                            value={hue}
                            onChange={handleHueChange}
                            className="color-slider"
                            ref={sliderRef}
                        />
                    </div>
                )}
                <button className={`island-button ${activeTool === 'eraser' ? 'active-tool' : ''}`} onClick={handleEraserToggle}><img src={EraserIcon} alt="Eraser Button" /></button>
                <button className="island-button" onClick={handleSaveToggle}><img src={SaveIcon} alt="Save Button" /></button>
                <button className="island-button" onClick={handleTrashToggle}><img src={TrashIcon} alt="Trash Button" /></button>
            </div>
            <button className="expander-button" onClick={toggleDrawing}>
                <img src={PencilIcon} alt="Drawing Tool" className="pencil-icon" />
            </button>
        </div>
    );
}

DrawPalette.propTypes = {
    children: PropTypes.node.isRequired,
    isDrawing: PropTypes.bool.isRequired,
    setIsDrawing: PropTypes.func.isRequired,
    onBrushSelection: PropTypes.func.isRequired,
    onColorChange: PropTypes.func.isRequired,
    onToggleEraser: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onTrash: PropTypes.func.isRequired,
};

export default DrawPalette;