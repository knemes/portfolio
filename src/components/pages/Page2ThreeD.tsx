import { useState, useEffect, useMemo } from "react";
import { Download, Sliders, Layers, Eye, Compass, Activity, RotateCcw } from "lucide-react";
import PageContainer from "../PageContainer";
import BoatModelerCanvas from "../BoatModelerCanvas";
import { loadRhino } from "../../kayakGeometry/RhinoLoader";
import { KayakBuilder } from "../../kayakGeometry/KayakBuilder";
import type { KayakParameters } from "../../kayakGeometry/types";

interface Page2ThreeDProps {
  isDrawingActive: boolean;
  totalPages: number;
}

const DEFAULT_PARAMS: KayakParameters = {
  length: 14,
  beam: 28,
  hullHeight: 8.0,
  totalHeight: 12.0,
  beamPlacement: 0.52,
  bowLength: 18,
  sternLength: 12,
  bowWidthFactor: 0.42,
  sternWidthFactor: 0.65,

  hullHorizontalCurvature: 0.35,
  hullVerticalCurvature: 0.48,
  deckVerticalCurvature: 0.45,
  deckLongitudinalPeak: 0.5536,
  facetOffsetForward: 24,

  cockpitLength: 34,
  cockpitWidth: 1.0,
  cockpitStart: 59,
  cockpitAftShape: 0.0,
  ribSpacing: 12,
  plywoodThickness: 0.75,
  coamingHeight: 0.75,
};

export default function Page2ThreeD({ isDrawingActive, totalPages }: Page2ThreeDProps) {
  // Rhino3dm WebAssembly instance state
  const [rhino, setRhino] = useState<any>(null);
  const [loadingRhino, setLoadingRhino] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Modeler parameters
  const [params, setParams] = useState<KayakParameters>(DEFAULT_PARAMS);

  // Viewport camera and layer display states
  const [viewMode, setViewMode] = useState<"perspective" | "plan" | "side">("perspective");
  const [showPhysics, setShowPhysics] = useState<boolean>(true);
  const [showRibs, setShowRibs] = useState<boolean>(true);

  // Tab selector for controls
  const [activeTab, setActiveTab] = useState<"envelope" | "curvature" | "cockpit">("envelope");

  // Hydrostatic weights
  const [cargoWeight] = useState<number>(180); // paddler weight in lbs
  const [hullWeight] = useState<number>(45);    // kayak weight in lbs

  // Initialize Rhino WASM on mount
  useEffect(() => {
    let isMounted = true;
    loadRhino()
      .then((rhinoInstance) => {
        if (isMounted) {
          setRhino(rhinoInstance);
          setLoadingRhino(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error(err);
          setLoadError("Could not initialize the Rhino WebAssembly CAD engine.");
          setLoadingRhino(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Instantiate KayakBuilder dynamically
  const builder = useMemo(() => {
    if (!rhino) return null;
    try {
      return new KayakBuilder(rhino, params);
    } catch (err) {
      console.error("Error constructing KayakBuilder:", err);
      return null;
    }
  }, [rhino, params]);

  // Compute Hydrostatics dynamically
  const hydrostatics = useMemo(() => {
    if (!builder) {
      return {
        displacementLbs: 225,
        draft: 4.8,
        gm: 2.8,
        wettedSurfaceArea: 1850,
        vcb: 2.1,
        lcb: 84,
        stabilityStatus: "Tier 3: Coastal Touring / Balanced",
      };
    }
    try {
      return builder.calculateHydrostatics(cargoWeight, hullWeight);
    } catch (e) {
      return {
        displacementLbs: 225,
        draft: 4.8,
        gm: 2.8,
        wettedSurfaceArea: 1850,
        vcb: 2.1,
        lcb: 84,
        stabilityStatus: "Tier 3: Coastal Touring / Balanced",
      };
    }
  }, [builder, cargoWeight, hullWeight]);

  // Handle parameter adjustment with geometric constraints
  const handleParamChange = (key: keyof KayakParameters, value: number) => {
    setParams((prev) => {
      const next = { ...prev, [key]: value };

      if (key === "length") {
        const newLength = Math.max(10, Math.min(20, value));
        const scaleRatio = newLength / (prev.length || 14);
        next.length = newLength;
        next.facetOffsetForward =
          Math.round(((prev.facetOffsetForward ?? 24 * (prev.length / 14)) * scaleRatio) * 10) / 10;
        next.bowLength = Math.max(8, Math.round(prev.bowLength * scaleRatio));
        next.sternLength = Math.max(6, Math.round(prev.sternLength * scaleRatio));
        const minCpL = Math.max(20, Math.round(24 * (newLength / 14)));
        next.cockpitLength = Math.max(minCpL, Math.round(prev.cockpitLength * scaleRatio));
        next.cockpitStart = Math.max(Math.round(next.sternLength), Math.round(prev.cockpitStart * scaleRatio));
      }

      if (key === "beam") {
        next.beam = Math.max(18, Math.min(36, value));
      }

      if (key === "hullHeight") {
        next.hullHeight = Math.max(6, Math.min(12, value));
      }

      return next;
    });
  };

  // Export 3D model as native Rhino .3dm file
  const handleDownload3DM = () => {
    if (!builder) return;
    try {
      const bytes = builder.export3dm();
      const blob = new Blob([bytes as any], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Bespoke-Kayak-${params.length.toFixed(1)}ft.3dm`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export .3dm file:", err);
      alert("Error generating Rhino .3dm file.");
    }
  };

  // Export 2D template SVG
  const handleDownloadSVG = () => {
    if (!builder) return;
    try {
      const stations = builder.generateStations(hydrostatics.draft);
      const midStation = stations[Math.floor(stations.length / 2)] || stations[0];
      if (!midStation) return;
      const svg = midStation.generateSVG(params);
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Station-${(midStation.x / 12).toFixed(1)}ft.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export SVG station:", err);
    }
  };

  return (
    <PageContainer
      pageNumber={2}
      totalPages={totalPages}
      title="01. Parametric Boat Modeler"
      category="COMPUTATIONAL CAD"
      drawingActive={isDrawingActive}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch max-w-7xl mx-auto h-full">
        
        {/* Left Column: Model Parameters & Hydrostatic Readouts */}
        <div className="lg:col-span-5 flex flex-col justify-between py-1 text-left space-y-3.5 overflow-y-auto max-h-[calc(100vh-230px)] pr-1">
          
          {/* Header & Overview */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono bg-[#1A1A1A] text-white px-2 py-0.5 uppercase tracking-widest inline-block">
                NURBS Kernel
              </span>
              <span className="text-[9px] font-mono text-[#1A1A1A]/50 uppercase tracking-wider">
                Bespoke Boat Architecture
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-serif italic text-[#1A1A1A] leading-tight">
              Bespoke Hull Modeler
            </h3>
            <p className="text-xs text-[#1A1A1A]/75 leading-relaxed font-serif italic">
              A real-time parametric boat generator running Rhino3D WebAssembly in the browser. Adjust hull envelope proportions, curvature polynomials, and structural ribs with instantaneous 3D geometry tessellation.
            </p>
          </div>

          {/* Parameter Configuration Tabs */}
          <div className="bg-[#EAE7DF]/70 border border-[#1A1A1A]/10 p-3 space-y-3 font-mono text-[11px] text-[#1A1A1A]">
            
            {/* Tab navigation */}
            <div className="flex border-b border-[#1A1A1A]/10 pb-2 justify-between items-center">
              <div className="flex gap-1.5">
                <button
                  id="tab-btn-envelope"
                  onClick={() => setActiveTab("envelope")}
                  className={`text-[9px] font-mono px-2 py-1 border transition-all cursor-pointer ${
                    activeTab === "envelope"
                      ? "bg-[#1A1A1A] text-white border-[#1A1A1A] font-bold"
                      : "bg-white/60 text-[#1A1A1A]/60 border-transparent hover:bg-white"
                  }`}
                >
                  Dimensions
                </button>
                <button
                  id="tab-btn-curvature"
                  onClick={() => setActiveTab("curvature")}
                  className={`text-[9px] font-mono px-2 py-1 border transition-all cursor-pointer ${
                    activeTab === "curvature"
                      ? "bg-[#1A1A1A] text-white border-[#1A1A1A] font-bold"
                      : "bg-white/60 text-[#1A1A1A]/60 border-transparent hover:bg-white"
                  }`}
                >
                  Curvature
                </button>
                <button
                  id="tab-btn-cockpit"
                  onClick={() => setActiveTab("cockpit")}
                  className={`text-[9px] font-mono px-2 py-1 border transition-all cursor-pointer ${
                    activeTab === "cockpit"
                      ? "bg-[#1A1A1A] text-white border-[#1A1A1A] font-bold"
                      : "bg-white/60 text-[#1A1A1A]/60 border-transparent hover:bg-white"
                  }`}
                >
                  Cockpit
                </button>
              </div>

              <button
                onClick={() => setParams(DEFAULT_PARAMS)}
                className="text-[9px] font-mono text-[#1A1A1A]/50 hover:text-[#1A1A1A] flex items-center gap-1 cursor-pointer bg-transparent border-none p-0"
                title="Reset to default geometry"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* TAB 1: Hull Dimensions */}
            {activeTab === "envelope" && (
              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-[9px] font-mono text-[#1A1A1A]/70 mb-0.5">
                    <span>OVERALL_LENGTH:</span>
                    <span className="font-bold text-[#1A1A1A]">{params.length.toFixed(1)} ft</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="20"
                    step="0.5"
                    value={params.length}
                    onChange={(e) => handleParamChange("length", parseFloat(e.target.value))}
                    className="w-full accent-[#1A1A1A] cursor-pointer h-1.5 bg-[#1A1A1A]/15"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[9px] font-mono text-[#1A1A1A]/70 mb-0.5">
                    <span>BEAM_WIDTH:</span>
                    <span className="font-bold text-[#1A1A1A]">{params.beam.toFixed(1)} in</span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="36"
                    step="0.5"
                    value={params.beam}
                    onChange={(e) => handleParamChange("beam", parseFloat(e.target.value))}
                    className="w-full accent-[#1A1A1A] cursor-pointer h-1.5 bg-[#1A1A1A]/15"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[9px] font-mono text-[#1A1A1A]/70 mb-0.5">
                    <span>HULL_DEPTH:</span>
                    <span className="font-bold text-[#1A1A1A]">{params.hullHeight.toFixed(1)} in</span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="12"
                    step="0.2"
                    value={params.hullHeight}
                    onChange={(e) => handleParamChange("hullHeight", parseFloat(e.target.value))}
                    className="w-full accent-[#1A1A1A] cursor-pointer h-1.5 bg-[#1A1A1A]/15"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[9px] font-mono text-[#1A1A1A]/70 mb-0.5">
                    <span>BEAM_PLACEMENT:</span>
                    <span className="font-bold text-[#1A1A1A]">{(params.beamPlacement * 100).toFixed(0)}% L</span>
                  </div>
                  <input
                    type="range"
                    min="0.35"
                    max="0.65"
                    step="0.01"
                    value={params.beamPlacement}
                    onChange={(e) => handleParamChange("beamPlacement", parseFloat(e.target.value))}
                    className="w-full accent-[#1A1A1A] cursor-pointer h-1.5 bg-[#1A1A1A]/15"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: Curvature */}
            {activeTab === "curvature" && (
              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-[9px] font-mono text-[#1A1A1A]/70 mb-0.5">
                    <span>HULL_WATERPLANE_FLAIR:</span>
                    <span className="font-bold text-[#1A1A1A]">{params.hullHorizontalCurvature.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="0.8"
                    step="0.02"
                    value={params.hullHorizontalCurvature}
                    onChange={(e) => handleParamChange("hullHorizontalCurvature", parseFloat(e.target.value))}
                    className="w-full accent-[#1A1A1A] cursor-pointer h-1.5 bg-[#1A1A1A]/15"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[9px] font-mono text-[#1A1A1A]/70 mb-0.5">
                    <span>DECK_CROWN_ARCH:</span>
                    <span className="font-bold text-[#1A1A1A]">{params.deckVerticalCurvature.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="0.8"
                    step="0.02"
                    value={params.deckVerticalCurvature}
                    onChange={(e) => handleParamChange("deckVerticalCurvature", parseFloat(e.target.value))}
                    className="w-full accent-[#1A1A1A] cursor-pointer h-1.5 bg-[#1A1A1A]/15"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[9px] font-mono text-[#1A1A1A]/70 mb-0.5">
                    <span>BOW_STEM_LENGTH:</span>
                    <span className="font-bold text-[#1A1A1A]">{params.bowLength.toFixed(0)} in</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="28"
                    step="1"
                    value={params.bowLength}
                    onChange={(e) => handleParamChange("bowLength", parseFloat(e.target.value))}
                    className="w-full accent-[#1A1A1A] cursor-pointer h-1.5 bg-[#1A1A1A]/15"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[9px] font-mono text-[#1A1A1A]/70 mb-0.5">
                    <span>STERN_STEM_LENGTH:</span>
                    <span className="font-bold text-[#1A1A1A]">{params.sternLength.toFixed(0)} in</span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="24"
                    step="1"
                    value={params.sternLength}
                    onChange={(e) => handleParamChange("sternLength", parseFloat(e.target.value))}
                    className="w-full accent-[#1A1A1A] cursor-pointer h-1.5 bg-[#1A1A1A]/15"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: Cockpit */}
            {activeTab === "cockpit" && (
              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-[9px] font-mono text-[#1A1A1A]/70 mb-0.5">
                    <span>COCKPIT_LENGTH:</span>
                    <span className="font-bold text-[#1A1A1A]">{params.cockpitLength.toFixed(0)} in</span>
                  </div>
                  <input
                    type="range"
                    min="24"
                    max="44"
                    step="1"
                    value={params.cockpitLength}
                    onChange={(e) => handleParamChange("cockpitLength", parseFloat(e.target.value))}
                    className="w-full accent-[#1A1A1A] cursor-pointer h-1.5 bg-[#1A1A1A]/15"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[9px] font-mono text-[#1A1A1A]/70 mb-0.5">
                    <span>COCKPIT_START_OFFSET:</span>
                    <span className="font-bold text-[#1A1A1A]">{params.cockpitStart.toFixed(0)} in</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="90"
                    step="1"
                    value={params.cockpitStart}
                    onChange={(e) => handleParamChange("cockpitStart", parseFloat(e.target.value))}
                    className="w-full accent-[#1A1A1A] cursor-pointer h-1.5 bg-[#1A1A1A]/15"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[9px] font-mono text-[#1A1A1A]/70 mb-0.5">
                    <span>RIB_FRAME_SPACING:</span>
                    <span className="font-bold text-[#1A1A1A]">{params.ribSpacing.toFixed(0)} in</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="20"
                    step="1"
                    value={params.ribSpacing}
                    onChange={(e) => handleParamChange("ribSpacing", parseFloat(e.target.value))}
                    className="w-full accent-[#1A1A1A] cursor-pointer h-1.5 bg-[#1A1A1A]/15"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Hydrostatics Metrics Readout Grid */}
          <div className="p-2.5 bg-white/50 border border-[#1A1A1A]/10 font-mono text-[9px] text-[#1A1A1A]">
            <div className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider text-[#1A1A1A]/50 pb-1.5 border-b border-[#1A1A1A]/10 mb-1.5">
              <Activity className="w-3 h-3 text-[#1A1A1A]/60" />
              <span>Real-Time Hydrostatic Analytics</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-left">
              <div>
                <span className="text-[#1A1A1A]/40 block text-[7.5px] uppercase">Displ:</span>
                <span className="font-bold text-[#1A1A1A]">{(hydrostatics?.displacementLbs ?? 225).toFixed(0)} lbs</span>
              </div>
              <div>
                <span className="text-[#1A1A1A]/40 block text-[7.5px] uppercase">Draft:</span>
                <span className="font-bold text-[#1A1A1A]">{(hydrostatics?.draft ?? 4.8).toFixed(2)}"</span>
              </div>
              <div>
                <span className="text-[#1A1A1A]/40 block text-[7.5px] uppercase">Stability GM:</span>
                <span className="font-bold text-[#1A1A1A]">{(hydrostatics?.gm ?? 2.8).toFixed(2)}"</span>
              </div>
              <div>
                <span className="text-[#1A1A1A]/40 block text-[7.5px] uppercase">Wetted Surf:</span>
                <span className="font-bold text-[#1A1A1A]">{((hydrostatics?.wettedSurfaceArea ?? 1850) / 144).toFixed(1)} sq.ft</span>
              </div>
            </div>
          </div>

          {/* Export Actions */}
          <div className="flex gap-2">
            <button
              id="btn-download-3dm"
              onClick={handleDownload3DM}
              disabled={!builder}
              className="flex-1 px-3 py-2 bg-[#1A1A1A] hover:bg-[#1A1A1A]/85 text-white text-[10px] font-mono tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              title="Download 3D Rhino model file (.3dm)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .3DM</span>
            </button>
            <button
              id="btn-download-svg"
              onClick={handleDownloadSVG}
              disabled={!builder}
              className="flex-1 px-3 py-2 border border-[#1A1A1A]/20 hover:bg-[#1A1A1A]/5 text-[#1A1A1A] text-[10px] font-mono tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              title="Download CNC/Rib Cross-Section Template (.svg)"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Station .SVG</span>
            </button>
          </div>

        </div>

        {/* Right Column: Embedded 3D Modeler Viewport */}
        <div className="lg:col-span-7 flex flex-col justify-between h-full min-h-[380px] relative">
          
          {/* Viewport Toolbar */}
          <div className="flex justify-between items-center pb-2 z-20">
            {/* View Mode Buttons */}
            <div className="flex items-center gap-1">
              <span className="text-[9px] font-mono text-[#1A1A1A]/50 uppercase mr-1 flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span className="hidden sm:inline">Camera:</span>
              </span>
              {(["perspective", "plan", "side"] as const).map((m) => (
                <button
                  id={`btn-view-${m}`}
                  key={m}
                  onClick={() => setViewMode(m)}
                  className={`text-[9px] font-mono px-2 py-0.5 uppercase transition-all cursor-pointer border ${
                    viewMode === m
                      ? "bg-[#1A1A1A] text-white border-[#1A1A1A] font-bold"
                      : "bg-white/50 text-[#1A1A1A]/60 border-[#1A1A1A]/10 hover:bg-white"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Layer Toggles */}
            <div className="flex items-center gap-1.5">
              <button
                id="btn-toggle-ribs"
                onClick={() => setShowRibs(!showRibs)}
                className={`text-[9px] font-mono px-2 py-0.5 uppercase transition-all cursor-pointer border flex items-center gap-1 ${
                  showRibs
                    ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                    : "bg-white/50 text-[#1A1A1A]/50 border-[#1A1A1A]/10"
                }`}
                title="Toggle Rib Stations"
              >
                <Layers className="w-3 h-3" />
                <span>Ribs</span>
              </button>

              <button
                id="btn-toggle-physics"
                onClick={() => setShowPhysics(!showPhysics)}
                className={`text-[9px] font-mono px-2 py-0.5 uppercase transition-all cursor-pointer border flex items-center gap-1 ${
                  showPhysics
                    ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                    : "bg-white/50 text-[#1A1A1A]/50 border-[#1A1A1A]/10"
                }`}
                title="Toggle Waterline and Hydrostatic Centers"
              >
                <Activity className="w-3 h-3" />
                <span>Waterplane</span>
              </button>
            </div>
          </div>

          {/* Canvas Viewport Container */}
          <div className="flex-1 w-full relative min-h-[340px]">
            {loadingRhino ? (
              <div className="absolute inset-0 bg-[#EAE7DF] flex flex-col items-center justify-center font-mono text-xs text-[#1A1A1A]/70 space-y-2 border border-[#1A1A1A]/10">
                <div className="w-6 h-6 border-2 border-[#1A1A1A]/30 border-t-[#1A1A1A] rounded-full animate-spin" />
                <span>INITIALIZING RHINO3D WASM ENGINE...</span>
              </div>
            ) : loadError ? (
              <div className="absolute inset-0 bg-[#EAE7DF] flex flex-col items-center justify-center font-mono text-xs text-red-600 p-4 text-center border border-red-300">
                <span>{loadError}</span>
              </div>
            ) : (
              <BoatModelerCanvas
                params={params}
                builder={builder}
                viewMode={viewMode}
                showPhysics={showPhysics}
                showRibs={showRibs}
                showDimensions={true}
                draft={hydrostatics.draft}
                vcb={hydrostatics.vcb}
                lcb={hydrostatics.lcb}
                isDrawingActive={isDrawingActive}
              />
            )}
          </div>

          {/* Footer Note */}
          <div className="pt-2 text-[9px] font-mono text-[#1A1A1A]/50 flex justify-between items-center">
            <span>PRESS [D] TO MARK UP OR SKETCH OVER 3D BOAT HULL</span>
            <span className="hidden sm:inline text-[8px] uppercase text-[#1A1A1A]/40">KLEPPER BESPOKE v2.0</span>
          </div>

        </div>

      </div>
    </PageContainer>
  );
}
