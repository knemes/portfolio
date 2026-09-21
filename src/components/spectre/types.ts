export interface SpectreVertex {
  x: number;
  y: number;
}

export interface SpectreTransform {
  x: number;
  y: number;
  rotation_index: number;
  angle_rad: number;
  angle_deg: number;
}

export interface EdgeConnection {
  neighbor_tile_id: string;
  neighbor_edge_idx: number;
  neighbor_alias: string;
}

export interface SpectreTileData {
  tile_id: string;
  header: {
    index: number;
    agent_alias: string;
    transform: SpectreTransform;
    ml_kem_pk: string;
    ml_dsa_pk: string;
    prompt_commitment: string;
    timestamp: number;
    previous_block_hash: string;
  };
  specialization: string;
  role_description: string;
  color: string;
  geometry: {
    transform: SpectreTransform;
    vertices: SpectreVertex[];
    centroid: SpectreVertex;
  };
  edge_connections: Record<number, EdgeConnection>;
  status: "ACTIVE" | "QUARANTINED" | "HIBERNATED";
}

export interface CognitiveEpochData {
  epoch_hash: string;
  agent_tile_id: string;
  agent_alias: string;
  epoch_index: number;
  category: string;
  summary: string;
  detailed_reasoning: string;
  timestamp: number;
  dual_kem_status: string;
  dsa_signature_stamp: string;
  prev_epoch_hash: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "swarm";
  agent_alias?: string;
  text: string;
  timestamp: number;
  activeTileIds?: string[];
  epochsGenerated?: CognitiveEpochData[];
}
