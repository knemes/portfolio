import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import Graph from './Graph/Graph';
import './Layout.css';
import Header from './Header/Header';
import Footer from './Footer/Footer';

function Layout({ isDrawing, setIsDrawing, pencilColor, setPencilColor, lines, setLines, backgroundLines, setBackgroundLines, clearCanvas }) {
    const [canvasWidth, setCanvasWidth] = useState(window.innerWidth - 200);
    const [canvasHeight, setCanvasHeight] = useState(window.innerHeight - 200);
    const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
    const isMouseDown = useRef(false);
    const canvasRef = useRef(null);

    const [hasMounted, setHasMounted] = useState(false);

    const getCanvasCoords = useCallback((e) => {
        if (!canvasRef.current) return null;
        const rect = canvasRef.current.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }, []);

    const handleMouseDown = useCallback((e) => {
        if (isDrawing) {
            isMouseDown.current = true;
            const coords = getCanvasCoords(e);
            if (coords) {
                setLines([[{ ...coords, color: pencilColor, originalColor: pencilColor }]]);
            }
        }
    }, [isDrawing, pencilColor, getCanvasCoords]);

    const handleMouseUp = useCallback(() => {
        if (isDrawing) {
            isMouseDown.current = false;
            if (lines.length > 0 && lines[0].length > 0) {
                setBackgroundLines(prevBackgroundLines => [...prevBackgroundLines, lines[0]]);
            }
            setLines([]);
        }
    }, [isDrawing, lines]);

    const handleMouseMove = useCallback((e) => {
        setMousePos({ x: e.clientX, y: e.clientY });
        if (isDrawing && isMouseDown.current) {
            const coords = getCanvasCoords(e);
            if (coords) {
                setLines(prevLines => {
                    if (prevLines.length === 0) {
                        return [[{ ...coords, color: pencilColor, originalColor: pencilColor }]];
                    }
                    const lastLine = prevLines[prevLines.length - 1];
                    return [...prevLines.slice(0, -1), [...lastLine, { ...coords, color: pencilColor, originalColor: pencilColor }]];
                });
            }
        }
    }, [isDrawing, isMouseDown, pencilColor, getCanvasCoords]);

    const toggleDrawingMode = () => {
        setIsDrawing(!isDrawing);
        if (isDrawing) {
            setBackgroundLines(prevBackgroundLines =>
                prevBackgroundLines.map(line =>
                    line.map(point => ({ ...point, color: 'rgba(0,0,0,0.1)' }))
                )
            );
            setLines([]);
        } else {
            setBackgroundLines(prevBackgroundLines =>
                prevBackgroundLines.map(line => {
                    const originalColor = line[0].originalColor || 'black';
                    return line.map(point => ({ ...point, color: originalColor }));
                })
            );
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setCanvasWidth(window.innerWidth);
            setCanvasHeight(window.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Crucial: Call handleResize here for initial render

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousedown', handleMouseDown)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousedown', handleMouseDown)
        };
    }, [handleMouseMove, handleMouseUp, handleMouseDown]);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    return (
        <div className='layout-container'> {/* Flexbox for layout */}
            <Header />
            <div className="canvas-container layout-main" >
                <canvas
                    ref={canvasRef}
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'block', // Remove any default inline spacing'
                    }}
                />
                {hasMounted && <Graph
                    canvas={canvasRef.current}
                    mousePos={mousePos}
                    isDrawing={isDrawing}
                    lines={lines}
                    backgroundLines={backgroundLines} />}
            </div>
            <Outlet context={{ isDrawing, toggleDrawingMode, setPencilColor, clearCanvas, pencilColor }} />            
            <Footer />
        </div>
    );
}

Layout.propTypes = {
    isDrawing: PropTypes.bool.isRequired,
    setIsDrawing: PropTypes.func.isRequired,
    pencilColor: PropTypes.string.isRequired,
    setPencilColor: PropTypes.func.isRequired,
    clearCanvas: PropTypes.func.isRequired,
    lines: PropTypes.arrayOf(PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        color: PropTypes.string
    })).isRequired,
    setLines: PropTypes.func.isRequired,
    setBackgroundLines: PropTypes.func.isRequired,
    backgroundLines: PropTypes.arrayOf(
        PropTypes.arrayOf( // Array of lines
            PropTypes.shape({ // Each line is an array of points
                x: PropTypes.number.isRequired,
                y: PropTypes.number.isRequired,
                color: PropTypes.string,
            })
        )
    ).isRequired,
};

export default Layout;