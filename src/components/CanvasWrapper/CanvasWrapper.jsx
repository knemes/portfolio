import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

function CanvasWrapper({ children }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = document.body.scrollHeight;
        }
    }, []);

    return <canvas ref={canvasRef} className="graph">{children(canvasRef)}</canvas>;
}

CanvasWrapper.propTypes = {
    children: PropTypes.func.isRequired,
};

export default CanvasWrapper;