import React, { useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import './Graph.css';

function Graph({ mousePos }) {
    const canvasRef = useRef(null);

    const drawGrid = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !canvas.getContext) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = '#EEEEEE';
        ctx.lineWidth = 1;

        const margin = 50; // Margin around the grid
        const gridWidth = width - 2 * margin;
        const gridHeight = height - 2 * margin;
        let gridSize = 20;

        const warp = (x, y) => {
            if (!mousePos) return { x: 0, y: 0 }; // No warp if no mouse position
            const rect = canvas.getBoundingClientRect(); // Get canvas position
            const canvasMouseX = mousePos.x - rect.left; // Difference in x between grid point and mouse
            const canvasMouseY = mousePos.y - rect.top; // Difference in y between grid point and mouse

            const dx = x - canvasMouseX;
            const dy = y - canvasMouseY;
            const dist = Math.sqrt(dx * dx + dy * dy); // Distance between grid point and mouse

            if (dist < 100) { // If mouse is within 100 pixels
                let warpAmount = (100 - dist) / 100 * 10; // Calculate warp amount (stronger closer to mouse)
                return { x: warpAmount * (dx / dist), y: warpAmount * (dy / dist) }; // Return offset
            }
            return { x: 0, y: 0 }; // No warp if mouse is too far away
        };

        // Vertical lines
        for (let xIndex = 0; xIndex <= Math.floor(gridWidth / gridSize); xIndex++) {
            const x = margin + xIndex * gridSize;
            let { x: startWarpX, y: startWarpY } = warp(x, margin);
            let startX = x + startWarpX;
            let startY = margin + startWarpY;

            ctx.beginPath();
            ctx.moveTo(startX, startY);

            for (let yIndex = 0; yIndex <= Math.floor(gridHeight / gridSize); yIndex++) {
                const y = margin + yIndex * gridSize;
                const { x: warpX, y: warpY } = warp(x, y);
                let endX = x + warpX;
                let endY = y + warpY;
                ctx.lineTo(endX, endY);
            }
            ctx.stroke();
        }

        // Horizontal lines (similar adjustments)
        for (let yIndex = 0; yIndex <= Math.floor(gridHeight / gridSize); yIndex++) {
            const y = margin + yIndex * gridSize;
            let { x: startWarpX, y: startWarpY } = warp(margin, y); // Apply margin to warp
            let startX = margin + startWarpX; // Apply margin
            let startY = y + startWarpY;

            ctx.beginPath();
            ctx.moveTo(startX, startY);

            for (let xIndex = 0; xIndex <= Math.floor(gridWidth / gridSize); xIndex++) { // Adjusted loop
                const x = margin + xIndex * gridSize;
                const { x: warpX, y: warpY } = warp(x, y);
                let endX = x + warpX;
                let endY = y + warpY;
                ctx.lineTo(endX, endY);
            }
            ctx.stroke();
        }
    }, [mousePos]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const handleResize = () => { // Create a stable resize handler
                canvas.width = window.innerWidth;
                canvas.height = document.body.scrollHeight;
                drawGrid();
            };

            window.addEventListener('resize', handleResize); // Use the stable handler
            handleResize(); // Initial resize

            return () => {
                window.removeEventListener('resize', handleResize); // Remove the correct handler
            };
        }
    }, [drawGrid]);

    return <canvas ref={canvasRef} className="graph" />;
}

Graph.propTypes = {
    mousePos: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired
    }).isRequired
};

export default Graph;
