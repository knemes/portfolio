import { useState, useEffect, useRef } from "react";
import PageContainer from "../PageContainer";

interface Page5SandboxProps {
  isDrawingActive: boolean;
  totalPages: number;
  activePage: number;
}

export default function Page5Sandbox({
  isDrawingActive,
  totalPages,
  activePage,
}: Page5SandboxProps) {
  const [vortexDensity, setVortexDensity] = useState<number>(150);
  const [vortexSpeed, setVortexSpeed] = useState<number>(1.5);
  const [vortexForce, setVortexForce] = useState<number>(2);
  const vortexCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Page 5 kinetic vortex particle engine
  useEffect(() => {
    if (activePage !== 5 || !vortexCanvasRef.current) return;
    const canvas = vortexCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 350);

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || 500;
      height = canvas.height = canvas.parentElement?.clientHeight || 350;
    };
    window.addEventListener("resize", handleResize);

    // Particle class definition
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      angle: number;
      distToCenter: number;
      speedMult: number;

      constructor() {
        this.angle = Math.random() * Math.PI * 2;
        this.distToCenter = Math.random() * Math.min(width, height) * 0.45 + 10;
        this.x = width / 2 + Math.cos(this.angle) * this.distToCenter;
        this.y = height / 2 + Math.sin(this.angle) * this.distToCenter;
        this.vx = 0;
        this.vy = 0;
        this.size = Math.random() * 2 + 1;
        this.speedMult = Math.random() * 0.8 + 0.4;
      }

      update(mx: number, my: number, useMouse: boolean) {
        // Orbit math relative to center or cursor
        const cx = useMouse ? mx : width / 2;
        const cy = useMouse ? my : height / 2;

        const dx = this.x - cx;
        const dy = this.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        // Tangent angle orbit
        const orbitAngle = Math.atan2(dy, dx) + (0.015 * vortexSpeed * this.speedMult);
        
        // Attract pull
        const pull = (useMouse ? 0.05 : 0.02) * vortexForce;
        const targetDist = useMouse ? dist * 0.95 : this.distToCenter;

        const targetX = cx + Math.cos(orbitAngle) * targetDist;
        const targetY = cy + Math.sin(orbitAngle) * targetDist;

        // Inertia easing
        this.x += (targetX - this.x) * 0.1;
        this.y += (targetY - this.y) * 0.1;
      }

      draw(c: CanvasRenderingContext2D) {
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fillStyle = "rgba(75, 85, 99, 0.45)"; // graphite dust style
        c.fill();
      }
    }

    // Initialize particles
    const particles: Particle[] = [];
    for (let i = 0; i < vortexDensity; i++) {
      particles.push(new Particle());
    }

    // Pointer coordinates tracking
    let pointerX = width / 2;
    let pointerY = height / 2;
    let isHovered = false;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerX = e.clientX - rect.left;
      pointerY = e.clientY - rect.top;
    };

    const onMouseEnter = () => (isHovered = true);
    const onMouseLeave = () => (isHovered = false);

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseenter", onMouseEnter);
    canvas.addEventListener("mouseleave", onMouseLeave);

    const loop = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw vector concentric rings for aesthetics
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, Math.min(width, height) * 0.2, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(120, 113, 108, 0.04)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(width / 2, height / 2, Math.min(width, height) * 0.35, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(120, 113, 108, 0.02)";
      ctx.stroke();

      // Render vortex core if cursor is active
      if (isHovered) {
        ctx.beginPath();
        ctx.arc(pointerX, pointerY, 8, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(224, 130, 91, 0.15)";
        ctx.fill();
      }

      particles.forEach((p) => {
        p.update(pointerX, pointerY, isHovered);
        p.draw(ctx);
      });

      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseenter", onMouseEnter);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [activePage, vortexDensity, vortexSpeed, vortexForce]);

  return (
    <PageContainer
      pageNumber={5}
      totalPages={totalPages}
      title="04. Kinetic Physics Sandbox"
      category="SANDBOX"
      drawingActive={isDrawingActive}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
        
        {/* Left: Interactive Particle canvas screen */}
        <div className="lg:col-span-7 flex flex-col h-full justify-between gap-4">
          <div className="flex-1 w-full bg-[#EAE7DF] border border-[#1A1A1A]/10 overflow-hidden relative min-h-[385px]">
            <canvas ref={vortexCanvasRef} className="absolute inset-0 block w-full h-full" />
            
            <div className="absolute bottom-3 left-3 pointer-events-none bg-[#F4F1EA]/90 backdrop-blur border border-[#1A1A1A]/10 px-2.5 py-1 text-[9px] font-mono text-[#1A1A1A]/60 uppercase tracking-widest">
              Hover over Canvas to attract particle dust
            </div>
          </div>
        </div>

        {/* Right: Particle Parameters sliders */}
        <div className="lg:col-span-5 flex flex-col justify-between py-1 text-left space-y-4">
          <div className="space-y-3">
            <span className="text-[10px] font-mono bg-[#1A1A1A] text-white px-2 py-1 uppercase tracking-widest">
              Kinetic Physics
            </span>
            <h3 className="text-xl md:text-2xl font-serif italic text-[#1A1A1A] leading-tight">
              Graphite Vortex Sim
            </h3>
            <p className="text-base text-[#1A1A1A]/80 leading-relaxed font-serif italic">
              A real-time HTML5 2D Canvas physics sandbox that mimics charcoal lead shavings swarming in orbit. Drag or hover your mouse inside the container to warp gravity forces.
            </p>
          </div>

          {/* Interactive Sliders */}
          <div className="p-4 bg-[#EAE7DF]/60 border border-[#1A1A1A]/10 space-y-3">
            <h4 className="text-[10px] font-mono font-bold text-[#1A1A1A]/60 uppercase tracking-widest pb-1.5 border-b border-[#1A1A1A]/10">
              Gravity Parameters
            </h4>

            <div className="space-y-2">
              {/* Particle density */}
              <div>
                <div className="flex justify-between text-[10px] font-mono text-[#1A1A1A]/60 mb-1">
                  <span>PARTICLE_DENSITY:</span>
                  <span className="text-[#1A1A1A] font-semibold">{vortexDensity}</span>
                </div>
                <input
                  id="slider-vortex-density"
                  type="range"
                  min="50"
                  max="400"
                  step="25"
                  value={vortexDensity}
                  onChange={(e) => setVortexDensity(parseInt(e.target.value))}
                  className="w-full accent-[#1A1A1A] h-1 bg-[#1A1A1A]/10 cursor-pointer"
                />
              </div>

              {/* Rotation Speed */}
              <div>
                <div className="flex justify-between text-[10px] font-mono text-[#1A1A1A]/60 mb-1">
                  <span>ROTATION_VELOCITY:</span>
                  <span className="text-[#1A1A1A] font-semibold">{vortexSpeed.toFixed(1)}x</span>
                </div>
                <input
                  id="slider-vortex-speed"
                  type="range"
                  min="0.5"
                  max="4"
                  step="0.5"
                  value={vortexSpeed}
                  onChange={(e) => setVortexSpeed(parseFloat(e.target.value))}
                  className="w-full accent-[#1A1A1A] h-1 bg-[#1A1A1A]/10 cursor-pointer"
                />
              </div>

              {/* Pull force */}
              <div>
                <div className="flex justify-between text-[10px] font-mono text-[#1A1A1A]/60 mb-1">
                  <span>ATTRACTION_FORCE:</span>
                  <span className="text-[#1A1A1A] font-semibold">{vortexForce}</span>
                </div>
                <input
                  id="slider-vortex-force"
                  type="range"
                  min="1"
                  max="5"
                  step="0.5"
                  value={vortexForce}
                  onChange={(e) => setVortexForce(parseFloat(e.target.value))}
                  className="w-full accent-[#1A1A1A] h-1 bg-[#1A1A1A]/10 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="text-[10px] font-mono text-stone-400">
            🖋️ Sketch notes right onto the swarming dust clouds for an amazing aesthetic!
          </div>
        </div>

      </div>
    </PageContainer>
  );
}
