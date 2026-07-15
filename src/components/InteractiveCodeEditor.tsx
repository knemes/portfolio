import { useState, useEffect, useRef } from "react";
import { Sliders, Code2, Play, Sparkles } from "lucide-react";

export default function InteractiveCodeEditor() {
  const [nodesCount, setNodesCount] = useState<number>(12);
  const [waveSpeed, setWaveSpeed] = useState<number>(2.5);
  const [amplitude, setAmplitude] = useState<number>(40);
  const [waveColor, setWaveColor] = useState<string>("#8b5cf6"); // violet

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  // Render loop for the live wave simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || 300;
      canvas.height = canvas.parentElement?.clientHeight || 200;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const render = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      timeRef.current += 0.01 * waveSpeed;

      const points: { x: number; y: number }[] = [];
      const segmentWidth = canvas.width / (nodesCount - 1);

      // 1. Calculate points of the primary wave
      for (let i = 0; i < nodesCount; i++) {
        const x = i * segmentWidth;
        const offset = i * 0.5;
        const y =
          canvas.height / 2 +
          Math.sin(timeRef.current + offset) * amplitude +
          Math.cos(timeRef.current * 0.5 + offset * 1.5) * (amplitude * 0.3);
        points.push({ x, y });
      }

      // 2. Draw connecting wave line with elegant glow
      ctx.beginPath();
      ctx.strokeStyle = waveColor;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      
      // Add a cool radial/linear glow
      ctx.shadowBlur = 12;
      ctx.shadowColor = waveColor;

      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 0; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
      ctx.stroke();

      // Draw secondary shadow wave for visual depth
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.strokeStyle = "rgba(100, 116, 139, 0.15)";
      ctx.lineWidth = 1.5;
      ctx.moveTo(points[0].x, points[0].y + 15);
      for (let i = 0; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y + 15) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y + 15, xc, yc);
      }
      ctx.stroke();

      // 3. Draw nodes as interactive nodes with graphite ring style
      points.forEach((p, idx) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = waveColor;
        ctx.lineWidth = 2.5;
        ctx.fill();
        ctx.stroke();

        // Subtle connectors to the base
        ctx.beginPath();
        ctx.moveTo(p.x, p.y + 5);
        ctx.lineTo(p.x, canvas.height);
        ctx.strokeStyle = "rgba(120, 113, 108, 0.08)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodesCount, waveSpeed, amplitude, waveColor]);

  // Dynamic code snippet containing the actual state variables
  const codeSnippet = `// Generative Wave Field Hook
import { useMemo, useState } from 'react';

export function useWaveField() {
  const [speed, setSpeed] = useState(${waveSpeed.toFixed(1)});
  const [nodes, setNodes] = useState(${nodesCount});
  const [amp, setAmp] = useState(${amplitude});
  
  const waveOptions = useMemo(() => ({
    color: "${waveColor}",
    frequency: 0.5,
    tension: 0.8,
  }), []);

  return { speed, nodes, amp, waveOptions };
}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full">
      
      {/* Wave Previewer Canvas Panel (5 cols) */}
      <div className="lg:col-span-5 flex flex-col h-full rounded-none bg-[#EAE7DF]/60 border border-[#1A1A1A]/10 overflow-hidden relative min-h-[220px]">
        <div className="p-3 border-b border-[#1A1A1A]/10 bg-[#F4F1EA]/80 backdrop-blur flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#1A1A1A]/60" />
            <span className="text-xs font-mono font-medium text-[#1A1A1A] uppercase tracking-wider">Sandbox Preview</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]/60 animate-pulse"></span>
            <span className="text-[10px] font-mono text-[#1A1A1A]/50">FPS: 60</span>
          </div>
        </div>

        {/* Live Simulation Screen */}
        <div className="flex-1 w-full bg-transparent flex items-center justify-center relative">
          <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
        </div>

        {/* Controls Overlay inside panel */}
        <div className="p-4 bg-[#F4F1EA] border-t border-[#1A1A1A]/10 space-y-3 z-10">
          <div className="flex items-center gap-1.5 border-b border-[#1A1A1A]/10 pb-2">
            <Sliders className="w-3.5 h-3.5 text-[#1A1A1A]/60" />
            <h5 className="text-[11px] font-mono text-[#1A1A1A] uppercase tracking-wider font-bold">Interactive Constants</h5>
          </div>

          <div className="space-y-2">
            {/* Speed slider */}
            <div>
              <div className="flex justify-between text-[10px] font-mono text-[#1A1A1A]/60 mb-1">
                <span>WAVE_SPEED:</span>
                <span className="text-[#1A1A1A] font-semibold">{waveSpeed.toFixed(1)}x</span>
              </div>
              <input
                id="slider-wave-speed"
                type="range"
                min="0.5"
                max="6"
                step="0.5"
                value={waveSpeed}
                onChange={(e) => setWaveSpeed(parseFloat(e.target.value))}
                className="w-full accent-[#1A1A1A] h-1 bg-[#1A1A1A]/10 rounded-lg cursor-pointer"
              />
            </div>

            {/* Nodes slider */}
            <div>
              <div className="flex justify-between text-[10px] font-mono text-[#1A1A1A]/60 mb-1">
                <span>RESOLUTION (NODES):</span>
                <span className="text-[#1A1A1A] font-semibold">{nodesCount}</span>
              </div>
              <input
                id="slider-nodes-count"
                type="range"
                min="4"
                max="24"
                step="1"
                value={nodesCount}
                onChange={(e) => setNodesCount(parseInt(e.target.value))}
                className="w-full accent-[#1A1A1A] h-1 bg-[#1A1A1A]/10 rounded-lg cursor-pointer"
              />
            </div>

            {/* Amplitude slider */}
            <div>
              <div className="flex justify-between text-[10px] font-mono text-[#1A1A1A]/60 mb-1">
                <span>AMPLITUDE:</span>
                <span className="text-[#1A1A1A] font-semibold">{amplitude}px</span>
              </div>
              <input
                id="slider-amplitude"
                type="range"
                min="10"
                max="80"
                step="5"
                value={amplitude}
                onChange={(e) => setAmplitude(parseInt(e.target.value))}
                className="w-full accent-[#1A1A1A] h-1 bg-[#1A1A1A]/10 rounded-lg cursor-pointer"
              />
            </div>

            {/* Accent Hues */}
            <div className="pt-1 flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#1A1A1A]/60">COLOR_ACCENT:</span>
              <div className="flex gap-1.5">
                {[
                  { name: "Charcoal", hex: "#1A1A1A" },
                  { name: "Royal Blue", hex: "#1d4ed8" },
                  { name: "Crimson", hex: "#be123c" },
                  { name: "Olive", hex: "#4d7c0f" },
                  { name: "Sienna", hex: "#a16207" },
                ].map((color) => (
                  <button
                    id={`btn-wavecolor-${color.name}`}
                    key={color.hex}
                    onClick={() => setWaveColor(color.hex)}
                    className={`w-3.5 h-3.5 rounded-full border transition-all cursor-pointer ${
                      waveColor === color.hex
                        ? "scale-115 ring-2 ring-[#1A1A1A]/20 border-[#1A1A1A]"
                        : "border-transparent hover:scale-110"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Snippet Window (7 cols) */}
      <div className="lg:col-span-7 flex flex-col h-full rounded-none bg-white border border-[#1A1A1A]/15 text-[#1A1A1A] font-mono text-[11px] overflow-hidden leading-relaxed shadow-sm">
        {/* Terminal Title Bar */}
        <div className="p-3 bg-[#EAE7DF] border-b border-[#1A1A1A]/10 flex items-center justify-between text-[#1A1A1A]">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]/30"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]/30"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]/30"></span>
            </div>
            <span className="text-[#1A1A1A]/60 text-[10px] ml-1.5 uppercase tracking-widest font-bold">useWaveField.ts — Interactive Code API</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-[#1A1A1A]/60 font-bold uppercase tracking-wider">
            <Code2 className="w-3.5 h-3.5" />
            <span>TYPESCRIPT</span>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 flex-1 overflow-x-auto select-all text-left bg-white text-[#1A1A1A]">
          <pre className="text-[#1A1A1A]">
            {codeSnippet.split("\n").map((line, idx) => {
              // Quick decorative highlighting
              let highlighted = line;
              if (line.startsWith("//")) {
                highlighted = `<span class="text-[#1A1A1A]/40 font-serif italic">${line}</span>`;
              } else {
                highlighted = line
                  .replace(/(import|export|function|const|let|return|useMemo|useState)/g, '<span class="text-indigo-800 font-bold">$1</span>')
                  .replace(/(".*?"|'.*?'|`.*?`)/g, '<span class="text-emerald-700 font-semibold">$1</span>')
                  .replace(/(\b\d+(\.\d+)?\b)/g, '<span class="text-amber-800 font-semibold">$1</span>')
                  .replace(/([{}[\]()])/g, '<span class="text-[#1A1A1A]/40 font-bold">$1</span>');
              }

              return (
                <div key={idx} className="flex hover:bg-[#1A1A1A]/5 px-2 rounded -mx-2">
                  <span className="w-6 text-right text-[#1A1A1A]/30 mr-4 select-none">{idx + 1}</span>
                  <span dangerouslySetInnerHTML={{ __html: highlighted }} />
                </div>
              );
            })}
          </pre>
        </div>

        {/* Console status footer */}
        <div className="px-4 py-2 border-t border-[#1A1A1A]/10 bg-[#EAE7DF]/40 flex items-center justify-between text-[10px] text-[#1A1A1A]/60">
          <div className="flex items-center gap-1.5">
            <Play className="w-3 h-3 text-[#1A1A1A]/60" />
            <span className="text-[#1A1A1A]/60 uppercase tracking-widest text-[9px]">Module recompiled in 4ms</span>
          </div>
          <span className="text-[9px] tracking-wider">UTF-8</span>
        </div>
      </div>

    </div>
  );
}
