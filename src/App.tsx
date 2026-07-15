import { useState, useEffect, useRef, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  PenTool,
  Lock,
  Unlock,
  Github,
  Linkedin,
  Mail,
  HelpCircle,
  Sparkles,
  MousePointer,
  Trash2,
  FileCode,
  Layers,
  Send,
  Eye,
  Settings,
  X,
  Compass
} from "lucide-react";

import { Point, Line, PenType } from "./types";
import PageContainer from "./components/PageContainer";
import SketchCanvas from "./components/SketchCanvas";
import DrawingToolbar from "./components/DrawingToolbar";
import ThreeCanvas from "./components/ThreeCanvas";
import InteractiveCodeEditor from "./components/InteractiveCodeEditor";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  date: string;
  rating?: number;
}

export default function App() {
  // Page state
  const TOTAL_PAGES = 6;
  const [activePage, setActivePage] = useState<number>(1);
  const [direction, setDirection] = useState<number>(1); // 1 = right, -1 = left

  // Drawing state
  const [isDrawingActive, setIsDrawingActive] = useState<boolean>(false);
  const [selectedPen, setSelectedPen] = useState<PenType>("pen");
  const [penSize, setPenSize] = useState<number>(2);
  const [currentColor, setCurrentColor] = useState<string>("#1A1A1A");
  const [sketches, setSketches] = useState<Record<number, Line[]>>({});

  // Help info state
  const [showHelp, setShowHelp] = useState<boolean>(false);

  // Blueprint simulation state (for Page 3)
  const [blueprintViewport, setBlueprintViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [blueprintTheme, setBlueprintTheme] = useState<"blueprint" | "monochrome">("blueprint");

  // Vortex simulation state (for Page 5)
  const [vortexDensity, setVortexDensity] = useState<number>(150);
  const [vortexSpeed, setVortexSpeed] = useState<number>(1.5);
  const [vortexForce, setVortexForce] = useState<number>(2);

  // Selected Detail Island for Page 3 Blueprint (pop-up information modal)
  const [selectedIsland, setSelectedIsland] = useState<null | {
    title: string;
    subtitle: string;
    description: string;
    specs: { label: string; value: string }[];
    architecturalNotes: string;
  }>(null);

  // Message Form state (for Page 6)
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formSubject, setFormSubject] = useState("");
  const [formBody, setFormBody] = useState("");
  const [formRating, setFormRating] = useState<number>(5);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [messagesList, setMessagesList] = useState<Message[]>([]);

  // Page 5 kinetic canvas ref
  const vortexCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load sketches and contact messages from LocalStorage on mount
  useEffect(() => {
    try {
      const savedSketches = localStorage.getItem("notebook_sketches");
      if (savedSketches) {
        setSketches(JSON.parse(savedSketches));
      }

      const savedMsgs = localStorage.getItem("notebook_messages");
      if (savedMsgs) {
        setMessagesList(JSON.parse(savedMsgs));
      } else {
        // Seed default messages for high fidelity
        const seedMsgs: Message[] = [
          {
            id: "seed-1",
            name: "Alex Rivera",
            email: "alex@designco.io",
            subject: "Exceptional Concept!",
            body: "Your fluid notebook portfolio is incredible! The drawing canvas integration is a stroke of genius. Let's connect next week about our upcoming Interactive WebGL design project.",
            date: "Jul 12, 2026",
            rating: 5,
          },
          {
            id: "seed-2",
            name: "Sarah Jenkins",
            email: "sjenkins@creative-lab.dev",
            subject: "Amazing sketchbook vibe!",
            body: "I love that my doodles are saved per-page. Keep pushing the boundaries of web experiences!",
            date: "Jul 13, 2026",
            rating: 5,
          },
        ];
        setMessagesList(seedMsgs);
        localStorage.setItem("notebook_messages", JSON.stringify(seedMsgs));
      }
    } catch (e) {
      console.error("Error loading local storage data", e);
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
      setDirection(step);
      setActivePage(targetPage);
    }
  };

  const jumpToPage = (pageNum: number) => {
    if (isDrawingActive) return; // Prevent jumping in drawing mode
    if (pageNum === activePage) return;
    setDirection(pageNum > activePage ? 1 : -1);
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
          setDirection(1);
          setActivePage((prev) => Math.min(TOTAL_PAGES, prev + 1));
          lastScrollTimeRef.current = now;
        }
      } else {
        if (activePage > 1) {
          setDirection(-1);
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

  // Form submission handler (local mock)
  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formBody) return;

    const newMsg: Message = {
      id: Math.random().toString(36).substring(2, 9),
      name: formName,
      email: formEmail,
      subject: formSubject || "Excellent Portfolio",
      body: formBody,
      rating: formRating,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };

    const updated = [newMsg, ...messagesList];
    setMessagesList(updated);
    localStorage.setItem("notebook_messages", JSON.stringify(updated));

    setFormSubmitted(true);
    // Reset form fields
    setFormName("");
    setFormEmail("");
    setFormSubject("");
    setFormBody("");
    setFormRating(5);

    // Automatically dismiss the success state after 4 seconds
    setTimeout(() => {
      setFormSubmitted(false);
    }, 4000);
  };

  const deleteMessage = (id: string) => {
    const updated = messagesList.filter((m) => m.id !== id);
    setMessagesList(updated);
    localStorage.setItem("notebook_messages", JSON.stringify(updated));
  };

  const hasDrawingsOnCurrentPage = (sketches[activePage] || []).length > 0;

  // Horizontal motion variants for beautiful transition sliding
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 150, damping: 24 },
        opacity: { duration: 0.45 }
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 150, damping: 24 },
        opacity: { duration: 0.4 }
      },
    }),
  };

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
            className="p-2 rounded-lg bg-stone-200/50 hover:bg-stone-200 text-stone-600 transition-colors flex items-center gap-1.5 text-xs font-mono"
            title="Toggle Notebook Instructions"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">GUIDE: {showHelp ? "ON" : "OFF"}</span>
          </button>

          {Object.keys(sketches).some((k) => (sketches[Number(k)] || []).length > 0) && (
            <button
              id="btn-clear-all-doodles"
              onClick={clearAllNotebookCanvas}
              className="p-2 rounded-lg bg-red-100/60 hover:bg-red-100 text-red-600 transition-colors flex items-center gap-1.5 text-xs font-mono"
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
                className="self-start md:self-center p-1.5 rounded-md hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CORE SKETCHBOOK CONTAINER VIEWPORT */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-3 flex flex-col justify-center items-stretch relative min-h-0 overflow-hidden">
        
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
          <div className="relative overflow-hidden flex-1 min-h-0">
            <AnimatePresence initial={false} custom={direction}>
              {[activePage].map((pageNum) => (
                <motion.div
                  key={pageNum}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full absolute inset-y-0"
                >
                  {/* PAGE 1: COVER INTRODUCTION */}
                  {pageNum === 1 && (
                  <PageContainer
                    pageNumber={1}
                    totalPages={TOTAL_PAGES}
                    title="Introduction / Cover Page"
                    category="INDEX"
                    drawingActive={isDrawingActive}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center max-w-4xl mx-auto py-4">
                      
                      {/* Left: Vintage Notebook Title */}
                      <div className="md:col-span-7 space-y-6 text-left">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#1A1A1A] text-white">
                          <Compass className="w-3.5 h-3.5 text-white/80" />
                          <span className="text-[9px] font-mono uppercase tracking-[0.2em]">
                            v1.0.0 — Offline-First Sketchbook
                          </span>
                        </div>

                        <div className="space-y-2">
                          <h2 className="text-4xl md:text-6xl font-serif italic text-[#1A1A1A] leading-[0.9] tracking-tight">
                            Fluid Digital
                            <span className="block text-[#1A1A1A]/60 font-sans uppercase font-bold tracking-[0.15em] pt-2 text-xs md:text-sm">
                              Notebook & Sketchbook
                            </span>
                          </h2>
                          <div className="h-[1px] w-24 bg-[#1A1A1A]/20 mt-3" />
                        </div>

                        <p className="text-sm text-[#1A1A1A]/80 leading-relaxed max-w-md font-serif italic">
                          Welcome to a streamlined, professional portfolio framework reimagined as a responsive digital journal. It seamlessly couples high-performance drawing structures with interactive full-stack case studies.
                        </p>

                        <div className="space-y-2.5">
                          <h4 className="text-[10px] font-mono font-bold tracking-wider text-[#1A1A1A]/40 uppercase">
                            Available Notebook Sections:
                          </h4>
                          <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#1A1A1A]/80">
                            <button onClick={() => jumpToPage(2)} className="flex items-center gap-1.5 hover:opacity-60 text-left cursor-pointer">
                              <span className="font-serif italic font-bold">01.</span> Three.js 3D Showcase
                            </button>
                            <button onClick={() => jumpToPage(3)} className="flex items-center gap-1.5 hover:opacity-60 text-left cursor-pointer">
                              <span className="font-serif italic font-bold">02.</span> System Blueprint UI
                            </button>
                            <button onClick={() => jumpToPage(4)} className="flex items-center gap-1.5 hover:opacity-60 text-left cursor-pointer">
                              <span className="font-serif italic font-bold">03.</span> Interactive Code Snippets
                            </button>
                            <button onClick={() => jumpToPage(5)} className="flex items-center gap-1.5 hover:opacity-60 text-left cursor-pointer">
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
                          {/* Grid alignment mark */}
                          <div className="absolute top-0 right-0 w-8 h-8 border-b border-l border-[#1A1A1A]/10 pointer-events-none" />
                          
                          <div className="space-y-4">
                            <span className="text-[10px] font-mono uppercase bg-[#1A1A1A] text-white px-2 py-1">
                              Designer & Coder
                            </span>
                            <h3 className="text-xl font-serif italic text-[#1A1A1A] leading-relaxed tracking-tight">
                              Crafting immersive digital realities with clean code & responsive geometry.
                            </h3>
                          </div>

                          <div className="space-y-3 pt-8">
                            <div className="flex justify-between items-center text-[10px] font-mono text-[#1A1A1A]/40 border-b border-[#1A1A1A]/10 pb-1.5">
                              <span>STUDIO LOCATION:</span>
                              <span className="text-[#1A1A1A] font-semibold">CA, USA</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-mono text-[#1A1A1A]/40 border-b border-[#1A1A1A]/10 pb-1.5">
                              <span>SPECIALTIES:</span>
                              <span className="text-[#1A1A1A] font-semibold">WebGL, React, Node</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-mono text-[#1A1A1A]/40 border-b border-[#1A1A1A]/10 pb-1.5">
                              <span>DRAWINGS STORED:</span>
                              <span className="text-[#1A1A1A] font-bold">
                                {Object.values(sketches).flat().length} LINES
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </PageContainer>
                )}

                {/* PAGE 2: THREE.JS 3D WORK */}
                {pageNum === 2 && (
                  <PageContainer
                    pageNumber={2}
                    totalPages={TOTAL_PAGES}
                    title="01. Interactive 3D WebGL Work"
                    category="DESIGN"
                    drawingActive={isDrawingActive}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
                      
                      {/* Left: Text & Pitch */}
                      <div className="lg:col-span-5 flex flex-col justify-between py-1 text-left space-y-4">
                        <div className="space-y-3">
                          <span className="text-[10px] font-mono bg-[#1A1A1A] text-white px-2 py-1 uppercase tracking-widest">
                            Interactive Math
                          </span>
                          <h3 className="text-2xl md:text-3xl font-serif italic text-[#1A1A1A] leading-tight">
                            Tactile 3D Wireframes
                          </h3>
                          <p className="text-sm text-[#1A1A1A]/80 leading-relaxed font-serif italic">
                            I leverage 3D mathematical meshes to construct high-performance spatial mockups directly in web browsers. By binding canvas mouse interactions, users are invited to inspect meshes dynamically.
                          </p>
                        </div>

                        <div className="bg-[#EAE7DF] border border-[#1A1A1A]/10 p-4 rounded-none space-y-2 font-mono text-[11px] text-[#1A1A1A]">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#1A1A1A] uppercase tracking-wider">
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
                      <div className="lg:col-span-7">
                        <ThreeCanvas />
                      </div>

                    </div>
                  </PageContainer>
                )}

                {/* PAGE 3: BLUEPRINTS / responsive visual blueprint */}
                {pageNum === 3 && (
                  <PageContainer
                    pageNumber={3}
                    totalPages={TOTAL_PAGES}
                    title="02. Product Blueprint Wireframing"
                    category="PRODUCT"
                    drawingActive={isDrawingActive}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch max-w-5xl mx-auto">
                      
                      {/* Left: Blueprint controls & Description */}
                      <div className="lg:col-span-4 flex flex-col justify-between py-1 text-left space-y-4">
                        <div className="space-y-3">
                          <span className="text-[10px] font-mono bg-[#1A1A1A] text-white px-2 py-1 uppercase tracking-widest">
                            Wireframe Grid
                          </span>
                          <h3 className="text-xl md:text-2xl font-serif italic text-[#1A1A1A] leading-tight">
                            Responsive Blueprints
                          </h3>
                          <p className="text-sm text-[#1A1A1A]/80 leading-relaxed font-serif italic">
                            Before writing code, product design requires rigorous structural drafting. This mock viewport allows toggling between mobile, tablet, and desktop aspect ratios to preview responsive wireframe scaling.
                          </p>
                        </div>

                        {/* Interactive UI to change the grid layout */}
                        <div className="space-y-4 pt-2 border-t border-[#1A1A1A]/10">
                          <div className="space-y-2">
                            <span className="text-[10px] font-mono text-[#1A1A1A]/40 uppercase tracking-widest block">
                              Select Target Viewport
                            </span>
                            <div className="grid grid-cols-3 gap-1.5">
                              {(["desktop", "tablet", "mobile"] as const).map((v) => (
                                <button
                                  id={`btn-viewport-${v}`}
                                  key={v}
                                  onClick={() => setBlueprintViewport(v)}
                                  className={`text-[10px] font-mono px-2 py-1.5 border capitalize transition-all rounded-none cursor-pointer ${
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

                          <div className="space-y-2">
                            <span className="text-[10px] font-mono text-[#1A1A1A]/40 uppercase tracking-widest block">
                              Aesthetic Scheme
                            </span>
                            <div className="flex gap-2">
                              <button
                                id="btn-theme-blueprint"
                                onClick={() => setBlueprintTheme("blueprint")}
                                className={`flex-1 text-[10px] font-mono px-3 py-1.5 border transition-all rounded-none cursor-pointer ${
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
                                className={`flex-1 text-[10px] font-mono px-3 py-1.5 border transition-all rounded-none cursor-pointer ${
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

                        <div className="text-[10px] font-mono text-[#1A1A1A]/40 uppercase tracking-widest leading-relaxed">
                          🖊️ Draping sketches on top mimics drawing corrections on paper architectural rolls!
                        </div>
                      </div>

                      {/* Right: Dynamic scaling wireframe previewer */}
                      <div className="lg:col-span-8 flex items-center justify-center bg-[#EAE7DF] rounded-none border border-[#1A1A1A]/10 p-4 min-h-[360px] relative overflow-hidden">
                        
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
                          className={`h-[340px] rounded-none shadow-md border p-4 flex flex-col justify-between transition-colors duration-300 ${
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
                )}

                {/* PAGE 4: ENGINEERING CODE Snippet */}
                {pageNum === 4 && (
                  <PageContainer
                    pageNumber={4}
                    totalPages={TOTAL_PAGES}
                    title="03. Reactive Code Sandbox"
                    category="ENGINEERING"
                    drawingActive={isDrawingActive}
                  >
                    <InteractiveCodeEditor />
                  </PageContainer>
                )}

                {/* PAGE 5: KINETIC PARTICLE SANDBOX */}
                {pageNum === 5 && (
                  <PageContainer
                    pageNumber={5}
                    totalPages={TOTAL_PAGES}
                    title="04. Kinetic Physics Sandbox"
                    category="SANDBOX"
                    drawingActive={isDrawingActive}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
                      
                      {/* Left: Interactive Particle canvas screen */}
                      <div className="lg:col-span-7 flex flex-col h-full justify-between gap-4">
                        <div className="flex-1 w-full bg-[#EAE7DF] border border-[#1A1A1A]/10 overflow-hidden relative min-h-[280px]">
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
                          <p className="text-sm text-[#1A1A1A]/80 leading-relaxed font-serif italic">
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
                )}

                {/* PAGE 6: CONTACT LETTERBOX & ARCHIVES */}
                {pageNum === 6 && (
                  <PageContainer
                    pageNumber={6}
                    totalPages={TOTAL_PAGES}
                    title="05. Public Review Board & Comments"
                    category="GUESTBOOK"
                    drawingActive={isDrawingActive}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
                      
                      {/* Left: Contact Form Letterbox (6 cols) */}
                      <div className="lg:col-span-6 space-y-4 text-left">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono bg-[#1A1A1A] text-white px-2 py-1 uppercase tracking-widest">
                            Public Review Board
                          </span>
                          <h3 className="text-xl font-serif italic text-[#1A1A1A] leading-tight">
                            Leave a Review
                          </h3>
                        </div>

                        <form onSubmit={handleFormSubmit} className="space-y-3 bg-white p-5 border border-[#1A1A1A]/15 rounded-none shadow-sm relative">
                          
                          {formSubmitted && (
                            <div className="absolute inset-0 bg-[#F4F1EA]/95 backdrop-blur rounded-none flex flex-col items-center justify-center text-center p-6 z-20">
                              <div className="w-12 h-12 rounded-none bg-stone-100 text-[#1A1A1A] flex items-center justify-center mb-3 border border-[#1A1A1A]/10">
                                <Send className="w-5 h-5 animate-bounce" />
                              </div>
                              <h4 className="text-sm font-serif italic font-bold text-[#1A1A1A]">
                                REVIEW PUBLISHED!
                              </h4>
                              <p className="text-xs text-[#1A1A1A]/60 max-w-xs mt-1 leading-relaxed font-serif italic">
                                Thank you! Your comments and star rating have been appended to our public feedback board on the right.
                              </p>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label htmlFor="form-name" className="text-[9px] font-mono font-bold text-[#1A1A1A]/40 uppercase block">Name</label>
                              <input
                                id="form-name"
                                type="text"
                                placeholder="Your Name"
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                                required
                                className="w-full text-xs font-mono px-3 py-2 border border-[#1A1A1A]/15 rounded-none focus:outline-none focus:border-[#1A1A1A] bg-white/60"
                              />
                            </div>
                            <div className="space-y-1">
                              <label htmlFor="form-email" className="text-[9px] font-mono font-bold text-[#1A1A1A]/40 uppercase block">Email</label>
                              <input
                                id="form-email"
                                type="email"
                                placeholder="name@email.com"
                                value={formEmail}
                                onChange={(e) => setFormEmail(e.target.value)}
                                required
                                className="w-full text-xs font-mono px-3 py-2 border border-[#1A1A1A]/15 rounded-none focus:outline-none focus:border-[#1A1A1A] bg-white/60"
                              />
                            </div>
                          </div>

                          {/* Dynamic Asterisk Rating Selection */}
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono font-bold text-[#1A1A1A]/40 uppercase block">Rating</label>
                            <div className="flex gap-2 items-center my-1 bg-[#F4F1EA]/50 p-1 px-2 border border-[#1A1A1A]/5">
                              {[1, 2, 3, 4, 5].map((starVal) => (
                                <button
                                  id={`btn-form-star-${starVal}`}
                                  type="button"
                                  key={starVal}
                                  onClick={() => setFormRating(starVal)}
                                  className="p-1 focus:outline-none transition-all hover:scale-110 cursor-pointer"
                                >
                                  <span className={`text-xl font-mono leading-none transition-all ${
                                    starVal <= formRating 
                                      ? "font-black text-[#1A1A1A] opacity-100" 
                                      : "font-normal text-[#1A1A1A]/20"
                                  }`}>
                                    *
                                  </span>
                                </button>
                              ))}
                              <span className="text-[10px] font-mono text-[#1A1A1A]/60 ml-2">
                                {formRating} / 5 Score
                              </span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label htmlFor="form-subject" className="text-[9px] font-mono font-bold text-[#1A1A1A]/40 uppercase block">Review Headline</label>
                            <input
                              id="form-subject"
                              type="text"
                              placeholder="e.g., Brilliant design, super clean system!"
                              value={formSubject}
                              onChange={(e) => setFormSubject(e.target.value)}
                              className="w-full text-xs font-mono px-3 py-2 border border-[#1A1A1A]/15 rounded-none focus:outline-none focus:border-[#1A1A1A] bg-white/60"
                            />
                          </div>

                          <div className="space-y-1">
                            <label htmlFor="form-body" className="text-[9px] font-mono font-bold text-[#1A1A1A]/40 uppercase block">Review Comment</label>
                            <textarea
                              id="form-body"
                              rows={3}
                              placeholder="Write your review, comments, or doodles feedback here..."
                              value={formBody}
                              onChange={(e) => setFormBody(e.target.value)}
                              required
                              className="w-full text-xs font-mono px-3 py-2 border border-[#1A1A1A]/15 rounded-none focus:outline-none focus:border-[#1A1A1A] bg-white/60 resize-none"
                            />
                          </div>

                          <button
                            id="btn-submit-contact"
                            type="submit"
                            className="w-full py-2.5 bg-[#1A1A1A] hover:bg-[#2c2a29] text-white rounded-none text-xs font-mono font-semibold tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>POST TO COMMENT BOARD</span>
                          </button>
                        </form>
                      </div>

                      {/* Right: Public Message Feed Board (6 cols) */}
                      <div className="lg:col-span-6 space-y-4 text-left">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono bg-[#1A1A1A] text-white px-2 py-1 uppercase tracking-widest">
                            Live Review Feed
                          </span>
                          <h3 className="text-xl font-serif italic text-[#1A1A1A] leading-tight">
                            Public Feedback Wall
                          </h3>
                        </div>

                        <div className="border border-[#1A1A1A]/15 bg-white rounded-none shadow-sm p-4 h-[300px] overflow-y-auto space-y-3 relative">
                          
                          {messagesList.length === 0 ? (
                            <div className="h-full flex flex-col justify-center items-center text-center text-[#1A1A1A]/40 font-mono text-xs p-6 space-y-2">
                              <Mail className="w-8 h-8 text-[#1A1A1A]/20" />
                              <span>No public reviews received yet. Use the left form to post your review!</span>
                            </div>
                          ) : (
                            <div className="space-y-2.5">
                              {messagesList.map((m) => (
                                <div
                                  key={m.id}
                                  className="p-3 border border-[#1A1A1A]/10 rounded-none bg-[#F4F1EA]/50 hover:bg-[#F4F1EA] transition-colors text-left text-xs space-y-1.5 relative group"
                                >
                                  <button
                                    id={`btn-delete-msg-${m.id}`}
                                    onClick={() => deleteMessage(m.id)}
                                    className="absolute top-2 right-2 p-1 rounded-none hover:bg-red-50 text-[#1A1A1A]/30 hover:text-red-600 transition-colors cursor-pointer"
                                    title="Delete review"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>

                                  <div className="flex justify-between items-center pr-6">
                                    <span className="font-mono font-bold text-[#1A1A1A]">{m.name}</span>
                                    <span className="text-[9px] font-mono text-[#1A1A1A]/40">{m.date}</span>
                                  </div>

                                  {/* Asterisk Rating display */}
                                  <div className="flex gap-1 py-0.5">
                                    {[1, 2, 3, 4, 5].map((starVal) => (
                                      <span
                                        key={starVal}
                                        className={`text-sm font-mono leading-none ${
                                          starVal <= (m.rating || 5)
                                            ? "font-black text-[#1A1A1A] opacity-100"
                                            : "font-normal text-[#1A1A1A]/20"
                                        }`}
                                      >
                                        *
                                      </span>
                                    ))}
                                  </div>

                                  <div className="text-[9px] font-mono text-[#1A1A1A]/50">
                                    Review: <span className="text-[#1A1A1A]/70 font-bold">{m.subject}</span>
                                  </div>

                                  <p className="text-[#1A1A1A]/80 leading-relaxed pr-2 font-serif italic">
                                    "{m.body}"
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}

                        </div>

                        <div className="flex justify-center gap-4 text-xs font-mono text-[#1A1A1A]/50 pt-1">
                          <a
                            id="link-github"
                            href="https://github.com/knemes/portfolio"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 hover:text-[#1A1A1A] transition-colors"
                          >
                            <Github className="w-4 h-4" />
                            <span>GITHUB</span>
                          </a>
                          <span>•</span>
                          <a
                            id="link-linkedin"
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 hover:text-[#1A1A1A] transition-colors"
                          >
                            <Linkedin className="w-4 h-4" />
                            <span>LINKEDIN</span>
                          </a>
                          <span>•</span>
                          <a
                            id="link-email"
                            href="mailto:kknemes@gmail.com"
                            className="flex items-center gap-1.5 hover:text-[#1A1A1A] transition-colors"
                          >
                            <Mail className="w-4 h-4" />
                            <span>EMAIL</span>
                          </a>
                        </div>
                      </div>

                    </div>
                  </PageContainer>
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
              </motion.div>
            ))}
          </AnimatePresence>
          </div>

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
                    <p className="text-xs text-[#1A1A1A]/80 leading-relaxed font-serif italic">
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
                      className="w-full py-2 bg-[#1A1A1A] hover:bg-[#2c2a29] text-white text-xs font-mono font-semibold tracking-wider transition-all cursor-pointer"
                    >
                      DISMISS EXPLORER
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>



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
