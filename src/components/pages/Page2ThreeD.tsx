import { Sparkles } from "lucide-react";
import PageContainer from "../PageContainer";
import ThreeCanvas from "../ThreeCanvas";

interface Page2ThreeDProps {
  isDrawingActive: boolean;
  totalPages: number;
}

export default function Page2ThreeD({ isDrawingActive, totalPages }: Page2ThreeDProps) {
  return (
    <PageContainer
      pageNumber={2}
      totalPages={totalPages}
      title="01. Interactive 3D WebGL Work"
      category="DESIGN"
      drawingActive={isDrawingActive}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
        
        {/* Left: Text & Pitch */}
        <div className="lg:col-span-5 flex flex-col justify-between py-1 text-left space-y-4">
          <div className="space-y-3">
            <span className="text-[10px] font-mono bg-[#1A1A1A] text-white px-2.5 py-1 uppercase tracking-widest inline-block w-fit">
              Interactive Math
            </span>
            <h3 className="text-2xl md:text-3xl font-serif italic text-[#1A1A1A] leading-tight">
              Tactile 3D Wireframes
            </h3>
            <p className="text-sm md:text-base text-[#1A1A1A]/80 leading-relaxed font-serif italic">
              I leverage 3D mathematical meshes to construct high-performance spatial mockups directly in web browsers. By binding canvas mouse interactions, users are invited to inspect meshes dynamically.
            </p>
          </div>

          <div className="p-4 bg-[#EAE7DF]/60 border border-[#1A1A1A]/10 space-y-3 font-mono text-[11px] text-[#1A1A1A]">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#1A1A1A] uppercase tracking-wider pb-1.5 border-b border-[#1A1A1A]/10">
              <Sparkles className="w-3.5 h-3.5 text-[#1A1A1A]/60" />
              <span>3D Project Case Studies</span>
            </div>
            <ul className="list-disc pl-4 space-y-1 text-[#1A1A1A]/70">
              <li>Solar Orbit Mesh Generation</li>
              <li>Tessellated Polyhedrons for CAD</li>
              <li>Reactive Particle Topographies</li>
            </ul>
          </div>

          <div className="text-[10px] font-mono text-[#1A1A1A]/40 border-t border-[#1A1A1A]/10 pt-3 uppercase tracking-widest">
            💡 <strong className="text-[#1A1A1A]/70">Pro-Tip:</strong> Toggle sketch mode at the bottom to draw notation lines directly over the WebGL model!
          </div>
        </div>

        {/* Right: Embedded Interactive 3D Viewport */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <ThreeCanvas />
        </div>

      </div>
    </PageContainer>
  );
}
