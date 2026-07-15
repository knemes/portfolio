import { useRef, useEffect, useState, MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from "react";
import { Point, Line } from "../types";

interface SketchCanvasProps {
  isActive: boolean;
  lines: Line[];
  onAddLine: (line: Line) => void;
  currentColor: string;
  currentSize: number;
  currentTool: 'pen' | 'marker' | 'chisel' | 'eraser';
}

export default function SketchCanvas({
  isActive,
  lines,
  onAddLine,
  currentColor,
  currentSize,
  currentTool,
}: SketchCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const currentLinePoints = useRef<Point[]>([]);

  // Redraw all lines whenever lines array or canvas size changes
  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw existing lines
    lines.forEach((line) => {
      if (line.points.length < 1) return;

      ctx.beginPath();
      ctx.strokeStyle = line.color;
      ctx.lineWidth = line.size;

      if (line.tool === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.globalAlpha = 1.0;
      } else if (line.tool === "chisel") {
        ctx.globalCompositeOperation = "source-over";
        ctx.lineCap = "square";
        ctx.lineJoin = "miter";
        ctx.globalAlpha = 0.40; // Semi-transparent highlighter
      } else {
        // pen or marker
        ctx.globalCompositeOperation = "source-over";
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.globalAlpha = 1.0;
      }

      const firstPoint = line.points[0];
      ctx.moveTo(firstPoint.x, firstPoint.y);

      for (let i = 1; i < line.points.length; i++) {
        const p = line.points[i];
        ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    });

    // Reset composite operation and alpha
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1.0;
  };

  // Handle resizing of the canvas to fit parent perfectly
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        
        // Save previous canvas content before resizing to restore it
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext("2d");
        if (tempCtx) {
          tempCtx.drawImage(canvas, 0, 0);
        }

        // Set high-DPI scaling
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.scale(dpr, dpr);
        }

        // Redraw content
        redraw();
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [lines]);

  // Handle canvas redrawing when lines prop changes
  useEffect(() => {
    redraw();
  }, [lines]);

  const getCoordinates = (clientX: number, clientY: number): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (x: number, y: number) => {
    if (!isActive) return;
    setIsDrawing(true);
    currentLinePoints.current = [{ x, y }];

    // Draw initial dot immediately
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    
    const isEraser = currentTool === "eraser";
    const isChisel = currentTool === "chisel";

    ctx.fillStyle = isEraser ? "rgba(0,0,0,0)" : currentColor;
    ctx.strokeStyle = isEraser ? "#fff" : currentColor;
    ctx.lineWidth = currentSize;

    if (isEraser) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.globalAlpha = 1.0;
    } else if (isChisel) {
      ctx.globalCompositeOperation = "source-over";
      ctx.lineCap = "square";
      ctx.lineJoin = "miter";
      ctx.globalAlpha = 0.40;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.globalAlpha = 1.0;
    }

    ctx.arc(x, y, currentSize / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const draw = (x: number, y: number) => {
    if (!isDrawing || !isActive) return;
    const points = currentLinePoints.current;
    if (points.length === 0) return;

    const prevPoint = points[points.length - 1];
    const newPoint = { x, y };
    points.push(newPoint);

    // Draw segment in real-time
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = currentSize;

    const isEraser = currentTool === "eraser";
    const isChisel = currentTool === "chisel";

    if (isEraser) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.globalAlpha = 1.0;
    } else if (isChisel) {
      ctx.globalCompositeOperation = "source-over";
      ctx.lineCap = "square";
      ctx.lineJoin = "miter";
      ctx.globalAlpha = 0.40;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.globalAlpha = 1.0;
    }

    ctx.moveTo(prevPoint.x, prevPoint.y);
    ctx.lineTo(newPoint.x, newPoint.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentLinePoints.current.length > 0) {
      const newLine: Line = {
        id: Math.random().toString(36).substring(2, 9),
        points: [...currentLinePoints.current],
        color: currentColor,
        size: currentSize,
        tool: currentTool,
      };
      onAddLine(newLine);
    }
    currentLinePoints.current = [];
  };

  // Mouse Handlers
  const handleMouseDown = (e: ReactMouseEvent<HTMLCanvasElement>) => {
    const coords = getCoordinates(e.clientX, e.clientY);
    if (coords) startDrawing(coords.x, coords.y);
  };

  const handleMouseMove = (e: ReactMouseEvent<HTMLCanvasElement>) => {
    const coords = getCoordinates(e.clientX, e.clientY);
    if (coords) draw(coords.x, coords.y);
  };

  // Touch Handlers
  const handleTouchStart = (e: ReactTouchEvent<HTMLCanvasElement>) => {
    if (!isActive) return;
    // Prevent scrolling or zooming on touch screens when drawing
    e.preventDefault();
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const coords = getCoordinates(touch.clientX, touch.clientY);
      if (coords) startDrawing(coords.x, coords.y);
    }
  };

  const handleTouchMove = (e: ReactTouchEvent<HTMLCanvasElement>) => {
    if (!isActive) return;
    e.preventDefault();
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const coords = getCoordinates(touch.clientX, touch.clientY);
      if (coords) draw(coords.x, coords.y);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 z-40 select-none ${
        isActive ? "cursor-crosshair pointer-events-auto" : "pointer-events-none"
      }`}
      style={{ touchAction: isActive ? "none" : "auto" }}
    >
      <canvas
        id="sketchbook-canvas"
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={stopDrawing}
        className="block"
      />
    </div>
  );
}
