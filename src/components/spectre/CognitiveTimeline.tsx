import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Activity, ShieldCheck, Radio } from "lucide-react";
import { SpectreTileData, CognitiveEpochData } from "./types";

export interface SwarmNode {
  id: string;
  alias: string;
  role: string;
  x: number;
  y: number;
  color: string;
  stageAppears: number;
}

export interface SwarmWire {
  fromId: string;
  toId: string;
  fromAlias: string;
  toAlias: string;
  activeAtStage: number;
  edgeLabel: string;
}

interface CognitiveTimelineProps {
  tiles: SpectreTileData[];
  activeTileIds: string[];
  isThinking: boolean;
  activeStageIndex: number | null; // null when no prompt has been run
  epochs: CognitiveEpochData[];
}

export default function CognitiveTimeline({
  tiles,
  activeTileIds,
  isThinking,
  activeStageIndex,
}: CognitiveTimelineProps) {
  const [hoveredNode, setHoveredNode] = useState<SwarmNode | null>(null);
  const [hoveredWire, setHoveredWire] = useState<SwarmWire | null>(null);

  // Map agent alias to color
  const getTileColor = (alias: string) =>
    tiles.find((t) => t.header.agent_alias === alias)?.color || "#4f46e5";

  // Nodes in the communication network:
  // Starts with 1 node (GenesisCore) on the left,
  // Piles on each other in the middle (CryptoSpecialist, ThreatAnalyzer, DataIngestor),
  // Tapers off to 1 node (ColonySynthesizer) on the right.
  const nodes: SwarmNode[] = useMemo(() => [
    {
      id: "genesis",
      alias: "GenesisCore",
      role: "Goal Inception & Delegation",
      x: 60,
      y: 55,
      color: getTileColor("GenesisCore"),
      stageAppears: 0,
    },
    {
      id: "crypto",
      alias: "CryptoSpecialist",
      role: "ML-KEM-1024 Lattice Decapsulation",
      x: 185,
      y: 28,
      color: getTileColor("CryptoSpecialist"),
      stageAppears: 1,
    },
    {
      id: "threat",
      alias: "ThreatAnalyzer",
      role: "Perimeter Shield & Airlock Quorum",
      x: 240,
      y: 55,
      color: getTileColor("ThreatAnalyzer"),
      stageAppears: 1,
    },
    {
      id: "ingestor",
      alias: "DataIngestor",
      role: "Aperiodic Contact Telemetry",
      x: 295,
      y: 82,
      color: getTileColor("DataIngestor"),
      stageAppears: 2,
    },
    {
      id: "synthesizer",
      alias: "ColonySynthesizer",
      role: "Swarm Consensus Finality",
      x: 440,
      y: 55,
      color: getTileColor("ColonySynthesizer"),
      stageAppears: 3,
    },
  ], [tiles]);

  // Wires represent lines of communication that STRICTLY exist between communicating nodes
  // All wires move strictly from left to right as communication spreads through the network
  const wires: SwarmWire[] = useMemo(() => [
    // GenesisCore delegates subtasks across touching edges
    {
      fromId: "genesis",
      toId: "crypto",
      fromAlias: "GenesisCore",
      toAlias: "CryptoSpecialist",
      activeAtStage: 1,
      edgeLabel: "Touching Edge 0 (Delegation)",
    },
    {
      fromId: "genesis",
      toId: "threat",
      fromAlias: "GenesisCore",
      toAlias: "ThreatAnalyzer",
      activeAtStage: 1,
      edgeLabel: "Touching Edge 1 (Delegation)",
    },

    // Middle nodes communicate across touching edges as reasoning spreads
    {
      fromId: "crypto",
      toId: "threat",
      fromAlias: "CryptoSpecialist",
      toAlias: "ThreatAnalyzer",
      activeAtStage: 2,
      edgeLabel: "Touching Edge 4 (Lattice Peer Audit)",
    },
    {
      fromId: "threat",
      toId: "ingestor",
      fromAlias: "ThreatAnalyzer",
      toAlias: "DataIngestor",
      activeAtStage: 2,
      edgeLabel: "Touching Edge 2 (Perimeter Telemetry)",
    },

    // Verified payloads route into ColonySynthesizer for consensus
    {
      fromId: "crypto",
      toId: "synthesizer",
      fromAlias: "CryptoSpecialist",
      toAlias: "ColonySynthesizer",
      activeAtStage: 3,
      edgeLabel: "ML-KEM-1024 Sealed Payload",
    },
    {
      fromId: "threat",
      toId: "synthesizer",
      fromAlias: "ThreatAnalyzer",
      toAlias: "ColonySynthesizer",
      activeAtStage: 3,
      edgeLabel: "Byzantine Airlock Signatures",
    },
    {
      fromId: "ingestor",
      toId: "synthesizer",
      fromAlias: "DataIngestor",
      toAlias: "ColonySynthesizer",
      activeAtStage: 3,
      edgeLabel: "Aperiodic Topology Proof",
    },
  ], []);

  // If there isn't an active prompt, the chart should be completely empty
  if (activeStageIndex === null) {
    return (
      <div className="w-full h-full bg-[#EFECE6]/40 rounded-xl border border-[#1A1A1A]/10 transition-colors duration-300" />
    );
  }

  return (
    <div className="relative w-full h-full bg-[#EFECE6]/80 rounded-xl border border-[#1A1A1A]/10 p-3 flex flex-col justify-between overflow-hidden select-none">
      {/* Header Bar: Status & Transmission Activity */}
      <div className="flex items-center justify-between pb-1.5 border-b border-[#1A1A1A]/10 text-[10px] font-mono text-[#1A1A1A]">
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[9px]">
          <Activity className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
          <span>Swarm Neural Wireframe</span>
        </div>

        <div className="flex items-center gap-3 text-[9px] text-[#1A1A1A]/60">
          {isThinking ? (
            <span className="text-rose-600 font-bold animate-pulse flex items-center gap-1">
              <Radio className="w-2.5 h-2.5" /> Packets Propagating...
            </span>
          ) : (
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Consensus Trajectory Locked
            </span>
          )}
        </div>
      </div>

      {/* SVG Canvas with Left-to-Right Wires & Stacking Circle Nodes */}
      <div className="relative flex-1 min-h-0 w-full flex items-center justify-center">
        <svg
          viewBox="0 0 500 110"
          className="w-full h-full max-h-[120px] overflow-visible"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="wireGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 1. DRAW COMMUNICATION WIRES (ONLY BETWEEN COMMUNICATING NODES) */}
          {wires.map((wire, idx) => {
            const fromNode = nodes.find((n) => n.id === wire.fromId);
            const toNode = nodes.find((n) => n.id === wire.toId);

            if (!fromNode || !toNode) return null;

            const isWireVisible = activeStageIndex >= wire.activeAtStage;
            const isWireActive = activeStageIndex === wire.activeAtStage && isThinking;

            if (!isWireVisible) return null;

            const x1 = fromNode.x;
            const y1 = fromNode.y;
            const x2 = toNode.x;
            const y2 = toNode.y;

            // Smooth cubic bezier curve flowing strictly left to right
            const dx = x2 - x1;
            const pathData = `M ${x1} ${y1} C ${x1 + dx * 0.45} ${y1}, ${x2 - dx * 0.45} ${y2}, ${x2} ${y2}`;

            const isHovered =
              hoveredWire?.fromId === wire.fromId && hoveredWire?.toId === wire.toId;

            return (
              <g
                key={idx}
                onMouseEnter={() => setHoveredWire(wire)}
                onMouseLeave={() => setHoveredWire(null)}
                className="cursor-pointer"
              >
                {/* Invisible hover hitbox */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="10"
                />

                {/* Visible Communication Wire */}
                <motion.path
                  d={pathData}
                  fill="none"
                  stroke={isWireActive || isHovered ? "#e11d48" : fromNode.color}
                  strokeWidth={isWireActive || isHovered ? 2.4 : 1.3}
                  opacity={isWireActive || isHovered ? 1 : 0.45}
                  strokeDasharray={isWireActive ? "4 2" : undefined}
                  filter={isWireActive || isHovered ? "url(#wireGlow)" : undefined}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                />

                {/* Moving Packet Dot on active wire */}
                {isWireActive && (
                  <motion.circle
                    r="2.5"
                    fill="#e11d48"
                    filter="url(#wireGlow)"
                    animate={{
                      cx: [x1, x2],
                      cy: [y1, y2],
                    }}
                    transition={{
                      duration: 0.85,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </g>
            );
          })}

          {/* 2. DRAW SIMPLE CIRCLE NODES (STACKING IN THE MIDDLE, 1 AT ENDS) */}
          {nodes.map((node) => {
            const isNodeUnlocked = activeStageIndex >= node.stageAppears;
            if (!isNodeUnlocked) return null;

            const isNodeActive =
              activeTileIds.some(
                (id) => tiles.find((t) => t.tile_id === id)?.header.agent_alias === node.alias
              ) || (isThinking && activeStageIndex === node.stageAppears);

            const isHovered = hoveredNode?.id === node.id;

            return (
              <g
                key={node.id}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer"
              >
                {/* Ping wave when actively communicating */}
                {isNodeActive && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="11"
                    fill="none"
                    stroke={node.color}
                    strokeWidth="1.2"
                    className="animate-ping opacity-60"
                  />
                )}

                {/* Simple Circle Node */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isNodeActive || isHovered ? 7 : 5.5}
                  fill={isNodeActive || isHovered ? node.color : "#FAF8F5"}
                  stroke={node.color}
                  strokeWidth={isNodeActive || isHovered ? 2.5 : 1.8}
                  className="transition-all duration-200 drop-shadow-xs"
                />

                {/* Inner Core Dot for resting completed nodes */}
                {!isNodeActive && !isHovered && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="2.2"
                    fill={node.color}
                    opacity="0.85"
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Footer Info / Wire & Node Inspector */}
      <div className="pt-1 border-t border-[#1A1A1A]/10 flex justify-between items-center text-[9px] font-mono text-[#1A1A1A]/60">
        <span className="truncate">
          {hoveredWire ? (
            <span className="text-[#1A1A1A] font-bold">
              Wire: [{hoveredWire.fromAlias}] ➔ [{hoveredWire.toAlias}] ({hoveredWire.edgeLabel})
            </span>
          ) : hoveredNode ? (
            <span className="text-[#1A1A1A] font-bold">
              ● Node: [{hoveredNode.alias}] — {hoveredNode.role}
            </span>
          ) : isThinking ? (
            <span className="text-rose-600 font-semibold animate-pulse">
              Dispatching encrypted packets through Spatial Firewall...
            </span>
          ) : (
            <span>Hover on wires or nodes to inspect communication hops</span>
          )}
        </span>
        <span className="shrink-0 text-[#1A1A1A]/40 font-bold">Left ➔ Right Propagation</span>
      </div>
    </div>
  );
}

