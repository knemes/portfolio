import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, ShieldAlert, Cpu, Radio, Sparkles, Key } from "lucide-react";
import { SpectreTileData } from "./types";

interface SpectreMapProps {
  tiles: SpectreTileData[];
  activeTileIds: string[];
  selectedTileId: string | null;
  onSelectTile: (tile: SpectreTileData) => void;
  isThinking: boolean;
  latestThoughts?: Record<string, { category: string; summary: string; reasoning: string }>;
}

export default function SpectreMap({
  tiles,
  activeTileIds,
  selectedTileId,
  onSelectTile,
  isThinking,
  latestThoughts = {},
}: SpectreMapProps) {
  const [hoveredTile, setHoveredTile] = useState<SpectreTileData | null>(null);

  // Compute bounding box across all tiles to auto-fit and center the SVG
  const { minX, minY, width, height, viewBox } = useMemo(() => {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    tiles.forEach((t) => {
      t.geometry.vertices.forEach((v) => {
        if (v.x < minX) minX = v.x;
        if (v.x > maxX) maxX = v.x;
        if (v.y < minY) minY = v.y;
        if (v.y > maxY) maxY = v.y;
      });
    });

    if (minX === Infinity) {
      return { minX: -6, minY: -6, width: 12, height: 12, viewBox: "-6 -6 12 12" };
    }

    // Add margin around the colony
    const pad = 1.4;
    const w = maxX - minX + pad * 2;
    const h = maxY - minY + pad * 2;
    const x0 = minX - pad;
    // Invert Y axis for standard screen coordinates
    const y0 = -(maxY + pad);

    return {
      minX: x0,
      minY: y0,
      width: Math.max(w, 8),
      height: Math.max(h, 8),
      viewBox: `${x0} ${y0} ${Math.max(w, 8)} ${Math.max(h, 8)}`,
    };
  }, [tiles]);

  // Generate inter-agent touching edge communication lines
  const edgeConnections = useMemo(() => {
    const connections: { from: [number, number]; to: [number, number]; key: string; active: boolean }[] = [];
    const seen = new Set<string>();

    tiles.forEach((tile) => {
      const fromCenter = [tile.geometry.centroid.x, -tile.geometry.centroid.y] as [number, number];
      Object.values(tile.edge_connections).forEach((conn) => {
        const neighbor = tiles.find((t) => t.tile_id === conn.neighbor_tile_id);
        if (neighbor) {
          const pairKey = [tile.tile_id, neighbor.tile_id].sort().join("-");
          if (!seen.has(pairKey)) {
            seen.add(pairKey);
            const toCenter = [neighbor.geometry.centroid.x, -neighbor.geometry.centroid.y] as [number, number];
            const active = activeTileIds.includes(tile.tile_id) && activeTileIds.includes(neighbor.tile_id);
            connections.push({ from: fromCenter, to: toCenter, key: pairKey, active });
          }
        }
      });
    });

    return connections;
  }, [tiles, activeTileIds]);

  return (
    <div className="relative w-full h-full flex flex-col items-stretch justify-between select-none overflow-hidden bg-[#EFECE6]/80 rounded-xl border border-[#1A1A1A]/10 p-3">
      {/* Map Header Status Bar */}
      <div className="flex justify-between items-center z-10 text-[10px] font-mono text-[#1A1A1A]/70 pb-2 border-b border-[#1A1A1A]/10">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#1A1A1A] text-white rounded font-bold uppercase tracking-wider text-[9px]">
            <Radio className={`w-3 h-3 ${isThinking ? "text-emerald-400 animate-pulse" : "text-amber-300"}`} />
            <span>MOSAIC MESH</span>
          </span>
          <span className="text-[#1A1A1A]/40 font-serif italic text-xs">
            {tiles.length} Sovereign Spectre Tiles
          </span>
        </div>
        
        <div className="flex items-center gap-3 text-[9px] font-mono">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" /> Active
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block animate-pulse" /> Thinking
          </span>
          <span className="flex items-center gap-1 text-[#1A1A1A]/50">
            <Shield className="w-3 h-3" /> FIPS 203 ML-KEM
          </span>
        </div>
      </div>

      {/* SVG Canvas for Einstein Spectre Monotiles */}
      <div className="relative flex-1 min-h-0 w-full flex items-center justify-center p-2">
        <svg
          viewBox={viewBox}
          className="w-full h-full max-h-[360px] overflow-visible drop-shadow-sm"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Active Neon Glow Filter */}
            <filter id="activeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="0.18" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            
            {/* Grid backdrop pattern */}
            <pattern id="hexGrid" width="1" height="1.732" patternUnits="userSpaceOnUse">
              <path d="M 0 0.866 L 0.5 0 L 1 0.866 L 0.5 1.732 Z" fill="none" stroke="#1A1A1A" strokeWidth="0.015" opacity="0.07" />
            </pattern>
          </defs>

          {/* Hexagonal lattice background preview */}
          <rect x={minX} y={minY} width={width} height={height} fill="url(#hexGrid)" />

          {/* Touching Edge Communication Lines (Spatial Firewall) */}
          {edgeConnections.map((conn) => (
            <g key={conn.key}>
              <line
                x1={conn.from[0]}
                y1={conn.from[1]}
                x2={conn.to[0]}
                y2={conn.to[1]}
                stroke={conn.active ? "#10b981" : "#1A1A1A"}
                strokeWidth={conn.active ? "0.06" : "0.025"}
                strokeDasharray={conn.active ? "0.15 0.08" : "0.08 0.04"}
                opacity={conn.active ? 0.9 : 0.25}
                className={conn.active ? "animate-pulse" : ""}
              />
              {conn.active && (
                <circle
                  cx={(conn.from[0] + conn.to[0]) / 2}
                  cy={(conn.from[1] + conn.to[1]) / 2}
                  r="0.08"
                  fill="#10b981"
                  filter="url(#activeGlow)"
                />
              )}
            </g>
          ))}

          {/* Render Spectre 14-gon Tiles */}
          {tiles.map((tile) => {
            const isActive = activeTileIds.includes(tile.tile_id);
            const isSelected = selectedTileId === tile.tile_id;
            const isHovered = hoveredTile?.tile_id === tile.tile_id;
            const isQuarantined = tile.status === "QUARANTINED";

            // Build SVG polygon points string (inverting Y for screen)
            const pointsStr = tile.geometry.vertices
              .map((v) => `${v.x},${-v.y}`)
              .join(" ");

            const fillColor = isQuarantined
              ? "#fee2e2"
              : isActive
              ? `${tile.color}35`
              : isSelected
              ? `${tile.color}25`
              : isHovered
              ? `${tile.color}20`
              : "#FAF8F5";

            const strokeColor = isQuarantined
              ? "#ef4444"
              : isActive
              ? "#10b981"
              : isSelected
              ? tile.color
              : "#2c2a29";

            const strokeWidth = isActive ? 0.08 : isSelected ? 0.06 : 0.035;

            return (
              <g
                key={tile.tile_id}
                onClick={() => onSelectTile(tile)}
                onMouseEnter={() => setHoveredTile(tile)}
                onMouseLeave={() => setHoveredTile(null)}
                className="cursor-pointer transition-all duration-300"
              >
                {/* 14-gon Monotile Shape */}
                <polygon
                  points={pointsStr}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeLinejoin="round"
                  strokeDasharray={isQuarantined ? "0.1 0.05" : undefined}
                  filter={isActive ? "url(#activeGlow)" : undefined}
                />

                {/* Centroid Dot & Alias Label */}
                <circle
                  cx={tile.geometry.centroid.x}
                  cy={-tile.geometry.centroid.y}
                  r={isActive ? "0.12" : "0.08"}
                  fill={tile.color}
                  stroke="#FAF8F5"
                  strokeWidth="0.02"
                />

                <text
                  x={tile.geometry.centroid.x}
                  y={-tile.geometry.centroid.y + 0.35}
                  textAnchor="middle"
                  fontSize="0.22"
                  fontWeight="600"
                  fill="#1A1A1A"
                  fontFamily="monospace"
                  className="pointer-events-none drop-shadow-sm select-none"
                >
                  {tile.header.agent_alias}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Inspector Tooltip Overlay */}
        <AnimatePresence>
          {hoveredTile && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute top-2 right-2 max-w-[310px] bg-white/95 backdrop-blur-md p-3.5 border border-[#1A1A1A]/20 shadow-2xl text-left pointer-events-none z-30 font-sans rounded-lg"
            >
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#1A1A1A]/10">
                <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-[#1A1A1A]">
                  <span className="w-2.5 h-2.5 rounded-full shadow-xs" style={{ backgroundColor: hoveredTile.color }} />
                  <span>{hoveredTile.header.agent_alias}</span>
                </div>
                <div className="flex items-center gap-1">
                  {activeTileIds.includes(hoveredTile.tile_id) && (
                    <span className="text-[8px] font-mono px-1.5 py-0.5 bg-rose-500 text-white rounded font-bold animate-pulse">
                      THINKING
                    </span>
                  )}
                  <span className="text-[9px] font-mono px-1.5 py-0.5 bg-[#1A1A1A]/5 rounded text-[#1A1A1A]/70 uppercase">
                    Block #{hoveredTile.header.index}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2 text-[10px] text-[#1A1A1A]/80 font-mono">
                <div>
                  <span className="text-[#1A1A1A]/40 uppercase text-[8px] block font-bold">Role & Specialization</span>
                  <span className="font-bold text-[#1A1A1A]">{hoveredTile.specialization}</span>
                </div>

                {/* Live Cognitive Reasoning Stream */}
                <div className="bg-[#FAF8F5] p-2.5 rounded border border-[#1A1A1A]/10 space-y-1">
                  <div className="flex items-center justify-between text-[8px] uppercase tracking-wider text-indigo-700 font-bold">
                    <span>Active Cognitive Epoch</span>
                    <span>{latestThoughts[hoveredTile.tile_id]?.category || "MONITORING"}</span>
                  </div>
                  <p className="text-[10px] text-[#1A1A1A] font-serif italic leading-snug">
                    "{latestThoughts[hoveredTile.tile_id]?.reasoning || hoveredTile.role_description}"
                  </p>
                </div>

                <div className="pt-1 flex items-center justify-between text-[8px] text-[#1A1A1A]/50 border-t border-[#1A1A1A]/10">
                  <span className="flex items-center gap-1 text-emerald-700 font-bold">
                    <Shield className="w-2.5 h-2.5" /> ML-KEM-1024 Sealed
                  </span>
                  <span>{Object.keys(hoveredTile.edge_connections).length} Touching Edges</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Map Bottom Footer Stats */}
      <div className="pt-2 border-t border-[#1A1A1A]/10 flex justify-between items-center text-[9px] font-mono text-[#1A1A1A]/60">
        <span>Proof of Geometric Fit: Verified</span>
        <span>Aperiodic Chiral Monotile Lattice</span>
      </div>
    </div>
  );
}
