import React, { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
  history: { x: number; y: number }[];
}

export default function LorenzCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [params, setParams] = useState({ sigma: 10.0, rho: 28.0, beta: 8 / 3 });
  const [isHovered, setIsHovered] = useState(false);

  // Mouse coordinate refs
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = containerRef.current.clientWidth);
    let height = (canvas.height = containerRef.current.clientHeight);

    const handleResize = () => {
      if (!containerRef.current) return;
      width = canvas.width = containerRef.current.clientWidth;
      height = canvas.height = containerRef.current.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    // Initialize particles clustered around a starting point
    const particleCount = 140;
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: 0.1 + Math.random() * 0.1,
        y: Math.random() * 0.1,
        z: 25 + Math.random() * 0.1,
        history: [],
      });
    }

    // System parameters (initial values)
    let sigma = 10.0;
    let rho = 28.0;
    const beta = 8 / 3;

    // Timestep for differential equations (calibrated for speed & stability)
    const dt = 0.006;

    // Projection rotation angles
    let angleX = 0.35;
    let angleY = 0.5;

    const loop = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw mathematical grid lines (Drafting style)
      ctx.strokeStyle = "rgba(26, 26, 26, 0.02)";
      ctx.lineWidth = 1;
      const gridSize = 25;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw polar concentric draft lines
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, Math.min(width, height) * 0.28, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(26, 26, 26, 0.025)";
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, Math.min(width, height) * 0.14, 0, Math.PI * 2);
      ctx.stroke();

      // Update parameters based on mouse coordinates or defaults
      if (isHovered) {
        // Map cursor position to highly stable ranges:
        // X maps to rho (14.0 to 36.0)
        // Y maps to sigma (8.0 to 16.0)
        const targetRho = 14.0 + (mouseRef.current.x / width) * 22.0;
        const targetSigma = 8.0 + (mouseRef.current.y / height) * 8.0;
        rho += (targetRho - rho) * 0.08;
        sigma += (targetSigma - sigma) * 0.08;

        // Mouse coordinates control rotation coordinates reactively
        const targetAngleY = 0.2 + (mouseRef.current.x / width) * 1.5;
        const targetAngleX = 0.15 + (mouseRef.current.y / height) * 0.9;
        angleY += (targetAngleY - angleY) * 0.08;
        angleX += (targetAngleX - angleX) * 0.08;
      } else {
        // Smoothly return to default stable values
        const targetRho = 28.0;
        const targetSigma = 10.0;
        rho += (targetRho - rho) * 0.04;
        sigma += (targetSigma - sigma) * 0.04;

        // Auto rotation when idle
        angleY += 0.003;
        angleX = 0.35 + Math.sin(Date.now() * 0.0006) * 0.06;
      }

      // Expose current parameters to HUD
      setParams({ sigma, rho, beta });

      // Dynamic scale factors based on rho to keep the attractor bound within limits
      const scale = (Math.min(width, height) * 0.38) / Math.max(25, rho);

      // Run Attractor Math & Project points to 2D
      particles.forEach((p) => {
        // Lorenz System Differential Formulas
        const dx = sigma * (p.y - p.x) * dt;
        const dy = (p.x * (rho - p.z) - p.y) * dt;
        const dz = (p.x * p.y - beta * p.z) * dt;

        p.x += dx;
        p.y += dy;
        p.z += dz;

        // Reset safeguard to catch rare divergence/singularity slips
        if (isNaN(p.x) || Math.abs(p.x) > 100 || p.z < -20 || p.z > 120) {
          p.x = 0.1 + Math.random() * 0.1;
          p.y = Math.random() * 0.1;
          p.z = 25 + Math.random() * 0.1;
          p.history = [];
        }

        // CENTER ATTRACTOR VERTICALLY:
        // The attractor centroid lies around Z = 24.5. Subtracting it ensures rotation happens in place.
        let tempX = p.x;
        let tempY = p.y;
        let tempZ = p.z - 24.5; 

        // Apply 3D Rotations
        // Rotate around Y-Axis
        let x1 = tempX * Math.cos(angleY) - tempZ * Math.sin(angleY);
        let z1 = tempX * Math.sin(angleY) + tempZ * Math.cos(angleY);

        // Rotate around X-Axis
        let y2 = tempY * Math.cos(angleX) - z1 * Math.sin(angleX);

        // Map to Screen Coordinates
        const screenX = width / 2 + x1 * scale;
        const screenY = height / 2 + y2 * scale;

        // Capture coordinates history for drawing clean trails
        p.history.push({ x: screenX, y: screenY });
        if (p.history.length > 15) {
          p.history.shift();
        }

        // Draw graphite tail trails
        if (p.history.length > 1) {
          ctx.beginPath();
          ctx.moveTo(p.history[0].x, p.history[0].y);
          for (let k = 1; k < p.history.length; k++) {
            ctx.lineTo(p.history[k].x, p.history[k].y);
          }
          ctx.strokeStyle = "rgba(26, 26, 26, 0.055)";
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }

        // Draw particle head
        ctx.beginPath();
        ctx.arc(screenX, screenY, 1.6, 0, Math.PI * 2);
        
        // Highlight particle color if it comes close to mouse
        if (isHovered) {
          const mdx = screenX - mouseRef.current.x;
          const mdy = screenY - mouseRef.current.y;
          const dist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (dist < 40) {
            ctx.fillStyle = "rgba(224, 130, 91, 0.75)"; // Highlight orange
          } else {
            ctx.fillStyle = "rgba(26, 26, 26, 0.4)";
          }
        } else {
          ctx.fillStyle = "rgba(26, 26, 26, 0.3)";
        }
        ctx.fill();
      });

      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isHovered]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden bg-[#f4ede2]/40 border border-[#1A1A1A]/10 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] cursor-crosshair"
    >
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="block w-full h-full"
      />

      {/* Floating HUD Panel */}
      <div className="absolute top-2.5 left-2.5 pointer-events-none font-mono text-[8px] text-[#1A1A1A]/50 space-y-0.5 leading-normal select-none">
        <div>SYS::CHAOS_MODELER</div>
        <div className="text-[7px] font-serif italic opacity-80">
          dx/dt = σ(y - x) | dy/dt = x(ρ - z) - y | dz/dt = xy - βz
        </div>
      </div>

      {/* Floating Parameter Variables overlay */}
      <div className="absolute bottom-2.5 left-2.5 pointer-events-none font-mono text-[8px] text-[#1A1A1A]/50 flex gap-4 select-none">
        <div>
          SIGMA (σ): <span className="text-[#1A1A1A] font-bold">{params.sigma.toFixed(2)}</span>
        </div>
        <div>
          RHO (ρ): <span className="text-[#1A1A1A] font-bold">{params.rho.toFixed(2)}</span>
        </div>
        <div>
          BETA (β): <span className="text-[#1A1A1A]/35">2.67</span>
        </div>
      </div>

      {/* Hover action prompt */}
      <div className="absolute bottom-2.5 right-2.5 pointer-events-none font-mono text-[7px] text-[#1A1A1A]/35 uppercase tracking-wider select-none">
        {isHovered ? "REACTING_TO_CURSOR" : "HOVER TO WARP ATTRACTOR"}
      </div>
    </div>
  );
}
