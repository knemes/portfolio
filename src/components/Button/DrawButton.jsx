import React from 'react';
import PropTypes from 'prop-types';
import ButtonExpander from './ButtonExpander';
import './DrawButton.css';


function DrawButton({ isDrawing, toggleDrawingMode, setDrawingColor, clearCanvas }) {
    return (
        <ButtonExpander onToggle={ toggleDrawingMode }>
            {isDrawing && (
                <div className='draw-options flex-row items-center'>
                    <button onClick={() => setDrawingColor('red')} style={{ backgroundColor: 'red' }}></button>
                    <button onClick={() => setDrawingColor('blue')} style={{ backgroundColor: 'blue' }}></button>
                    <button onClick={() => setDrawingColor('green')} style={{ backgroundColor: 'green' }}></button>
                    <button onClick={() => setDrawingColor('black')} style={{ backgroundColor: 'black' }}></button>
                    <button onClick={clearCanvas}>Clear</button>
                </div>
            )}
        </ButtonExpander>
    );
}

DrawButton.propTypes = {
    isDrawing: PropTypes.bool.isRequired,
    toggleDrawingMode: PropTypes.func.isRequired,
    setDrawingColor: PropTypes.func.isRequired,
    clearCanvas: PropTypes.func.isRequired,
};

export default DrawButton;