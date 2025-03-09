import React, { useState, useRef, useLayoutEffect, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import html2canvas from 'html2canvas';
import './Graph.css';

function Graph({ canvas, isDrawing, backgroundLines, setBackgroundLines, selectedBrush, currentDrawColor, eraserEnabled, saveTrigger, setSaveTrigger, trashTrigger, setTrashTrigger }) {
    //const canvasRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
    const [hasMounted, setHasMounted] = useState(false);
    const isMouseDown = useRef(false);
    const [lines, setLines] = useState([]);

    const brushProperties = {
        Pencil: {
            lineWidth: 2,
            lineCap: 'round',
            opacity: 1,
        },
        Marker: {
            lineWidth: 5,
            lineCap: 'round',
            opacity: 0.5,
        },
        Highlighter: {
            lineWidth: 60,
            lineCap: 'butt',
            opacity: 0.3,
        },
    };

    const defaultBrush = brushProperties.Pencil;

    const getCanvasCoords = useCallback((e) => {
        if (!canvas) return null;
        const rect = canvas.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }, [canvas]);

    const eraseIntersectingLines = useCallback((eraseCoords) => {
        setBackgroundLines(prevLines => {
            let newLines = [];
            prevLines.forEach(lineObj => {
                let currentLine = [];
                let isErasing = false;
                let lastValidPoint = null;

                lineObj.points.forEach((point, index) => { 
                    const dx = point.x - eraseCoords.x;
                    const dy = point.y - eraseCoords.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);


                    if (dist > 25) {
                        if (isErasing && currentLine.length > 0 && lastValidPoint) {
                            newLines.push({
                                points: [...currentLine],
                                brush: lineObj.brush, 
                                brushType: lineObj.brushType,
                            });
                            currentLine = [];
                            isErasing = false;
                        }
                        currentLine.push(point);
                        lastValidPoint = point;
                    } else {
                        isErasing = true;
                    }
                });

                if (currentLine.length > 0) {
                    newLines.push({
                        points: [...currentLine],
                        brush: lineObj.brush, 
                        brushType: lineObj.brushType,
                    });
                }
            });
            return newLines;
        });
    }, [setBackgroundLines]);

    const handleMouseDown = useCallback((e) => {
        if (isDrawing) {
            isMouseDown.current = true;
            const coords = getCanvasCoords(e);
            if (coords) {
                if (eraserEnabled) {
                    eraseIntersectingLines(coords);
                } else {
                    const brush = brushProperties[selectedBrush] || defaultBrush;
                    setLines([{
                        points: [{ ...coords, color: `hsl(${currentDrawColor}, 100%, 50%)` }],
                        brush: { ...brush },
                        brushType: selectedBrush
                    }]);
                }
            }
        }
    }, [isDrawing, currentDrawColor, getCanvasCoords, setLines, eraserEnabled, eraseIntersectingLines, selectedBrush, defaultBrush]);

    const handleMouseUp = useCallback(() => {
        if (isDrawing) {
            isMouseDown.current = false;
            if (!eraserEnabled) {
                if (lines.length > 0) {
                    setBackgroundLines(prevBackgroundLines => {
                        if (Array.isArray(prevBackgroundLines)) {
                            const newBackgroundLines = [...prevBackgroundLines];
                            lines.forEach(line => {
                                newBackgroundLines.push({
                                    points: line.points,
                                    brush: line.brush,
                                    brushType: selectedBrush,
                                });
                            });
                            return newBackgroundLines;
                        } else {
                            return []
                        }
                    });
                }
                setLines([]);
            }
        }
    }, [isDrawing, lines, setLines, setBackgroundLines, eraserEnabled, selectedBrush]);

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

    const drawLine = useCallback((points, color, brush) => {
        if (!canvas || !canvas.getContext) return;
        const ctx = canvas.getContext('2d');
        if (!brush) {
            return;
        }

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = brush.lineWidth;
        ctx.lineCap = brush.lineCap;

        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.globalAlpha = brush.opacity;
        ctx.stroke();
        ctx.globalAlpha = 1;
    }, [canvas]);

    const drawHighlighter = useCallback((points, color, brush) => {
        if (!canvas || !canvas.getContext) return;
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = color;
        ctx.lineCap = 'butt';

        if (points.length < 2) return;

        // Apply scaling transformation to the entire context
        const scaleFactor = 6;
        ctx.save();
        ctx.scale(scaleFactor, scaleFactor);

        ctx.beginPath();
        ctx.moveTo(points[0].x / scaleFactor, points[0].y / scaleFactor);

        for (let i = 1; i < points.length; i++) {
            const p2 = points[i];

            ctx.lineWidth = points[i].lineWidth;

            ctx.lineTo(p2.x / scaleFactor, p2.y / scaleFactor); 
        }
        ctx.globalAlpha = 0.3; 
        ctx.stroke(); 
        ctx.restore(); 
        ctx.globalAlpha = 1;
    }, [canvas]);

    const drawLines = useCallback(() => {
        if (!canvas || !canvas.getContext) return;
        const ctx = canvas.getContext('2d');
        drawGrid();

        const drawWarpedLine = (line, color, brush) => {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = brush.lineWidth;
            ctx.lineCap = brush.lineCap;
            ctx.globalAlpha = brush.opacity;
            let warpedStart = warp(line.points[0].x, line.points[0].y);
            ctx.moveTo(line.points[0].x + warpedStart.x, line.points[0].y + warpedStart.y);
            for (let i = 1; i < line.points.length; i++) {
                let warpedEnd = warp(line.points[i].x, line.points[i].y);
                ctx.lineTo(line.points[i].x + warpedEnd.x, line.points[i].y + warpedEnd.y);
            }
            ctx.stroke();
            ctx.globalAlpha = 1;
        }

        if (backgroundLines && backgroundLines.length > 0) {
            if (!isDrawing) {
                backgroundLines.forEach(line => {
                    if (line.brushType === 'Highlight') { // Check brushType
                        drawHighlighter(line.points, 'rgba(0,0,0,0.1)', line.brush || brushProperties.Highlighter); // Use drawHighlighter
                    } else {
                        drawWarpedLine(line, 'rgba(0,0,0,0.1)', line.brush || brushProperties.Pencil);
                    }
                });
            } else {
                backgroundLines.forEach(line => {
                    if (line && line.points.length > 0 && line.points[0]) {
                        const brush = line.brush || brushProperties[selectedBrush] || defaultBrush;
                        if (line.brushType === 'Highlight') {
                            drawHighlighter(line.points, line.points[0].color || `hsl(${currentDrawColor}, 100%, 50%)`, brush);
                        } else {
                            drawLine(line.points, line.points[0].color || `hsl(${currentDrawColor}, 100%, 50%)`, brush);
                        }
                    }
                });
            }
        }

        if (isDrawing && lines.length > 0 && !eraserEnabled) {
            lines.forEach(line => {
                const brush = line.brush;
                if (selectedBrush === 'Highlight') {
                    drawHighlighter(line.points, `hsl(${currentDrawColor}, 100%, 50%)`, brush);
                } else {
                    drawLine(line.points, `hsl(${currentDrawColor}, 100%, 50%)`, brush);
                }
            });
        }
    }, [canvas, lines, backgroundLines, drawGrid, isDrawing, warp, currentDrawColor, eraserEnabled, selectedBrush]);

    const handleMouseMove = useCallback((e) => {
        setMousePos({ x: e.clientX, y: e.clientY });
        if (isDrawing && isMouseDown.current) {
            const coords = getCanvasCoords(e);
            if (coords) {
                if (eraserEnabled) {
                    eraseIntersectingLines(coords);
                } else {
                    const brush = brushProperties[selectedBrush] || defaultBrush;
                    setLines(prevLines => {
                        if (prevLines.length === 0) {
                            return [{
                                points: [{ ...coords, color: `hsl(${currentDrawColor}, 100%, 50%)`, lineWidth: brush.lineWidth }],
                                brush: { ...brush },
                            }];
                        }
                        const lastLine = prevLines[prevLines.length - 1];
                        return [...prevLines.slice(0, -1), {
                            points: [...lastLine.points, { ...coords, color: `hsl(${currentDrawColor}, 100%, 50%)`, lineWidth: brush.lineWidth }],
                            brush: { ...lastLine.brush },
                        }];
                    });
                }
            }
        }
    }, [isDrawing, isMouseDown, currentDrawColor, getCanvasCoords, eraserEnabled, eraseIntersectingLines, selectedBrush, defaultBrush]);

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

    useEffect(() => {
        if (trashTrigger) {
            setBackgroundLines();
            setTrashTrigger(false);
        }
    }, [trashTrigger, setBackgroundLines, setTrashTrigger]);

    useEffect(() => {
        if (saveTrigger) {
            // Capture the entire client window using html2canvas
            html2canvas(document.body).then(capturedCanvas => { // Capture the <body> element
                const imageData = capturedCanvas.toDataURL('image/png');

                // Create a temporary link to download the image
                const link = document.createElement('a');
                link.href = imageData;
                link.download = 'drawing.png';
                link.click();

                setSaveTrigger(false);
            });
        }
    }, [saveTrigger, setSaveTrigger]);

    //mouseUp, mouseDown
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

    //setHasMounted
    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!canvas || !hasMounted) {
        return null;
    }

    return null;
}


Graph.propTypes = {
    canvas: PropTypes.instanceOf(HTMLCanvasElement),
    isDrawing: PropTypes.bool.isRequired,
    backgroundLines: PropTypes.arrayOf(
        PropTypes.arrayOf( // Array of lines
            PropTypes.shape({ // Each line is an array of points
                x: PropTypes.number.isRequired,
                y: PropTypes.number.isRequired,
                color: PropTypes.string,
            })
        )
    ).isRequired,
    setBackgroundLines: PropTypes.func.isRequired,
    selectedBrush: PropTypes.string.isRequired,
    currentDrawColor: PropTypes.string.isRequired,
    eraserEnabled: PropTypes.bool.isRequired,
    saveTrigger: PropTypes.bool.isRequired,
    setSaveTrigger: PropTypes.bool.isRequired,
    trashTrigger: PropTypes.bool.isRequired,
    setTrashTrigger: PropTypes.bool.isRequired
};

export default Graph;
