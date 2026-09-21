import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Sparkles, Shield, Cpu, RefreshCw, Layers, Terminal } from "lucide-react";
import PageContainer from "../PageContainer";
import SpectreMap from "../spectre/SpectreMap";
import CognitiveTimeline from "../spectre/CognitiveTimeline";
import {
  INITIAL_SPECTRE_TILES,
  INITIAL_COGNITIVE_EPOCHS,
} from "../spectre/initialColonyData";
import { SpectreTileData, CognitiveEpochData, ChatMessage } from "../spectre/types";

interface Page3QAIChainProps {
  isDrawingActive: boolean;
  totalPages: number;
}

export default function Page3QAIChain({
  isDrawingActive,
  totalPages,
}: Page3QAIChainProps) {
  const [tiles, setTiles] = useState<SpectreTileData[]>(INITIAL_SPECTRE_TILES);
  const [epochs, setEpochs] = useState<CognitiveEpochData[]>(INITIAL_COGNITIVE_EPOCHS);
  const [activeTileIds, setActiveTileIds] = useState<string[]>([]);
  const [activeEpochHash, setActiveEpochHash] = useState<string | null>(null);
  const [selectedTileId, setSelectedTileId] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>("");

  const [activeStageIndex, setActiveStageIndex] = useState<number | null>(null);
  const [latestThoughts, setLatestThoughts] = useState<
    Record<string, { category: string; summary: string; reasoning: string }>
  >({
    [tiles[0].tile_id]: {
      category: "CONSENSUS_STABILIZE",
      summary: "Mosaic consensus stabilized.",
      reasoning: "Validated 14-gon chiral contact constraints. Zero overlapping vertices. Aperiodic polarities interlock seamlessly.",
    },
    [tiles[1].tile_id]: {
      category: "LATTICE_VERIFY",
      summary: "ML-KEM-1024 parameters safe.",
      reasoning: "Verified NIST Level 5 lattice security margins under dual-basis reduction. 280+ bits quantum security intact.",
    },
    [tiles[2].tile_id]: {
      category: "BYZANTINE_SWEEP",
      summary: "Perimeter inspected.",
      reasoning: "Monitored packet arrival intervals across touching Edge 1 with GenesisCore. Hop signatures fully authentic.",
    },
    [tiles[3].tile_id]: {
      category: "EXECUTIVE_SYNTHESIS",
      summary: "Colony telemetry compiled.",
      reasoning: "Correlated crypto verification and threat telemetry into high-availability matrix. Swarm state ready.",
    },
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "msg-0",
      sender: "swarm",
      agent_alias: "GenesisCore",
      text: "QAI-Chain Quantum Swarm Ledger initialized. 5 sovereign agent tiles active in aperiodic Spectre harmony. Submit any goal or cryptographic task below.",
      timestamp: Date.now(),
    },
  ]);

  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Suggested prompt pills
  const samplePrompts = [
    "Audit lattice key encapsulation against side channels",
    "Detect Byzantine perimeter attack on touching edges",
    "Verify 14-gon aperiodic tiling consensus",
  ];

  // Dynamic Prompt Submission & Step-by-Step Simulation Sequence
  const handleSendPrompt = (promptText: string) => {
    if (!promptText.trim() || isThinking) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: promptText.trim(),
      timestamp: Date.now(),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsThinking(true);
    setActiveStageIndex(0);

    const genesisId = tiles[0].tile_id;
    const cryptoId = tiles[1].tile_id;
    const threatId = tiles[2].tile_id;
    const synthId = tiles[3].tile_id;

    // STAGE 0: Genesis Inception & Goal Decomposition (t = 400ms)
    setTimeout(() => {
      setActiveTileIds([genesisId]);
      setActiveStageIndex(0);

      const thought1 = {
        category: "GOAL_DECOMPOSE",
        summary: `Decomposed goal into subtasks.`,
        reasoning: `Root Orchestrator parsed: "${promptText.slice(0, 45)}...". Delegating lattice verification across Edge 0 to CryptoSpecialist and perimeter defense to ThreatAnalyzer.`,
      };
      setLatestThoughts((prev) => ({ ...prev, [genesisId]: thought1 }));

      const newEpoch1: CognitiveEpochData = {
        epoch_hash: `epoch-${Date.now()}-1`,
        agent_tile_id: genesisId,
        agent_alias: "GenesisCore",
        epoch_index: epochs.filter((e) => e.agent_tile_id === genesisId).length,
        category: thought1.category,
        summary: thought1.summary,
        detailed_reasoning: thought1.reasoning,
        timestamp: Math.floor(Date.now() / 1000),
        dual_kem_status: "ML-KEM-1024 sealed (Genesis + Auditor)",
        dsa_signature_stamp: "ML-DSA-65 [1ddfaeb2...]",
        prev_epoch_hash: epochs[epochs.length - 1]?.epoch_hash || "0",
      };
      setEpochs((prev) => [...prev, newEpoch1]);
      setActiveEpochHash(newEpoch1.epoch_hash);
    }, 400);

    // STAGE 1: Spatial Firewall Fan-out -> CryptoSpecialist pulses (t = 1100ms)
    setTimeout(() => {
      setActiveTileIds([genesisId, cryptoId]);
      setActiveStageIndex(1);

      const thought2 = {
        category: "LATTICE_ANALYSIS",
        summary: "Evaluated NIST Level 5 lattice security margins.",
        reasoning: `Decapsulated task directive sealed with CryptoSpecialist ML-KEM key. Tested Module-LWE noise parameters against physical power and timing side channels. Verified 280+ bits security.`,
      };
      setLatestThoughts((prev) => ({ ...prev, [cryptoId]: thought2 }));

      const newEpoch2: CognitiveEpochData = {
        epoch_hash: `epoch-${Date.now()}-2`,
        agent_tile_id: cryptoId,
        agent_alias: "CryptoSpecialist",
        epoch_index: epochs.filter((e) => e.agent_tile_id === cryptoId).length,
        category: thought2.category,
        summary: thought2.summary,
        detailed_reasoning: thought2.reasoning,
        timestamp: Math.floor(Date.now() / 1000),
        dual_kem_status: "ML-KEM-1024 sealed (Crypto + Auditor)",
        dsa_signature_stamp: "ML-DSA-65 [4e918274...]",
        prev_epoch_hash: `epoch-${Date.now()}-1`,
      };
      setEpochs((prev) => [...prev, newEpoch2]);
      setActiveEpochHash(newEpoch2.epoch_hash);
    }, 1100);

    // STAGE 2: Peak Concurrent Reasoning (t = 1900ms) - ThreatAnalyzer & DataIngestor stack
    setTimeout(() => {
      setActiveTileIds([genesisId, cryptoId, threatId, tiles[4].tile_id]);
      setActiveStageIndex(2);

      const thought3 = {
        category: "BYZANTINE_SWEEP",
        summary: "Simulated Byzantine airlock response across perimeter.",
        reasoning: `Checked touching edge telemetry against known adversarial vectors. Confirmed neighbor quorum can sever rogue nodes instantly, containing threats at blast radius R=0.`,
      };
      setLatestThoughts((prev) => ({ ...prev, [threatId]: thought3 }));

      const newEpoch3: CognitiveEpochData = {
        epoch_hash: `epoch-${Date.now()}-3`,
        agent_tile_id: threatId,
        agent_alias: "ThreatAnalyzer",
        epoch_index: epochs.filter((e) => e.agent_tile_id === threatId).length,
        category: thought3.category,
        summary: thought3.summary,
        detailed_reasoning: thought3.reasoning,
        timestamp: Math.floor(Date.now() / 1000),
        dual_kem_status: "ML-KEM-1024 sealed (Threat + Auditor)",
        dsa_signature_stamp: "ML-DSA-65 [6b039485...]",
        prev_epoch_hash: `epoch-${Date.now()}-2`,
      };
      setEpochs((prev) => [...prev, newEpoch3]);
      setActiveEpochHash(newEpoch3.epoch_hash);
    }, 1900);

    // STAGE 3: Aggregation & Synthesis transit (t = 2700ms)
    setTimeout(() => {
      setActiveTileIds([threatId, synthId]);
      setActiveStageIndex(3);
    }, 2700);

    // STAGE 4: Consensus Finality - 1 Node at end (t = 3400ms)
    setTimeout(() => {
      setActiveTileIds([synthId]);
      setActiveStageIndex(4);

      const thought4 = {
        category: "STRATEGIC_SYNTHESIS",
        summary: "Compiled multi-agent cognitive epochs into final consensus.",
        reasoning: `Aggregated cryptographic proofs and threat modeling logs. Validated across 5 aperiodic Spectre monotiles with 100% post-quantum signature provenance.`,
      };
      setLatestThoughts((prev) => ({ ...prev, [synthId]: thought4 }));

      const newEpoch4: CognitiveEpochData = {
        epoch_hash: `epoch-${Date.now()}-4`,
        agent_tile_id: synthId,
        agent_alias: "ColonySynthesizer",
        epoch_index: epochs.filter((e) => e.agent_tile_id === synthId).length,
        category: thought4.category,
        summary: thought4.summary,
        detailed_reasoning: thought4.reasoning,
        timestamp: Math.floor(Date.now() / 1000),
        dual_kem_status: "ML-KEM-1024 sealed (Synthesizer + Auditor)",
        dsa_signature_stamp: "ML-DSA-65 [8d251607...]",
        prev_epoch_hash: `epoch-${Date.now()}-3`,
      };
      setEpochs((prev) => [...prev, newEpoch4]);
      setActiveEpochHash(newEpoch4.epoch_hash);

      const swarmReply: ChatMessage = {
        id: `swarm-${Date.now()}`,
        sender: "swarm",
        agent_alias: "ColonySynthesizer",
        text: `Swarm consensus reached for: "${promptText}"\n\n• CryptoSpecialist verified ML-KEM-1024 lattice margins.\n• ThreatAnalyzer confirmed Spatial Firewall boundary integrity.\n• Complete cognitive stream dual-encrypted for Colony Auditor.\n\nResult validated across 5 sovereign Spectre blocks with zero geometric cul-de-sacs.`,
        timestamp: Date.now(),
      };

      setChatMessages((prev) => [...prev, swarmReply]);
      setIsThinking(false);

      setTimeout(() => {
        setActiveTileIds([]);
        setActiveEpochHash(null);
      }, 1500);
    }, 3400);
  };

  return (
    <PageContainer
      pageNumber={3}
      totalPages={totalPages}
      title="03. QAI-Chain Quantum Swarm Ledger"
      category="QUANTUM AI"
      drawingActive={isDrawingActive}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch max-w-6xl mx-auto h-full min-h-0 flex-1">
        
        {/* LEFT COLUMN: Context & Interactive Swarm Chat (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between text-left space-y-3 min-h-0">
          
          {/* Header Description */}
          <div className="space-y-1.5 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono bg-[#1A1A1A] text-white px-2 py-0.5 uppercase tracking-widest inline-block font-bold">
                Aperiodic Consensus
              </span>
              <span className="text-[9px] font-mono text-emerald-700 bg-emerald-100/70 border border-emerald-300 px-1.5 py-0.5 font-bold flex items-center gap-1">
                <Shield className="w-2.5 h-2.5" /> PQC ML-KEM-1024
              </span>
            </div>
            
            <h3 className="text-2xl font-serif italic text-[#1A1A1A] leading-tight">
              Einstein Spectre Swarm Explorer
            </h3>
            
            <p className="text-xs text-[#1A1A1A]/80 font-serif italic leading-snug">
              Every block is the birth of an autonomous AI agent represented as an aperiodic Spectre 14-gon. Communication travels strictly across touching edges via the <strong>Spatial Firewall</strong>, preserving memory privacy with post-quantum cryptography.
            </p>
          </div>

          {/* Interactive Chat Box Feed */}
          <div className="flex-1 min-h-[160px] max-h-[260px] flex flex-col justify-between bg-[#EFECE6]/80 rounded-xl border border-[#1A1A1A]/10 p-3 overflow-hidden">
            
            <div className="flex justify-between items-center pb-2 border-b border-[#1A1A1A]/10 text-[9px] font-mono text-[#1A1A1A]/60">
              <span className="flex items-center gap-1.5 font-bold text-[#1A1A1A] uppercase tracking-wider">
                <Terminal className="w-3 h-3 text-indigo-600" />
                <span>Colony Directives</span>
              </span>
              <div className="flex items-center gap-2">
                <span>{isThinking ? "⚡ Swarm Reasoning..." : "Idle / Standing By"}</span>
                {activeStageIndex !== null && !isThinking && (
                  <button
                    onClick={() => {
                      setActiveStageIndex(null);
                      setActiveTileIds([]);
                      setActiveEpochHash(null);
                    }}
                    title="Clear active swarm session"
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/80 hover:bg-white border border-[#1A1A1A]/15 text-[8px] text-[#1A1A1A] cursor-pointer transition font-mono font-bold shadow-2xs"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Message Stream */}
            <div ref={chatScrollRef} className="flex-1 overflow-y-auto space-y-2 py-2 pr-1 text-left text-xs font-sans scrollbar-none">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <span className="text-[8px] font-mono text-[#1A1A1A]/40 uppercase mb-0.5 px-1">
                    {msg.sender === "user" ? "Human Prompt" : `[${msg.agent_alias || "Swarm"}]`}
                  </span>
                  <div
                    className={`p-2.5 rounded-lg max-w-[85%] text-xs leading-relaxed whitespace-pre-line ${
                      msg.sender === "user"
                        ? "bg-[#1A1A1A] text-white font-sans shadow-xs"
                        : "bg-white/95 text-[#1A1A1A] border border-[#1A1A1A]/10 font-serif italic shadow-xs"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input & Send */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendPrompt(inputText);
              }}
              className="pt-2 border-t border-[#1A1A1A]/10 flex gap-1.5"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask the swarm colony a question..."
                disabled={isThinking}
                className="flex-1 bg-white/90 border border-[#1A1A1A]/15 rounded px-2.5 py-1.5 text-xs text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] font-sans"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isThinking}
                className={`px-3 py-1.5 rounded flex items-center justify-center font-mono text-xs transition-all cursor-pointer ${
                  !inputText.trim() || isThinking
                    ? "bg-[#1A1A1A]/20 text-white cursor-not-allowed"
                    : "bg-[#1A1A1A] text-white hover:bg-stone-800 active:scale-95 shadow-xs font-bold"
                }`}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Quick Prompt Pills */}
          <div className="space-y-1 pt-0.5 shrink-0">
            <span className="text-[8px] font-mono text-[#1A1A1A]/50 uppercase tracking-widest block font-bold">
              Suggested Directives
            </span>
            <div className="flex flex-wrap gap-1">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendPrompt(p)}
                  disabled={isThinking}
                  className="text-[9px] font-mono py-1 px-2 bg-white/70 hover:bg-white border border-[#1A1A1A]/10 text-[#1A1A1A]/80 hover:text-[#1A1A1A] rounded transition cursor-pointer text-left truncate max-w-full"
                >
                  "{p}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Spectre Monotile Map (Top) + Cognitive Timeline (Bottom) (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-3 min-h-0 h-full">
          
          {/* Top: 2D Interactive Einstein Spectre Map */}
          <div className="flex-1 min-h-[220px] max-h-[320px]">
            <SpectreMap
              tiles={tiles}
              activeTileIds={activeTileIds}
              selectedTileId={selectedTileId}
              onSelectTile={(t) => setSelectedTileId(t.tile_id)}
              isThinking={isThinking}
              latestThoughts={latestThoughts}
            />
          </div>

          {/* Bottom: Swarm Cognitive Convergence Timeline (Stacked Circle Wave) */}
          <div className="h-[145px] shrink-0">
            <CognitiveTimeline
              tiles={tiles}
              activeTileIds={activeTileIds}
              isThinking={isThinking}
              activeStageIndex={activeStageIndex}
              epochs={epochs}
            />
          </div>

        </div>

      </div>
    </PageContainer>
  );
}
