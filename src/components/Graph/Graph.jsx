import React, { useRef, useLayoutEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import './Graph.css';

function Graph({ canvas, mousePos, isDrawing, lines, backgroundLines }) {
    //const canvasRef = useRef(null);

    const warp = useCallback((x, y) => {
        //const canvas = canvasRef.current;
        if (!mousePos) return { x: 0, y: 0 }; // No warp if no mouse position
        const rect = canvas.getBoundingClientRect(); // Get canvas position
        const canvasMouseX = mousePos.x - rect.left; // Difference in x between grid point and mouse
        const canvasMouseY = mousePos.y - rect.top; // Difference in y between grid point and mouse

        const dx = x - canvasMouseX;
        const dy = y - canvasMouseY;
        const dist = Math.sqrt(dx * dx + dy * dy); // Distance between grid point and mouse

        if (dist < 100) { // If mouse is within 100 pixels
            let warpAmount = (100 - dist) / 100 * 5; // Calculate warp amount (stronger closer to mouse)
            return { x: warpAmount * (dx / dist), y: warpAmount * (dy / dist) }; // Return offset
        }
        return { x: 0, y: 0 }; // No warp if mouse is too far away
    }, [canvas, mousePos]);

    const drawGrid = useCallback(() => {

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = isDrawing ? '#DDDDDD' : '#EEEEEE';
        ctx.lineWidth = 1;

        const margin = 75; // Margin around the grid
        const gridWidth = width - 2 * margin;
        const gridHeight = height - 2 * margin;
        let gridSize = 20;

        // Vertical lines
        for (let xIndex = 0; xIndex <= Math.floor(gridWidth / gridSize); xIndex++) {
            const x = margin + xIndex * gridSize;
            const firstthirdx = Math.floor(gridWidth / gridSize / 3);
            const secondthirdx = Math.floor(gridWidth / gridSize / 3 * 2);
            const lastx = Math.floor(gridWidth / gridSize)
            let { x: startWarpX, y: startWarpY } = warp(x, margin);
            let startX, startY;
            if (!isDrawing) {
                startX = x + startWarpX;
                if (xIndex == 0 || xIndex == firstthirdx || xIndex == secondthirdx || xIndex == lastx) {
                    startY = startWarpY - 10;
                } else {
                    startY = margin + startWarpY;
                }
            } else {
                startX = x;
                if (xIndex == 0 || xIndex == firstthirdx || xIndex == secondthirdx || xIndex == lastx) {
                    startY = -10;
                } else {
                    startY = margin;
                }
            }

            ctx.beginPath();
            ctx.moveTo(startX, startY);

            for (let yIndex = 0; yIndex <= Math.floor(gridHeight / gridSize); yIndex++) {
                const y = margin + yIndex * gridSize;
                const lasty = Math.floor(gridHeight / gridSize)
                const { x: warpX, y: warpY } = warp(x, y);
                let endX = x;
                let endY; 
                if (!isDrawing) {
                    endX = x + warpX;
                    if ((xIndex == 0 || xIndex == lastx) && yIndex == lasty) {
                        endY = y + warpY + margin + 10;
                    } else {
                        endY = y + warpY;
                    }
                } else {
                    if ((xIndex == 0 || xIndex == lastx) && yIndex == lasty) {
                        endY = y + margin + 10;
                    } else {
                        endY = y;
                    }  
                }
                ctx.lineTo(endX, endY);
            }
            ctx.stroke();
        }

        // Horizontal lines (similar adjustments)
        for (let yIndex = 0; yIndex <= Math.floor(gridHeight / gridSize); yIndex++) {
            const y = margin + yIndex * gridSize;
            const lasty = Math.floor(gridHeight / gridSize)
            let { x: startWarpX, y: startWarpY } = warp(margin, y); 
            let startX, startY;
            if (!isDrawing) {
                if (yIndex == 0 || yIndex == lasty) {
                    startX = startWarpX - 10;
                } else {
                    startX = margin + startWarpX;
                }
                startY = y + startWarpY;
            } else {
                if (yIndex == 0 || yIndex == lasty) {
                    startX = -10;
                } else {
                    startX = margin;
                }
                startY = y;
            }

            ctx.beginPath();
            ctx.moveTo(startX, startY);

            for (let xIndex = 0; xIndex <= Math.floor(gridWidth / gridSize); xIndex++) { 
                const x = margin + xIndex * gridSize;
                const lastx = Math.floor(gridWidth / gridSize)
                const { x: warpX, y: warpY } = warp(x, y);
                let endX;
                let endY = y;
                if (!isDrawing) {
                    if ((yIndex == 0 || yIndex == lasty) && xIndex == lastx) {
                        endX = x + warpX + margin + 10;
                    } else {
                        endX = x + warpX;
                    }
                    endY = y + warpY;
                } else {
                    if ((yIndex == 0 || yIndex == lasty) && xIndex == lastx) {
                        endX = x + margin + 10;
                    } else {
                        endX = x;
                    }
                }
                ctx.lineTo(endX, endY);
            }
            ctx.stroke();
        }
    }, [canvas, isDrawing, warp]);

    const drawLines = useCallback(() => {
        //const canvas = canvasRef.current;
        if (!canvas || !canvas.getContext) return;
        const ctx = canvas.getContext('2d');
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        drawGrid();
        //ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear before redrawing lines

        const drawWarpedLine = (line, color) => { // Helper function
            ctx.beginPath();
            ctx.strokeStyle = color;
            let warpedStart = warp(line[0].x, line[0].y);
            ctx.moveTo(line[0].x + warpedStart.x, line[0].y + warpedStart.y);
            for (let i = 1; i < line.length; i++) {
                let warpedEnd = warp(line[i].x, line[i].y);
                ctx.lineTo(line[i].x + warpedEnd.x, line[i].y + warpedEnd.y);
            }
            ctx.stroke();
        };

        const drawLine = (line, color) => {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.moveTo(line[0].x, line[0].y);
            for (let i = 1; i < line.length; i++) {
                ctx.lineTo(line[i].x, line[i].y);
            }
            ctx.stroke();
        }

        if (!isDrawing) { // Only warp when NOT drawing
            backgroundLines.forEach(line => {
                drawWarpedLine(line, 'rgba(0,0,0,0.1)');
            });
        } else {
            backgroundLines.forEach(line => {
                drawLine(line, line[0].color || 'rgba(0,0,0,0.1)');
            })
        }

        // Draw current line 
        if (isDrawing && lines.length > 0) {
            lines.forEach(line => {
                drawLine(line, line[0].color); // Use helper function
            });
        }

    }, [canvas, lines, backgroundLines, drawGrid, isDrawing, warp]);

    useLayoutEffect(() => { // Use useLayoutEffect here!
        //const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const handleResize = () => {
                    canvas.width = canvas.offsetWidth;
                    canvas.height = canvas.offsetHeight;
                    drawGrid();
                    drawLines();
                };

                handleResize();
                window.addEventListener('resize', handleResize);

                return () => {
                    window.removeEventListener('resize', handleResize);
                };
            }
        }
    }, [canvas, drawGrid, drawLines]);

    useLayoutEffect(() => {
        drawGrid();
    }, [drawGrid]);

    useLayoutEffect(() => {
        drawLines();
    }, [drawLines, lines, backgroundLines]);

    if (!canvas) {
        return null; // Don't render anything if the canvas ref is not yet set
    }

    return null;
}

Graph.propTypes = {
    canvas: PropTypes.instanceOf(HTMLCanvasElement),
    mousePos: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
    }),
    isDrawing: PropTypes.bool.isRequired,
    lines: PropTypes.arrayOf(PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        color: PropTypes.string
    })).isRequired,
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

export default Graph;
