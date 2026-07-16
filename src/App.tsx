import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  Trash2,
  Lock,
  X,
  Sparkles,
} from "lucide-react";

import { Line, PenType } from "./types";
import SketchCanvas from "./components/SketchCanvas";
import DrawingToolbar from "./components/DrawingToolbar";

import Page1Intro from "./components/pages/Page1Intro";
import Page2ThreeD from "./components/pages/Page2ThreeD";
import Page3Blueprint from "./components/pages/Page3Blueprint";
import Page4Editor from "./components/pages/Page4Editor";
import Page5Sandbox from "./components/pages/Page5Sandbox";
import Page6Contact from "./components/pages/Page6Contact";

export default function App() {
  // Page state
  const TOTAL_PAGES = 6;
  const [activePage, setActivePage] = useState<number>(1);

  // Drawing state
  const [isDrawingActive, setIsDrawingActive] = useState<boolean>(false);
  const [selectedPen, setSelectedPen] = useState<PenType>("pen");
  const [penSize, setPenSize] = useState<number>(2);
  const [currentColor, setCurrentColor] = useState<string>("#1A1A1A");
  const [sketches, setSketches] = useState<Record<number, Line[]>>({});

  // Help info state
  const [showHelp, setShowHelp] = useState<boolean>(false);

  // Load sketches from LocalStorage on mount
  useEffect(() => {
    try {
      const savedSketches = localStorage.getItem("notebook_sketches");
      if (savedSketches) {
        setSketches(JSON.parse(savedSketches));
      }
    } catch (e) {
      console.error("Error loading sketches from local storage", e);
    }
  }, []);

  // Sync sketches to LocalStorage when they change
  const saveSketches = (newSketches: Record<number, Line[]>) => {
    setSketches(newSketches);
    try {
      localStorage.setItem("notebook_sketches", JSON.stringify(newSketches));
    } catch (e) {
      console.error("Error saving sketches to local storage", e);
    }
  };

  // Keyboard Hotkeys listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore hotkeys when user is focused in form elements
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      if (key === "d") {
        e.preventDefault();
        setIsDrawingActive((prev) => !prev);
      } else if (key === "c") {
        e.preventDefault();
        clearCurrentPageCanvas();
      } else if (key === "arrowright" && !isDrawingActive) {
        navigatePage(1);
      } else if (key === "arrowleft" && !isDrawingActive) {
        navigatePage(-1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePage, isDrawingActive, sketches]);

  // Handle Page Turn transitions safely
  const navigatePage = (step: number) => {
    if (isDrawingActive) return; // Prevent navigation in drawing mode
    const targetPage = activePage + step;
    if (targetPage >= 1 && targetPage <= TOTAL_PAGES) {
      setActivePage(targetPage);
    }
  };

  const jumpToPage = (pageNum: number) => {
    if (isDrawingActive) return; // Prevent jumping in drawing mode
    if (pageNum === activePage) return;
    setActivePage(pageNum);
  };

  // Canvas Drawing Actions
  const handleAddLine = (line: Line) => {
    const pageLines = sketches[activePage] || [];
    const updated = {
      ...sketches,
      [activePage]: [...pageLines, line],
    };
    saveSketches(updated);
  };

  const clearCurrentPageCanvas = () => {
    const updated = {
      ...sketches,
      [activePage]: [],
    };
    saveSketches(updated);
  };

  const clearAllNotebookCanvas = () => {
    if (window.confirm("Are you sure you want to erase doodles on EVERY page of the notebook?")) {
      saveSketches({});
    }
  };

  const lastScrollTimeRef = useRef<number>(0);

  // Wheel Horizontal Page Navigation Swiper with 800ms cooldown throttle
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isDrawingActive) return;

      const now = Date.now();
      if (now - lastScrollTimeRef.current < 800) return; // Cooldown throttle to prevent rapid skips

      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 35) return; // sensitivity filter

      if (delta > 0) {
        if (activePage < TOTAL_PAGES) {
          setActivePage((prev) => Math.min(TOTAL_PAGES, prev + 1));
          lastScrollTimeRef.current = now;
        }
      } else {
        if (activePage > 1) {
          setActivePage((prev) => Math.max(1, prev - 1));
          lastScrollTimeRef.current = now;
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [activePage, isDrawingActive, TOTAL_PAGES]);

  // Capture active page as a high-fidelity image download using html2canvas
  const handleTakeScreenshot = async () => {
    const target = document.getElementById("notebook-capture-target");
    if (!target) return;

    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvasElement = await html2canvas(target, {
        backgroundColor: "#f3ede2", // Warm board color background matches surrounding canvas
        scale: 2.2, // Retina detail level multiplier
        useCORS: true,
        logging: false,
      });

      const imgData = canvasElement.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `digital-sketchbook-page-${activePage}.png`;
      link.href = imgData;
      link.click();
    } catch (err) {
      console.error("Failed to capture active page screenshot:", err);
    }
  };

  const hasDrawingsOnCurrentPage = (sketches[activePage] || []).length > 0;

  return (
    <div className="h-screen overflow-hidden bg-[#f3ede2] text-[#2c2a29] flex flex-col justify-between items-stretch relative font-sans selection:bg-amber-100 selection:text-stone-900 pb-4">
      
      {/* Subtle outer backdrop graph paper pattern */}
      <div 
        className="absolute inset-0 opacity-[0.25] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ccc 1px, transparent 1px),
            linear-gradient(to bottom, #ccc 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px"
        }}
      />

      {/* AESTHETIC TOP HEADER */}
      <header className="px-6 py-4 max-w-7xl mx-auto w-full flex justify-between items-center z-30 relative border-b border-stone-300/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#1e1c19] text-[#e7e1d5] flex items-center justify-center font-mono font-black text-sm shadow-md border border-stone-800">
            KN
          </div>
          <div>
            <h1 className="text-sm font-sans font-bold tracking-tight text-stone-800">
              K. NEMES
            </h1>
            <p className="text-[10px] font-mono tracking-wider text-stone-500 uppercase">
              CREATIVE TECHNOLOGIST & DEVSIGNER
            </p>
          </div>
        </div>

        {/* Floating Utility menu */}
        <div className="flex items-center gap-3">
          <button
            id="btn-toggle-help"
            onClick={() => setShowHelp(!showHelp)}
            className="p-2 rounded-lg bg-stone-200/50 hover:bg-stone-200 text-stone-600 transition-colors flex items-center gap-1.5 text-xs font-mono border-none cursor-pointer"
            title="Toggle Notebook Instructions"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">GUIDE: {showHelp ? "ON" : "OFF"}</span>
          </button>

          {Object.keys(sketches).some((k) => (sketches[Number(k)] || []).length > 0) && (
            <button
              id="btn-clear-all-doodles"
              onClick={clearAllNotebookCanvas}
              className="p-2 rounded-lg bg-red-100/60 hover:bg-red-100 text-red-600 transition-colors flex items-center gap-1.5 text-xs font-mono border-none cursor-pointer"
              title="Clear all doodles in the entire book"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Wipe Book</span>
            </button>
          )}
        </div>
      </header>

      {/* INSTRUCTIONS GUIDE DRAWER */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            id="help-drawer"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto w-full px-6 mt-4 z-40 relative"
          >
            <div className="bg-stone-900 text-stone-300 border border-stone-800 rounded-xl p-4 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Interactive Portfolio & Digital Sketchbook Engine
                  </h3>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed max-w-3xl">
                  This portfolio functions as a horizontal digital journal. You can browse case studies, play with native WebGL 3D mockups, edit reactive code properties, and **doodle on any page**! Drawing preserves state independently per page. Toggle sketch mode to draw, and turn it off to navigate.
                </p>
                <div className="flex flex-wrap gap-x-5 gap-y-1.5 pt-1 text-[10px] font-mono text-stone-500">
                  <span>🎮 <strong className="text-stone-300">KEYS:</strong> [D] Toggle Draw | [C] Clear drawings</span>
                  <span>↔️ <strong className="text-stone-300">HORIZONTAL:</strong> Use side arrow buttons or dots at bottom</span>
                </div>
              </div>
              <button
                id="btn-close-help-drawer"
                onClick={() => setShowHelp(false)}
                className="self-start md:self-center p-1.5 rounded-md hover:bg-stone-800 text-stone-400 hover:text-white transition-colors border-none bg-transparent cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CORE SKETCHBOOK CONTAINER VIEWPORT */}
      <main className="flex-1 w-full py-3 flex flex-col justify-center items-stretch relative min-h-0 overflow-hidden">
        
        {/* Floating warning message when user tries to flip pages in drawing mode */}
        <AnimatePresence>
          {isDrawingActive && (
            <motion.div
              id="drawing-lock-warning"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-2 left-1/2 -translate-x-1/2 bg-amber-500/90 text-stone-950 backdrop-blur border border-amber-400 px-4 py-1.5 rounded-full text-xs font-mono font-medium shadow-md z-50 flex items-center gap-1.5 uppercase pointer-events-none"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>FLIP GESTURES LOCK ACTIVE — SKETCH FREELY</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main interactive notebook shell */}
        <div id="notebook-capture-target" className="relative flex-1 flex flex-col justify-center items-stretch min-h-0">
          
          {/* Main Slide Page Window */}
          <div className="relative overflow-hidden flex-1 min-h-0 w-full">
            <motion.div
              animate={{
                x: `calc(-${activePage - 1} * (min(85vw, 1275px) + 240px))`
              }}
              transition={{ type: "spring", stiffness: 150, damping: 24 }}
              className="flex flex-row h-full absolute inset-y-0 left-0"
              style={{
                paddingLeft: "calc(50vw - min(85vw, 1275px) / 2)",
                paddingRight: "calc(50vw - min(85vw, 1275px) / 2)",
                gap: "240px",
              }}
            >
              {Array.from({ length: TOTAL_PAGES }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <div
                    key={pageNum}
                    onClick={() => {
                      if (activePage !== pageNum && !isDrawingActive) {
                        jumpToPage(pageNum);
                      }
                    }}
                    className={`w-[85vw] max-w-[1275px] h-full flex-shrink-0 relative transition-opacity duration-300 ${
                      activePage === pageNum ? "opacity-100" : "opacity-40 hover:opacity-75 cursor-pointer"
                    }`}
                  >
                    {/* PAGE 1: COVER INTRODUCTION */}
                    {pageNum === 1 && (
                      <Page1Intro
                        isDrawingActive={isDrawingActive}
                        setIsDrawingActive={setIsDrawingActive}
                        totalPages={TOTAL_PAGES}
                        sketches={sketches}
                        jumpToPage={jumpToPage}
                        navigatePage={navigatePage}
                      />
                    )}

                    {/* PAGE 2: THREE.JS 3D WORK */}
                    {pageNum === 2 && (
                      <Page2ThreeD
                        isDrawingActive={isDrawingActive}
                        totalPages={TOTAL_PAGES}
                      />
                    )}

                    {/* PAGE 3: BLUEPRINTS / responsive visual blueprint */}
                    {pageNum === 3 && (
                      <Page3Blueprint
                        isDrawingActive={isDrawingActive}
                        totalPages={TOTAL_PAGES}
                      />
                    )}

                    {/* PAGE 4: ENGINEERING CODE Snippet */}
                    {pageNum === 4 && (
                      <Page4Editor
                        isDrawingActive={isDrawingActive}
                        totalPages={TOTAL_PAGES}
                      />
                    )}

                    {/* PAGE 5: KINETIC PARTICLE SANDBOX */}
                    {pageNum === 5 && (
                      <Page5Sandbox
                        isDrawingActive={isDrawingActive}
                        totalPages={TOTAL_PAGES}
                        activePage={activePage}
                      />
                    )}

                    {/* PAGE 6: CONTACT LETTERBOX & ARCHIVES */}
                    {pageNum === 6 && (
                      <Page6Contact
                        isDrawingActive={isDrawingActive}
                        totalPages={TOTAL_PAGES}
                      />
                    )}

                    {/* Persistent page-specific sketch canvas overlay that transitions with this page */}
                    <SketchCanvas
                      isActive={isDrawingActive && activePage === pageNum}
                      lines={sketches[pageNum] || []}
                      onAddLine={handleAddLine}
                      currentColor={currentColor}
                      currentSize={penSize}
                      currentTool={selectedPen}
                    />
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Left Arrow Turn Page Controller */}
          <button
            id="btn-page-prev"
            onClick={() => navigatePage(-1)}
            disabled={activePage === 1 || isDrawingActive}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -ml-3 md:-ml-7 w-10 md:w-12 h-10 md:h-12 flex items-center justify-center border transition-all z-30 rounded-none ${
              activePage === 1
                ? "bg-transparent border-transparent text-transparent pointer-events-none"
                : isDrawingActive
                ? "bg-stone-100/20 border-transparent text-stone-300 cursor-not-allowed"
                : "bg-white hover:bg-[#F4F1EA] border-[#1A1A1A]/15 text-[#1A1A1A] shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
            }`}
            title="Previous Page"
          >
            <ArrowLeft className="w-4 md:h-5 md:w-5 h-4" />
          </button>

          {/* Right Arrow Turn Page Controller */}
          <button
            id="btn-page-next"
            onClick={() => navigatePage(1)}
            disabled={activePage === TOTAL_PAGES || isDrawingActive}
            className={`absolute right-0 top-1/2 -translate-y-1/2 -mr-3 md:-mr-7 w-10 md:w-12 h-10 md:h-12 flex items-center justify-center border transition-all z-30 rounded-none ${
              activePage === TOTAL_PAGES
                ? "bg-transparent border-transparent text-transparent pointer-events-none"
                : isDrawingActive
                ? "bg-stone-100/20 border-transparent text-stone-300 cursor-not-allowed"
                : "bg-white hover:bg-[#F4F1EA] border-[#1A1A1A]/15 text-[#1A1A1A] shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
            }`}
            title="Next Page"
          >
            <ArrowRight className="w-4 md:h-5 md:w-5 h-4" />
          </button>

        </div>

        {/* BOTTOM PAGINATION TIMELINE OF TICKS */}
        <div className="mt-8 max-w-xl mx-auto w-full px-8 z-30 relative">
          <div className="relative h-10 flex items-center justify-between">
            {/* Horizontal timeline track line */}
            <div className="absolute left-0 right-0 h-[1.5px] bg-[#1A1A1A]/10 pointer-events-none" />
            
            {/* Render ticks for each page */}
            {Array.from({ length: TOTAL_PAGES }).map((_, idx) => {
              const pageNum = idx + 1;
              const isCurrent = activePage === pageNum;
              const hasSketch = (sketches[pageNum] || []).length > 0;
              
              // Custom metadata for each tick to display in tooltip
              const pageMeta = [
                { title: "Introduction", category: "INDEX" },
                { title: "3D WebGL Showcase", category: "SHOWCASE" },
                { title: "System Blueprint", category: "PRODUCT" },
                { title: "Interactive Code Editor", category: "LAB" },
                { title: "Kinetic Sandbox", category: "PHYSICS" },
                { title: "Public Review Board", category: "GUESTBOOK" },
              ][idx] || { title: `Page ${pageNum}`, category: "SECTION" };

              return (
                <button
                  id={`btn-timeline-tick-${pageNum}`}
                  key={pageNum}
                  onClick={() => jumpToPage(pageNum)}
                  disabled={isDrawingActive}
                  className={`group relative flex flex-col items-center justify-center h-8 focus:outline-none ${
                    isDrawingActive ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                  title={`Go to Page ${pageNum}`}
                >
                  {/* The visual Tick line */}
                  <div
                    className={`transition-all duration-200 rounded-none ${
                      isCurrent
                        ? "w-[3px] h-6 bg-[#1A1A1A] z-10"
                        : "w-[1.5px] h-3.5 bg-[#1A1A1A]/25 group-hover:h-5 group-hover:bg-[#1A1A1A] group-hover:w-[2px]"
                    }`}
                  />

                  {/* Red dot indicator if doodle is on page */}
                  {hasSketch && (
                    <span 
                      className={`absolute rounded-full bg-red-500 ring-1 ring-white ${
                        isCurrent ? "-top-1 w-2 h-2" : "top-0 w-1.5 h-1.5"
                      }`}
                    />
                  )}

                  {/* Small page number label below the tick */}
                  <span
                    className={`absolute -bottom-4 text-[9px] font-mono transition-colors duration-200 ${
                      isCurrent
                        ? "text-[#1A1A1A] font-bold"
                        : "text-[#1A1A1A]/40 group-hover:text-[#1A1A1A]"
                    }`}
                  >
                    0{pageNum}
                  </span>

                  {/* Elegant floating tooltip card */}
                  <div className="absolute bottom-8 opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-40 bg-[#F4F1EA] border border-[#1A1A1A] p-2.5 shadow-[2px_2px_0px_0px_#1A1A1A] w-48 text-left">
                    <div className="flex justify-between items-center text-[7px] font-mono text-[#1A1A1A]/50 border-b border-[#1A1A1A]/10 pb-1 mb-1.5">
                      <span>SEC. 0{pageNum}</span>
                      <span className="font-bold uppercase text-[#E0825B]">{pageMeta.category}</span>
                    </div>
                    <div className="text-[10px] font-bold font-serif italic text-[#1A1A1A] leading-tight">
                      {pageMeta.title}
                    </div>
                    {hasSketch && (
                      <div className="text-[7.5px] font-mono text-red-600 mt-1 flex items-center gap-1">
                        <span>✏️</span> <span>CONTAINS DOODLES</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </main>

      {/* FLOATING PENCIL TOGGLE & CASCADING DRAWING TOOLBAR */}
      <DrawingToolbar
        isDrawingActive={isDrawingActive}
        onToggleDrawing={() => setIsDrawingActive(!isDrawingActive)}
        selectedPen={selectedPen}
        onSelectPen={setSelectedPen}
        penSize={penSize}
        onSetPenSize={setPenSize}
        currentColor={currentColor}
        onChangeColor={setCurrentColor}
        onClearCanvas={clearCurrentPageCanvas}
        hasDrawings={hasDrawingsOnCurrentPage}
        onScreenshot={handleTakeScreenshot}
      />

    </div>
  );
}
