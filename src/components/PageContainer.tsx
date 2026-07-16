import { ReactNode } from "react";
import { BookOpen, Calendar } from "lucide-react";

interface PageContainerProps {
  pageNumber: number;
  totalPages: number;
  title: string;
  category?: string;
  date?: string;
  children: ReactNode;
  drawingActive: boolean;
}

export default function PageContainer({
  pageNumber,
  totalPages,
  title,
  category = "LOGS",
  date = "JUL 2026",
  children,
  drawingActive,
}: PageContainerProps) {
  return (
    <div
      className={`relative w-full h-full flex-1 min-h-0 bg-[#F4F1EA] border border-[#1A1A1A]/10 rounded-2xl md:rounded-3xl shadow-lg flex flex-col justify-between overflow-hidden select-text transition-all duration-300 ${
        drawingActive ? "shadow-xl ring-1 ring-[#1A1A1A]/20" : ""
      }`}
    >
      
      {/* 1. Tactile Notebook Texture (Editorial Radial Dot Grid) */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }}
      />

      {/* Sleek notebook spine line */}
      <div className="absolute left-6 md:left-10 top-0 bottom-0 w-[1px] bg-[#1A1A1A]/5 pointer-events-none" />

      {/* Sleek Binding Ring Simulation */}
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-[#1A1A1A]/5 to-transparent pointer-events-none z-10" />
      <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-around py-8 pointer-events-none z-20">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="w-3.5 h-1.5 bg-[#1A1A1A]/10 rounded-r border-y border-r border-[#1A1A1A]/15 -ml-1 opacity-60"
          />
         ))}
      </div>

      {/* 2. Page Header Layout */}
      <div className="pt-5 pb-3 px-6 md:px-8 flex justify-between items-center border-b border-[#1A1A1A]/10 bg-[#F4F1EA]/95 backdrop-blur z-10 text-[#1A1A1A]">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]/30" />
          <span className="text-[10px] font-mono text-[#1A1A1A]/40 uppercase tracking-[0.2em]">
            {category}
          </span>
          <span className="text-[#1A1A1A]/20 text-xs font-light">|</span>
          <h2 className="text-xs md:text-sm font-serif italic text-[#1A1A1A] font-medium tracking-wide">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-2 text-[#1A1A1A]/40 font-mono text-[10px] tracking-wider uppercase">
          <Calendar className="w-3.5 h-3.5 opacity-60" />
          <span>{date}</span>
        </div>
      </div>

      {/* 3. Primary Content Canvas Wrapper */}
      <div className="flex-1 w-full px-6 md:px-8 py-5 md:py-6 flex flex-col justify-center items-stretch overflow-y-auto md:overflow-y-hidden relative z-20">
        {children}
      </div>

      {/* 4. Page Footer Layout */}
      <div className="py-3 px-6 md:px-8 border-t border-[#1A1A1A]/10 bg-[#F4F1EA]/90 backdrop-blur z-10 flex justify-between items-center text-[#1A1A1A]">
        
        {/* Drawing Status Flag */}
        <div className="flex items-center gap-2">
          {drawingActive ? (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span className="text-[10px] font-mono text-red-600 font-semibold tracking-wider uppercase">
                DRAWING_MODE_ACTIVE (SCROLLS_FROZEN)
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[#1A1A1A]/40 font-mono text-[9px] tracking-[0.1em] uppercase">
              <BookOpen className="w-3.5 h-3.5 opacity-60" />
              <span>NAVIGATE BY SCROLLING OR CLICKS</span>
            </div>
          )}
        </div>

        {/* Page Pagination Index */}
        <div className="text-[10px] font-mono text-[#1A1A1A]/50 tracking-widest">
          PAGE <span className="text-[#1A1A1A] font-serif italic text-base font-bold ml-1">{pageNumber}</span> / {totalPages}
        </div>

      </div>
    </div>
  );
}
