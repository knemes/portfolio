import { useState, useEffect } from "react";
import { Pen, Eraser, Trash2, Camera, Palette, Check, HelpCircle } from "lucide-react";
import { PenType } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface DrawingToolbarProps {
  isDrawingActive: boolean;
  onToggleDrawing: () => void;
  selectedPen: PenType;
  onSelectPen: (type: PenType) => void;
  penSize: number;
  onSetPenSize: (size: number) => void;
  currentColor: string;
  onChangeColor: (color: string) => void;
  onClearCanvas: () => void;
  hasDrawings: boolean;
  onScreenshot: () => void;
}

// Fixed preset colors for quick drawing
const QUICK_PRESETS = [
  { name: "Charcoal", hex: "#1A1A1A" },
  { name: "Royal", hex: "#1d4ed8" },
  { name: "Crimson", hex: "#be123c" },
  { name: "Olive", hex: "#4d7c0f" },
];

export default function DrawingToolbar({
  isDrawingActive,
  onToggleDrawing,
  selectedPen,
  onSelectPen,
  penSize,
  onSetPenSize,
  currentColor,
  onChangeColor,
  onClearCanvas,
  hasDrawings,
  onScreenshot,
}: DrawingToolbarProps) {
  const [hue, setHue] = useState<number>(180);
  const [showColorSlider, setShowColorSlider] = useState<boolean>(false);

  // Sync custom hue changes to color
  useEffect(() => {
    if (showColorSlider) {
      const customHsl = `hsl(${hue}, 90%, 45%)`;
      onChangeColor(customHsl);
    }
  }, [hue, showColorSlider]);

  // Handle default sizes on tool change
  useEffect(() => {
    if (selectedPen === "pen" && penSize > 6) {
      onSetPenSize(2);
    } else if (selectedPen === "marker" && (penSize < 8 || penSize > 16)) {
      onSetPenSize(12);
    } else if (selectedPen === "chisel" && (penSize < 15 || penSize > 35)) {
      onSetPenSize(25);
    } else if (selectedPen === "eraser" && (penSize < 10 || penSize > 40)) {
      onSetPenSize(20);
    }
  }, [selectedPen]);

  // Size preset options depending on active tool
  const getSizesForTool = () => {
    switch (selectedPen) {
      case "pen":
        return [2, 4, 6];
      case "marker":
        return [8, 12, 16];
      case "chisel":
        return [15, 25, 35];
      case "eraser":
        return [10, 20, 40];
      default:
        return [2, 4, 8];
    }
  };

  return (
    <div 
      className="fixed bottom-5 right-5 z-50 flex flex-col md:flex-row-reverse items-end md:items-center gap-2 pointer-events-auto"
      id="pencil-sketch-toolbar"
    >
      {/* 1. MASTER PENCIL TOGGLE BUTTON (Never moves position) */}
      <button
        id="btn-toggle-sketch-main"
        onClick={onToggleDrawing}
        className={`w-11 h-11 rounded-full flex items-center justify-center border shadow-2xl transition-all cursor-pointer relative ${
          isDrawingActive
            ? "bg-red-600 border-red-600 text-white hover:bg-red-700 scale-105 active:scale-95"
            : "bg-[#1A1A1A] border-[#1A1A1A]/10 text-white hover:bg-stone-800 hover:scale-110 active:scale-95"
        }`}
        title={isDrawingActive ? "Exit sketchmode" : "Enter sketchmode"}
      >
        <Pen className={`w-4.5 h-4.5 transition-transform duration-300 ${isDrawingActive ? "rotate-45" : ""}`} />
        {isDrawingActive && (
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
        )}
      </button>

      {/* 2. CASCADING OPTION TRYS (Revealed when active) */}
      <AnimatePresence>
        {isDrawingActive && (
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="flex flex-col md:flex-row items-stretch md:items-center gap-2 bg-[#1A1A1A] border border-white/10 p-2 shadow-2xl text-white rounded-xl md:rounded-full"
          >
            {/* Tool selectors (Pen, Marker, Chisel, Eraser) */}
            <div className="flex items-center gap-1 bg-white/5 px-1.5 py-0.5 rounded-full border border-white/10">
              <button
                id="btn-tool-pen"
                onClick={() => onSelectPen("pen")}
                className={`px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                  selectedPen === "pen"
                    ? "bg-white text-[#1A1A1A] font-bold"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
                title="Solid Fine Pen"
              >
                Pen
              </button>
              <button
                id="btn-tool-marker"
                onClick={() => onSelectPen("marker")}
                className={`px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                  selectedPen === "marker"
                    ? "bg-white text-[#1A1A1A] font-bold"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
                title="Bold Marker"
              >
                Marker
              </button>
              <button
                id="btn-tool-chisel"
                onClick={() => onSelectPen("chisel")}
                className={`px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                  selectedPen === "chisel"
                    ? "bg-white text-[#1A1A1A] font-bold"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
                title="Chisel Highlighter (Semi-transparent)"
              >
                Chisel
              </button>
              <button
                id="btn-tool-eraser"
                onClick={() => onSelectPen("eraser")}
                className={`p-1 rounded-full transition-all cursor-pointer ${
                  selectedPen === "eraser"
                    ? "bg-white text-[#1A1A1A]"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
                title="Draft Eraser"
              >
                <Eraser className="w-3 h-3" />
              </button>
            </div>

            {/* Custom sizing points */}
            <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full border border-white/10">
              <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest mr-1">Size</span>
              {getSizesForTool().map((size) => (
                <button
                  id={`btn-size-preset-${size}`}
                  key={size}
                  onClick={() => onSetPenSize(size)}
                  className={`w-4 h-4 rounded-full flex items-center justify-center transition-all cursor-pointer text-[8px] font-mono font-bold ${
                    penSize === size
                      ? "bg-white text-[#1A1A1A]"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Color section (Not active for Eraser) */}
            {selectedPen !== "eraser" && (
              <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10 relative">
                {/* Fixed preset swatches */}
                <div className="flex items-center gap-1">
                  {QUICK_PRESETS.map((color) => {
                    const isSel = currentColor === color.hex && !showColorSlider;
                    return (
                      <button
                        id={`btn-preset-color-${color.name}`}
                        key={color.hex}
                        onClick={() => {
                          onChangeColor(color.hex);
                          setShowColorSlider(false);
                        }}
                        className={`w-3 h-3 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                          isSel 
                            ? "ring-1 ring-white scale-110 border-transparent" 
                            : "border-white/10 hover:scale-105"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {isSel && <Check className="w-2 h-2 text-white stroke-[4px]" />}
                      </button>
                    );
                  })}
                </div>

                {/* Vertical Divider */}
                <span className="w-[1px] h-3.5 bg-white/10" />

                {/* Rainbow Color Wheel Button */}
                <button
                  id="btn-rainbow-hue-toggle"
                  onClick={() => setShowColorSlider(!showColorSlider)}
                  className={`w-4.5 h-4.5 rounded-full border transition-all cursor-pointer relative overflow-hidden flex items-center justify-center ${
                    showColorSlider ? "ring-1 ring-white scale-110" : "border-white/15 hover:scale-105"
                  }`}
                  style={{
                    background: "conic-gradient(red, yellow, lime, cyan, blue, magenta, red)",
                  }}
                  title="Custom Rainbow Palette Slide"
                >
                  {showColorSlider && (
                    <div 
                      className="w-2 h-2 rounded-full border border-white shadow-inner"
                      style={{ backgroundColor: `hsl(${hue}, 90%, 45%)` }}
                    />
                  )}
                </button>

                {/* Hue Spectrum Color Slider (Reveals on toggle) */}
                <AnimatePresence>
                  {showColorSlider && (
                    <motion.div
                      initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                      animate={{ opacity: 1, width: 80, marginLeft: 4 }}
                      exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                      className="flex items-center"
                    >
                      <input
                        id="hue-spectrum-range"
                        type="range"
                        min="0"
                        max="360"
                        value={hue}
                        onChange={(e) => setHue(parseInt(e.target.value))}
                        className="w-20 h-1.5 cursor-pointer rounded-lg appearance-none bg-gradient-to-r"
                        style={{
                          background: "linear-gradient(to right, red, #ff0, #0f0, #0ff, #00f, #f0f, red)",
                          WebkitAppearance: "none",
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Clear page and capture actions */}
            <div className="flex items-center gap-1 border-t border-white/5 pt-2 md:pt-0 md:border-t-0 md:pl-1.5 md:border-l md:border-white/15">
              {/* Capture download page screenshot */}
              <button
                id="btn-save-screenshot-active"
                onClick={onScreenshot}
                className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                title="Download PNG screenshot of drawings and active case study page"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>

              {/* Erase doodles on this page */}
              <button
                id="btn-clear-drawings-active"
                onClick={onClearCanvas}
                disabled={!hasDrawings}
                className={`p-1.5 rounded-full transition-colors ${
                  hasDrawings
                    ? "text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                    : "text-white/20 cursor-not-allowed"
                }`}
                title="Wipe doodles on this page"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
