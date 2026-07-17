import { Compass, PenTool, ArrowRight } from "lucide-react";
import PageContainer from "../PageContainer";
import { Line } from "../../types";
import LorenzCanvas from "../LorenzCanvas";

interface Page1IntroProps {
  isDrawingActive: boolean;
  setIsDrawingActive: (active: boolean) => void;
  totalPages: number;
  sketches: Record<number, Line[]>;
  jumpToPage: (pageNum: number) => void;
  navigatePage: (step: number) => void;
}

export default function Page1Intro({
  isDrawingActive,
  setIsDrawingActive,
  totalPages,
  sketches,
  jumpToPage,
  navigatePage,
}: Page1IntroProps) {
  return (
    <PageContainer
      pageNumber={1}
      totalPages={totalPages}
      title="Introduction / Cover Page"
      category="INDEX"
      drawingActive={isDrawingActive}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center max-w-5xl mx-auto py-4">

        {/* Left: Introduction Title */}
        <div className="md:col-span-7 space-y-6 text-left">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-serif italic text-[#1A1A1A] leading-[0.9] tracking-tight">
              Keaton Nemes
              <span className="block text-[#1A1A1A]/60 font-sans uppercase font-bold tracking-[0.15em] pt-2 text-xs md:text-sm">
                Design Technologist
              </span>
            </h2>
            <div className="h-[1px] w-24 bg-[#1A1A1A]/20 mt-3" />
          </div>

          <p className="text-base md:text-lg text-[#1A1A1A]/80 leading-relaxed max-w-xl font-serif italic">
            An interdisciplinary technologist specializing in computational geometry, generative systems, and automated design workflows. I translate complex mathematical frameworks and spatial design schematics into high-performance, full-stack tools.
          </p>

          {/* Profile Log Metadata */}
          <div className="grid grid-cols-3 gap-4 border-y border-[#1A1A1A]/10 py-3 max-w-xl text-[10px] font-mono text-[#1A1A1A]/70">
            <div>
              <span className="text-[#1A1A1A]/40 block text-[8px] tracking-wider uppercase font-bold mb-0.5">Location:</span>
              <span className="text-[#1A1A1A] font-semibold">CHICAGO, IL, USA</span>
            </div>
            <div>
              <span className="text-[#1A1A1A]/40 block text-[8px] tracking-wider uppercase font-bold mb-0.5">Credentials:</span>
              <span className="text-[#1A1A1A] font-semibold">M.Arch (UC Berkeley)</span>
            </div>
            <div>
              <span className="text-[#1A1A1A]/40 block text-[8px] tracking-wider uppercase font-bold mb-0.5">Focus:</span>
              <span className="text-[#1A1A1A] font-semibold block leading-tight">Computational Geometry & Systems Logic</span>
            </div>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-[10px] font-mono font-bold tracking-wider text-[#1A1A1A]/40 uppercase">
              Available Notebook Sections:
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#1A1A1A]/80">
              <button onClick={() => jumpToPage(2)} className="flex items-center gap-1.5 hover:opacity-60 text-left cursor-pointer border-none bg-transparent p-0">
                <span className="font-serif italic font-bold">01.</span> Three.js 3D Showcase
              </button>
              <button onClick={() => jumpToPage(3)} className="flex items-center gap-1.5 hover:opacity-60 text-left cursor-pointer border-none bg-transparent p-0">
                <span className="font-serif italic font-bold">02.</span> System Blueprint UI
              </button>
              <button onClick={() => jumpToPage(4)} className="flex items-center gap-1.5 hover:opacity-60 text-left cursor-pointer border-none bg-transparent p-0">
                <span className="font-serif italic font-bold">03.</span> Interactive Code Snippets
              </button>
              <button onClick={() => jumpToPage(5)} className="flex items-center gap-1.5 hover:opacity-60 text-left cursor-pointer border-none bg-transparent p-0">
                <span className="font-serif italic font-bold">04.</span> Kinetic Particle Sandbox
              </button>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-4">
            <button
              id="btn-intro-toggle-drawing"
              onClick={() => setIsDrawingActive(true)}
              className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#1A1A1A]/80 text-white rounded-none text-xs font-mono uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer"
            >
              <PenTool className="w-4 h-4 text-[#F4F1EA]" />
              <span>GRAB PENCIL & DOODLE</span>
            </button>
            <button
              id="btn-intro-next-page"
              onClick={() => navigatePage(1)}
              className="px-4 py-2 border border-[#1A1A1A]/20 hover:bg-[#1A1A1A]/5 rounded-none text-xs font-mono uppercase tracking-widest flex items-center gap-2 transition-all text-[#1A1A1A] cursor-pointer"
            >
              <span>TURN PAGE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Graphic Card mockup */}
        <div className="md:col-span-5 flex flex-col justify-center">
          <div className="aspect-[4/5] bg-[#EAE7DF] border border-[#1A1A1A]/10 rounded-none p-6 shadow-none relative flex flex-col justify-between overflow-hidden">

            {/* Framed Interactive Attractor Canvas */}
            <div className="flex-1 w-full border border-[#1A1A1A]/10 relative">
              {/* Drafting layout grid marks */}
              <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-[#1A1A1A]/20 pointer-events-none z-10" />
              <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-[#1A1A1A]/20 pointer-events-none z-10" />
              <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-[#1A1A1A]/20 pointer-events-none z-10" />
              <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-[#1A1A1A]/20 pointer-events-none z-10" />
              
              <LorenzCanvas />
            </div>
          </div>
        </div>

      </div>
    </PageContainer>
  );
}
