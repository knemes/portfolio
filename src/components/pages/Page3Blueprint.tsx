import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, X, Sliders } from "lucide-react";
import PageContainer from "../PageContainer";

interface Page3BlueprintProps {
  isDrawingActive: boolean;
  totalPages: number;
}

interface IslandDetail {
  title: string;
  subtitle: string;
  description: string;
  specs: { label: string; value: string }[];
  architecturalNotes: string;
}

export default function Page3Blueprint({ isDrawingActive, totalPages }: Page3BlueprintProps) {
  const [blueprintViewport, setBlueprintViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [blueprintTheme, setBlueprintTheme] = useState<"blueprint" | "monochrome">("blueprint");
  const [selectedIsland, setSelectedIsland] = useState<null | IslandDetail>(null);

  return (
    <>
      <PageContainer
        pageNumber={3}
        totalPages={totalPages}
        title="02. Product Blueprint Wireframing"
        category="PRODUCT"
        drawingActive={isDrawingActive}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
          
          {/* Left: Blueprint controls & Description */}
          <div className="lg:col-span-5 flex flex-col justify-between py-1 text-left space-y-4">
            <div className="space-y-3">
              <span className="text-[10px] font-mono bg-[#1A1A1A] text-white px-2.5 py-1 uppercase tracking-widest inline-block w-fit">
                Wireframe Grid
              </span>
              <h3 className="text-2xl md:text-3xl font-serif italic text-[#1A1A1A] leading-tight">
                Responsive Blueprints
              </h3>
              <p className="text-sm md:text-base text-[#1A1A1A]/80 leading-relaxed font-serif italic">
                Before writing code, product design requires rigorous structural drafting. This mock viewport allows toggling between mobile, tablet, and desktop aspect ratios to preview responsive wireframe scaling.
              </p>
            </div>

            {/* Standardized specs card layout enclosing settings */}
            <div className="p-4 bg-[#EAE7DF]/60 border border-[#1A1A1A]/10 space-y-3 font-mono text-[11px] text-[#1A1A1A]">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#1A1A1A] uppercase tracking-wider pb-1.5 border-b border-[#1A1A1A]/10">
                <Sliders className="w-3.5 h-3.5 text-[#1A1A1A]/60" />
                <span>Blueprint Controllers</span>
              </div>
              
              <div className="space-y-3 pt-1">
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-[#1A1A1A]/40 uppercase tracking-widest block font-bold">
                    Select Target Viewport
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(["desktop", "tablet", "mobile"] as const).map((v) => (
                      <button
                        id={`btn-viewport-${v}`}
                        key={v}
                        onClick={() => setBlueprintViewport(v)}
                        className={`text-[9px] font-mono py-1 border border-[#1A1A1A]/15 capitalize transition-all rounded-none cursor-pointer ${
                          blueprintViewport === v
                            ? "bg-[#1A1A1A] border-[#1A1A1A] text-white font-bold"
                            : "bg-white/50 border-[#1A1A1A]/10 text-[#1A1A1A]/60 hover:bg-[#1A1A1A]/5 hover:text-[#1A1A1A]"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-[#1A1A1A]/40 uppercase tracking-widest block font-bold">
                    Aesthetic Scheme
                  </span>
                  <div className="flex gap-2">
                    <button
                      id="btn-theme-blueprint"
                      onClick={() => setBlueprintTheme("blueprint")}
                      className={`flex-1 text-[9px] font-mono py-1 border border-[#1A1A1A]/15 transition-all rounded-none cursor-pointer ${
                        blueprintTheme === "blueprint"
                          ? "bg-blue-900 border-blue-900 text-white font-bold"
                          : "bg-white/50 border-[#1A1A1A]/10 text-[#1A1A1A]/60 hover:bg-[#1A1A1A]/5"
                      }`}
                    >
                      Cyan Blueprint
                    </button>
                    <button
                      id="btn-theme-monochrome"
                      onClick={() => setBlueprintTheme("monochrome")}
                      className={`flex-1 text-[9px] font-mono py-1 border border-[#1A1A1A]/15 transition-all rounded-none cursor-pointer ${
                        blueprintTheme === "monochrome"
                          ? "bg-[#1A1A1A] border-[#1A1A1A] text-white font-bold"
                          : "bg-white/50 border-[#1A1A1A]/10 text-[#1A1A1A]/60 hover:bg-[#1A1A1A]/5"
                      }`}
                    >
                      Monochrome
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[10px] font-mono text-[#1A1A1A]/40 border-t border-[#1A1A1A]/10 pt-3 uppercase tracking-widest">
              🖊️ Draping sketches on top mimics drawing corrections on paper architectural rolls!
            </div>
          </div>

          {/* Right: Dynamic scaling wireframe previewer */}
          <div className="lg:col-span-7 flex items-center justify-center bg-[#EAE7DF] rounded-none border border-[#1A1A1A]/10 p-4 min-h-[440px] relative overflow-hidden">
            
            {/* Interactive wireframe container that animatedly changes width */}
            <motion.div
              id="blueprint-device-wrapper"
              animate={{
                width:
                  blueprintViewport === "desktop"
                    ? "100%"
                    : blueprintViewport === "tablet"
                    ? "70%"
                    : "38%",
              }}
              transition={{ type: "spring", stiffness: 220, damping: 25 }}
              className={`h-[420px] rounded-none shadow-md border p-4 flex flex-col justify-between transition-colors duration-300 ${
                blueprintTheme === "blueprint"
                  ? "bg-blue-900/95 border-blue-700 text-blue-200"
                  : "bg-[#1A1A1A] border-[#1A1A1A]/20 text-stone-300"
              }`}
            >
              {/* Device header */}
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20"></span>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-white/50">
                    viewport::{blueprintViewport}
                  </span>
                </div>
                <span className="text-[9px] font-mono text-white/40">
                  SCALE: {blueprintViewport === "desktop" ? "100%" : blueprintViewport === "tablet" ? "80%" : "65%"}
                </span>
              </div>

              {/* Interactive Bento Wireframe Grid */}
              <div className="flex-1 grid grid-cols-12 gap-2 my-4">
                
                {/* Banner bento (top) */}
                <div 
                  onClick={() => setSelectedIsland({
                    title: "Structural Division Layout",
                    subtitle: "Modular Framework Header",
                    description: "This element coordinates the main frame layout and maps parent alignment bounds in absolute screen coordinates. It dynamically handles the responsive boundary markers for wide versus compact displays.",
                    specs: [
                      { label: "GRID_GAP", value: "24px" },
                      { label: "Z_INDEX", value: "10 (Standard Layer)" },
                      { label: "REF_BOUNDS", value: "1280px Maximum" }
                    ],
                    architecturalNotes: "By leveraging CSS Grid fractions alongside physical micro-margins, this header maintains rigid horizontal margins that align cleanly with the sketchbook spine rings."
                  })}
                  className="col-span-12 rounded bg-white/5 border border-white/10 hover:border-[#E0825B]/60 hover:bg-white/10 p-2 flex flex-col justify-center items-start text-left min-h-[50px] cursor-pointer group/island transition-all relative"
                >
                  <div className="absolute right-2 top-2 opacity-0 group-hover/island:opacity-100 transition-opacity text-[8px] font-mono text-[#E0825B] tracking-wider uppercase">
                    inspect +
                  </div>
                  <div className="h-2 w-1/3 bg-white/20 rounded mb-1.5" />
                  <div className="h-1.5 w-2/3 bg-white/10 rounded" />
                </div>

                {/* Left tall card */}
                <div 
                  onClick={() => setSelectedIsland({
                    title: "3D CAD Polyhedron Assembly",
                    subtitle: "Kinetic Geometry Engine",
                    description: "The visual staging area for mechanical vector illustrations. Clicking, dragging, or moving the cursor transforms vertex points into real-time rotational matrices.",
                    specs: [
                      { label: "POLY_VERTICES", value: "1,200 points" },
                      { label: "RENDER_MODE", value: "WebGL Core" },
                      { label: "CPU_STALL", value: "0% (Optimized)" }
                    ],
                    architecturalNotes: "Engineered with three-dimensional buffer arrays to allow overlay sketches to run simultaneously on the browser UI thread without dropping keyframes."
                  })}
                  className="col-span-12 md:col-span-4 rounded bg-white/5 border border-white/10 hover:border-[#E0825B]/60 hover:bg-white/10 p-2 flex flex-col justify-between text-left min-h-[60px] cursor-pointer group/island transition-all relative"
                >
                  <div className="absolute right-2 top-2 opacity-0 group-hover/island:opacity-100 transition-opacity text-[8px] font-mono text-[#E0825B] tracking-wider uppercase">
                    inspect +
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-2 w-1/2 bg-white/20 rounded" />
                    <div className="h-1.5 w-5/6 bg-white/10 rounded" />
                  </div>
                  <div className="h-2.5 w-8 bg-amber-500/30 rounded mt-2" />
                </div>

                {/* Center main grid content card */}
                <div 
                  onClick={() => setSelectedIsland({
                    title: "Universal State Router",
                    subtitle: "Unidirectional Navigation Bridge",
                    description: "Integrates the drawing canvas history arrays with client state managers. It tracks pages, caches coordinates per-page, and dispatches tick position values.",
                    specs: [
                      { label: "PERSIST", value: "Local JSON" },
                      { label: "STATE_FLOW", value: "Active Event Bus" },
                      { label: "LATENCY", value: "0ms Immediate Sync" }
                    ],
                    architecturalNotes: "Separating the heavy canvas paint actions from React reflow loops ensures zero lag while sketching in detail modes."
                  })}
                  className="col-span-12 md:col-span-5 rounded bg-white/5 border border-white/10 hover:border-[#E0825B]/60 hover:bg-white/10 p-2 flex flex-col justify-between text-left min-h-[60px] cursor-pointer group/island transition-all relative"
                >
                  <div className="absolute right-2 top-2 opacity-0 group-hover/island:opacity-100 transition-opacity text-[8px] font-mono text-[#E0825B] tracking-wider uppercase">
                    inspect +
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 w-full bg-white/10 rounded" />
                    <div className="h-1.5 w-full bg-white/10 rounded" />
                    <div className="h-1.5 w-2/3 bg-white/10 rounded" />
                  </div>
                  <div className="flex justify-between mt-2">
                    <div className="w-3 h-3 rounded-full bg-white/10" />
                    <div className="w-3 h-3 rounded-full bg-white/10" />
                    <div className="w-3 h-3 rounded-full bg-white/10" />
                  </div>
                </div>

                {/* Right tall profile bento */}
                <div 
                  onClick={() => setSelectedIsland({
                    title: "Designer Identity Module",
                    subtitle: "Creator Profile Signature",
                    description: "Holds professional credentials, portfolio logs, and contact portals. It supports cryptographic validation keys for secure client-to-creator communications.",
                    specs: [
                      { label: "CREATOR", value: "K. Nemes" },
                      { label: "VERIFICATION", value: "AES-GCM SHA-2" },
                      { label: "CONTRACTS", value: "Open for Consultation" }
                    ],
                    architecturalNotes: "A combination of precise digital drafting aesthetics and strict technical engineering. Perfect for full-stack, secure, production-ready systems."
                  })}
                  className="col-span-12 md:col-span-3 rounded bg-white/5 border border-white/10 hover:border-[#E0825B]/60 hover:bg-white/10 p-2 flex flex-col items-center justify-center gap-1.5 min-h-[60px] cursor-pointer group/island transition-all relative"
                >
                  <div className="absolute right-2 top-2 opacity-0 group-hover/island:opacity-100 transition-opacity text-[8px] font-mono text-[#E0825B] tracking-wider uppercase">
                    inspect +
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/15" />
                  <div className="h-1.5 w-10 bg-white/15 rounded" />
                </div>

              </div>

              {/* Footer */}
              <div className="border-t border-white/10 pt-2 flex justify-between items-center text-[8px] font-mono text-white/30">
                <span>GRID_X: 12_COL_FLOW</span>
                <span>SENSITIVITY: HIGH</span>
              </div>

            </motion.div>
            
          </div>

        </div>
      </PageContainer>

      {/* Detail Island Pop-up Modal */}
      <AnimatePresence>
        {selectedIsland && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.35 }}
              className="w-full max-w-lg bg-[#F4F1EA] border-2 border-[#1A1A1A] p-6 text-left relative shadow-[4px_4px_0px_0px_#1A1A1A]"
            >
              <button
                id="btn-close-island-modal"
                onClick={() => setSelectedIsland(null)}
                className="absolute top-4 right-4 p-1 hover:bg-[#1A1A1A]/5 text-[#1A1A1A] transition-colors border border-transparent hover:border-[#1A1A1A]/10 cursor-pointer"
                title="Close Details"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-4">
                {/* Header */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase bg-[#1A1A1A] text-white px-2 py-0.5 tracking-wider">
                    Blueprint Detail Island
                  </span>
                  <h3 className="text-xl font-serif italic text-[#1A1A1A] leading-tight pr-6 pt-1">
                    {selectedIsland.title}
                  </h3>
                  <p className="text-[10px] font-mono text-[#1A1A1A]/60">
                    {selectedIsland.subtitle}
                  </p>
                </div>

                <div className="h-[1px] w-full bg-[#1A1A1A]/15" />

                {/* Description */}
                <p className="text-sm text-[#1A1A1A]/80 leading-relaxed font-serif italic">
                  "{selectedIsland.description}"
                </p>

                {/* Technical Specifications */}
                <div className="space-y-1.5 bg-white/50 p-3 border border-[#1A1A1A]/10">
                  <span className="text-[9px] font-mono font-bold text-[#1A1A1A]/50 uppercase tracking-widest block">
                    Technical Metrics:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {selectedIsland.specs.map((spec, i) => (
                      <div key={i} className="space-y-0.5 border-l border-[#1A1A1A]/10 pl-2">
                        <span className="text-[8px] font-mono text-[#1A1A1A]/40 uppercase block">
                          {spec.label}
                        </span>
                        <span className="text-[11px] font-mono font-semibold text-[#1A1A1A]">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Architectural Notes */}
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-bold text-[#1A1A1A]/50 uppercase tracking-widest block">
                    Architectural Implementation Notes:
                  </span>
                  <p className="text-[10px] font-mono text-[#1A1A1A]/70 leading-relaxed bg-[#EAE7DF]/50 p-2.5 border border-dashed border-[#1A1A1A]/15">
                    {selectedIsland.architecturalNotes}
                  </p>
                </div>

                {/* Footer Close Button */}
                <button
                  id="btn-footer-close-island"
                  onClick={() => setSelectedIsland(null)}
                  className="w-full py-2 bg-[#1A1A1A] hover:bg-[#2c2a29] text-white text-xs font-mono font-semibold tracking-wider transition-all cursor-pointer border-none"
                >
                  DISMISS EXPLORER
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
