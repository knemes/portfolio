import { SpectreTileData, CognitiveEpochData } from "./types";

export const INITIAL_SPECTRE_TILES: SpectreTileData[] = [
  {
  "tile_id": "39c6e1834f5403eb684d7d697a77f5c0d5b2e14e1a571e0c7b7b815bd10036b7",
  "header": {
    "index": 0,
    "agent_alias": "GenesisCore",
    "transform": {
      "x": 0.0,
      "y": 0.0,
      "rotation_index": 0,
      "angle_rad": 0.0,
      "angle_deg": 0
    },
    "ml_kem_pk": "5dc0701e78b49d517842319bf60b2ebc...",
    "ml_dsa_pk": "e7adc67fd76681d8e2b32a7cd5d4ffc8...",
    "prompt_commitment": "af7b9eec2de6c45ca3a7b2f45567893274a26b9df2604c97fc869318ec421ad0",
    "timestamp": 1789961267,
    "previous_block_hash": "0"
  },
  "specialization": "ROOT_ORCHESTRATOR",
  "role_description": "Coordinates high-level swarm objectives, goal decomposition, and preserves aperiodic mosaic consensus.",
  "color": "#d97706",
  "geometry": {
    "transform": {
      "x": 0.0,
      "y": 0.0,
      "rotation_index": 0,
      "angle_rad": 0.0,
      "angle_deg": 0
    },
    "vertices": [
      {
        "x": 0.0,
        "y": 0.0
      },
      {
        "x": 1.0,
        "y": 0.0
      },
      {
        "x": 1.5,
        "y": -0.866025
      },
      {
        "x": 2.366025,
        "y": -0.366025
      },
      {
        "x": 2.366025,
        "y": 0.633975
      },
      {
        "x": 3.366025,
        "y": 0.633975
      },
      {
        "x": 3.866025,
        "y": 1.5
      },
      {
        "x": 3.0,
        "y": 2.0
      },
      {
        "x": 2.133975,
        "y": 1.5
      },
      {
        "x": 1.633975,
        "y": 2.366025
      },
      {
        "x": 0.633975,
        "y": 2.366025
      },
      {
        "x": -0.366025,
        "y": 2.366025
      },
      {
        "x": -0.866025,
        "y": 1.5
      },
      {
        "x": 0.0,
        "y": 1.0
      }
    ],
    "centroid": {
      "x": 1.473855,
      "y": 1.045284
    }
  },
  "edge_connections": {
    "13": {
      "neighbor_tile_id": "066e54f42cb9bd8b8b88bc1f809d38da5cf0c27d65b58a1c0e06a511acca77d7",
      "neighbor_edge_idx": 2,
      "neighbor_alias": "CryptoSpecialist"
    },
    "12": {
      "neighbor_tile_id": "066e54f42cb9bd8b8b88bc1f809d38da5cf0c27d65b58a1c0e06a511acca77d7",
      "neighbor_edge_idx": 3,
      "neighbor_alias": "CryptoSpecialist"
    },
    "11": {
      "neighbor_tile_id": "066e54f42cb9bd8b8b88bc1f809d38da5cf0c27d65b58a1c0e06a511acca77d7",
      "neighbor_edge_idx": 4,
      "neighbor_alias": "CryptoSpecialist"
    }
  },
  "status": "ACTIVE"
},
  {
  "tile_id": "066e54f42cb9bd8b8b88bc1f809d38da5cf0c27d65b58a1c0e06a511acca77d7",
  "header": {
    "index": 1,
    "agent_alias": "CryptoSpecialist",
    "transform": {
      "x": -1.5,
      "y": -0.866025,
      "rotation_index": 2,
      "angle_rad": 1.0472,
      "angle_deg": 60
    },
    "ml_kem_pk": "f71a7bf1701f051a4ea8bb9a5f9077e6...",
    "ml_dsa_pk": "07e6eeb804520ce4e82c7e0bca2d5055...",
    "prompt_commitment": "d1b4e89a0cfa6ede8be15dd6099c5c4abea38aaf092b16c3677d28c80300925e",
    "timestamp": 1789961267,
    "previous_block_hash": "39c6e1834f5403eb684d7d697a77f5c0d5b2e14e1a571e0c7b7b815bd10036b7"
  },
  "specialization": "POST_QUANTUM_CRYPTANALYSIS",
  "role_description": "Lattice cryptography defense, ML-KEM-1024 encapsulation checks, and ML-DSA-65 verification.",
  "color": "#4f46e5",
  "geometry": {
    "transform": {
      "x": -1.5,
      "y": -0.866025,
      "rotation_index": 2,
      "angle_rad": 1.0472,
      "angle_deg": 60
    },
    "vertices": [
      {
        "x": -1.5,
        "y": -0.866025
      },
      {
        "x": -1.0,
        "y": 0.0
      },
      {
        "x": 0.0,
        "y": 0.0
      },
      {
        "x": 0.0,
        "y": 1.0
      },
      {
        "x": -0.866025,
        "y": 1.5
      },
      {
        "x": -0.366025,
        "y": 2.366026
      },
      {
        "x": -0.866025,
        "y": 3.232051
      },
      {
        "x": -1.732051,
        "y": 2.732051
      },
      {
        "x": -1.732051,
        "y": 1.732051
      },
      {
        "x": -2.732051,
        "y": 1.732051
      },
      {
        "x": -3.232051,
        "y": 0.866026
      },
      {
        "x": -3.732051,
        "y": 0.0
      },
      {
        "x": -3.232051,
        "y": -0.866025
      },
      {
        "x": -2.366025,
        "y": -0.366025
      }
    ],
    "centroid": {
      "x": -1.668315,
      "y": 0.933013
    }
  },
  "edge_connections": {
    "2": {
      "neighbor_tile_id": "39c6e1834f5403eb684d7d697a77f5c0d5b2e14e1a571e0c7b7b815bd10036b7",
      "neighbor_edge_idx": 13,
      "neighbor_alias": "GenesisCore"
    },
    "3": {
      "neighbor_tile_id": "39c6e1834f5403eb684d7d697a77f5c0d5b2e14e1a571e0c7b7b815bd10036b7",
      "neighbor_edge_idx": 12,
      "neighbor_alias": "GenesisCore"
    },
    "4": {
      "neighbor_tile_id": "39c6e1834f5403eb684d7d697a77f5c0d5b2e14e1a571e0c7b7b815bd10036b7",
      "neighbor_edge_idx": 11,
      "neighbor_alias": "GenesisCore"
    },
    "9": {
      "neighbor_tile_id": "35af1e714206e9911cc4981728e3825730e77228412e604f5f82a17391bf0dae",
      "neighbor_edge_idx": 0,
      "neighbor_alias": "ColonySynthesizer"
    },
    "8": {
      "neighbor_tile_id": "35af1e714206e9911cc4981728e3825730e77228412e604f5f82a17391bf0dae",
      "neighbor_edge_idx": 1,
      "neighbor_alias": "ColonySynthesizer"
    },
    "7": {
      "neighbor_tile_id": "35af1e714206e9911cc4981728e3825730e77228412e604f5f82a17391bf0dae",
      "neighbor_edge_idx": 2,
      "neighbor_alias": "ColonySynthesizer"
    },
    "11": {
      "neighbor_tile_id": "cfd1e3cadbe0618033df5dabfedc5278634a32f546268a66e17d1590736cf38a",
      "neighbor_edge_idx": 0,
      "neighbor_alias": "ThreatAnalyzer"
    },
    "10": {
      "neighbor_tile_id": "cfd1e3cadbe0618033df5dabfedc5278634a32f546268a66e17d1590736cf38a",
      "neighbor_edge_idx": 1,
      "neighbor_alias": "ThreatAnalyzer"
    }
  },
  "status": "ACTIVE"
},
  {
  "tile_id": "35af1e714206e9911cc4981728e3825730e77228412e604f5f82a17391bf0dae",
  "header": {
    "index": 2,
    "agent_alias": "ColonySynthesizer",
    "transform": {
      "x": -3.232051,
      "y": 0.866025,
      "rotation_index": 2,
      "angle_rad": 1.0472,
      "angle_deg": 60
    },
    "ml_kem_pk": "b23886d701b971750fb58304c9cb70a2...",
    "ml_dsa_pk": "cc8c1c45e72c452e00a0816d904a08c3...",
    "prompt_commitment": "0c3aaa3d5d10739dd4a3e45fa82e31a74ffc49b8589ce03522e48de74d977a34",
    "timestamp": 1789961267,
    "previous_block_hash": "066e54f42cb9bd8b8b88bc1f809d38da5cf0c27d65b58a1c0e06a511acca77d7"
  },
  "specialization": "EXECUTIVE_CONSENSUS_SYNTHESIS",
  "role_description": "Synthesizes multi-agent cognitive epochs into final consensus and validates proof provenance.",
  "color": "#059669",
  "geometry": {
    "transform": {
      "x": -3.232051,
      "y": 0.866025,
      "rotation_index": 2,
      "angle_rad": 1.0472,
      "angle_deg": 60
    },
    "vertices": [
      {
        "x": -3.232051,
        "y": 0.866025
      },
      {
        "x": -2.732051,
        "y": 1.73205
      },
      {
        "x": -1.732051,
        "y": 1.73205
      },
      {
        "x": -1.732051,
        "y": 2.73205
      },
      {
        "x": -2.598076,
        "y": 3.23205
      },
      {
        "x": -2.098076,
        "y": 4.098076
      },
      {
        "x": -2.598076,
        "y": 4.964101
      },
      {
        "x": -3.464102,
        "y": 4.464101
      },
      {
        "x": -3.464102,
        "y": 3.464101
      },
      {
        "x": -4.464102,
        "y": 3.464101
      },
      {
        "x": -4.964102,
        "y": 2.598076
      },
      {
        "x": -5.464102,
        "y": 1.73205
      },
      {
        "x": -4.964102,
        "y": 0.866025
      },
      {
        "x": -4.098076,
        "y": 1.366025
      }
    ],
    "centroid": {
      "x": -3.400366,
      "y": 2.665063
    }
  },
  "edge_connections": {
    "0": {
      "neighbor_tile_id": "066e54f42cb9bd8b8b88bc1f809d38da5cf0c27d65b58a1c0e06a511acca77d7",
      "neighbor_edge_idx": 9,
      "neighbor_alias": "CryptoSpecialist"
    },
    "1": {
      "neighbor_tile_id": "066e54f42cb9bd8b8b88bc1f809d38da5cf0c27d65b58a1c0e06a511acca77d7",
      "neighbor_edge_idx": 8,
      "neighbor_alias": "CryptoSpecialist"
    },
    "2": {
      "neighbor_tile_id": "066e54f42cb9bd8b8b88bc1f809d38da5cf0c27d65b58a1c0e06a511acca77d7",
      "neighbor_edge_idx": 7,
      "neighbor_alias": "CryptoSpecialist"
    },
    "13": {
      "neighbor_tile_id": "cfd1e3cadbe0618033df5dabfedc5278634a32f546268a66e17d1590736cf38a",
      "neighbor_edge_idx": 2,
      "neighbor_alias": "ThreatAnalyzer"
    },
    "12": {
      "neighbor_tile_id": "cfd1e3cadbe0618033df5dabfedc5278634a32f546268a66e17d1590736cf38a",
      "neighbor_edge_idx": 3,
      "neighbor_alias": "ThreatAnalyzer"
    },
    "11": {
      "neighbor_tile_id": "cfd1e3cadbe0618033df5dabfedc5278634a32f546268a66e17d1590736cf38a",
      "neighbor_edge_idx": 4,
      "neighbor_alias": "ThreatAnalyzer"
    }
  },
  "status": "ACTIVE"
},
  {
  "tile_id": "cfd1e3cadbe0618033df5dabfedc5278634a32f546268a66e17d1590736cf38a",
  "header": {
    "index": 3,
    "agent_alias": "ThreatAnalyzer",
    "transform": {
      "x": -3.232051,
      "y": -0.866025,
      "rotation_index": 4,
      "angle_rad": 2.0944,
      "angle_deg": 120
    },
    "ml_kem_pk": "b9972f87da9672307acce1663ebaaee0...",
    "ml_dsa_pk": "9981c78377bb953a74302a93ebfb111f...",
    "prompt_commitment": "a87b49b8b481e35dd63f3120fa7b3d19b2deca73ded1068fca006171239e930d",
    "timestamp": 1789961267,
    "previous_block_hash": "35af1e714206e9911cc4981728e3825730e77228412e604f5f82a17391bf0dae"
  },
  "specialization": "BYZANTINE_PERIMETER_DEFENSE",
  "role_description": "Evaluates Byzantine attack surfaces, side-channel vectors, and neighbor airlock quorums.",
  "color": "#e11d48",
  "geometry": {
    "transform": {
      "x": -3.232051,
      "y": -0.866025,
      "rotation_index": 4,
      "angle_rad": 2.0944,
      "angle_deg": 120
    },
    "vertices": [
      {
        "x": -3.232051,
        "y": -0.866025
      },
      {
        "x": -3.732051,
        "y": 0.0
      },
      {
        "x": -3.232051,
        "y": 0.866026
      },
      {
        "x": -4.098076,
        "y": 1.366026
      },
      {
        "x": -4.964102,
        "y": 0.866026
      },
      {
        "x": -5.464102,
        "y": 1.732051
      },
      {
        "x": -6.464102,
        "y": 1.732051
      },
      {
        "x": -6.464102,
        "y": 0.732051
      },
      {
        "x": -5.598076,
        "y": 0.232051
      },
      {
        "x": -6.098076,
        "y": -0.633974
      },
      {
        "x": -5.598076,
        "y": -1.5
      },
      {
        "x": -5.098076,
        "y": -2.366025
      },
      {
        "x": -4.098076,
        "y": -2.366025
      },
      {
        "x": -4.098076,
        "y": -1.366025
      }
    ],
    "centroid": {
      "x": -4.874221,
      "y": -0.112271
    }
  },
  "edge_connections": {
    "0": {
      "neighbor_tile_id": "066e54f42cb9bd8b8b88bc1f809d38da5cf0c27d65b58a1c0e06a511acca77d7",
      "neighbor_edge_idx": 11,
      "neighbor_alias": "CryptoSpecialist"
    },
    "1": {
      "neighbor_tile_id": "066e54f42cb9bd8b8b88bc1f809d38da5cf0c27d65b58a1c0e06a511acca77d7",
      "neighbor_edge_idx": 10,
      "neighbor_alias": "CryptoSpecialist"
    },
    "2": {
      "neighbor_tile_id": "35af1e714206e9911cc4981728e3825730e77228412e604f5f82a17391bf0dae",
      "neighbor_edge_idx": 13,
      "neighbor_alias": "ColonySynthesizer"
    },
    "3": {
      "neighbor_tile_id": "35af1e714206e9911cc4981728e3825730e77228412e604f5f82a17391bf0dae",
      "neighbor_edge_idx": 12,
      "neighbor_alias": "ColonySynthesizer"
    },
    "4": {
      "neighbor_tile_id": "35af1e714206e9911cc4981728e3825730e77228412e604f5f82a17391bf0dae",
      "neighbor_edge_idx": 11,
      "neighbor_alias": "ColonySynthesizer"
    },
    "13": {
      "neighbor_tile_id": "898fef766281fa1272cfd16ad4f69deedb4f2d4a9ac985ea660c2222fb2bd335",
      "neighbor_edge_idx": 2,
      "neighbor_alias": "DataIngestor"
    },
    "12": {
      "neighbor_tile_id": "898fef766281fa1272cfd16ad4f69deedb4f2d4a9ac985ea660c2222fb2bd335",
      "neighbor_edge_idx": 3,
      "neighbor_alias": "DataIngestor"
    },
    "11": {
      "neighbor_tile_id": "898fef766281fa1272cfd16ad4f69deedb4f2d4a9ac985ea660c2222fb2bd335",
      "neighbor_edge_idx": 4,
      "neighbor_alias": "DataIngestor"
    }
  },
  "status": "ACTIVE"
},
  {
  "tile_id": "898fef766281fa1272cfd16ad4f69deedb4f2d4a9ac985ea660c2222fb2bd335",
  "header": {
    "index": 4,
    "agent_alias": "DataIngestor",
    "transform": {
      "x": -1.732051,
      "y": -1.732051,
      "rotation_index": 6,
      "angle_rad": 3.1416,
      "angle_deg": 180
    },
    "ml_kem_pk": "67aca34d540e30bb53a894090217a142...",
    "ml_dsa_pk": "b33168d9fe02ca14e7698345668c1095...",
    "prompt_commitment": "c8944831c6be5e61c47bb277797c019083d1cb6d29d5d018406a641e82bcb6cb",
    "timestamp": 1789961267,
    "previous_block_hash": "cfd1e3cadbe0618033df5dabfedc5278634a32f546268a66e17d1590736cf38a"
  },
  "specialization": "TOPOLOGY_TELEMETRY_INGESTION",
  "role_description": "Processes aperiodic topology telemetry, contact constraints, and gapless neighborhood packing.",
  "color": "#0891b2",
  "geometry": {
    "transform": {
      "x": -1.732051,
      "y": -1.732051,
      "rotation_index": 6,
      "angle_rad": 3.1416,
      "angle_deg": 180
    },
    "vertices": [
      {
        "x": -1.732051,
        "y": -1.732051
      },
      {
        "x": -2.732051,
        "y": -1.732051
      },
      {
        "x": -3.232051,
        "y": -0.866026
      },
      {
        "x": -4.098076,
        "y": -1.366026
      },
      {
        "x": -4.098076,
        "y": -2.366026
      },
      {
        "x": -5.098076,
        "y": -2.366026
      },
      {
        "x": -5.598076,
        "y": -3.232051
      },
      {
        "x": -4.732051,
        "y": -3.732051
      },
      {
        "x": -3.866026,
        "y": -3.232051
      },
      {
        "x": -3.366026,
        "y": -4.098076
      },
      {
        "x": -2.366026,
        "y": -4.098076
      },
      {
        "x": -1.366026,
        "y": -4.098076
      },
      {
        "x": -0.866026,
        "y": -3.232051
      },
      {
        "x": -1.732051,
        "y": -2.732051
      }
    ],
    "centroid": {
      "x": -3.205906,
      "y": -2.777335
    }
  },
  "edge_connections": {
    "2": {
      "neighbor_tile_id": "cfd1e3cadbe0618033df5dabfedc5278634a32f546268a66e17d1590736cf38a",
      "neighbor_edge_idx": 13,
      "neighbor_alias": "ThreatAnalyzer"
    },
    "3": {
      "neighbor_tile_id": "cfd1e3cadbe0618033df5dabfedc5278634a32f546268a66e17d1590736cf38a",
      "neighbor_edge_idx": 12,
      "neighbor_alias": "ThreatAnalyzer"
    },
    "4": {
      "neighbor_tile_id": "cfd1e3cadbe0618033df5dabfedc5278634a32f546268a66e17d1590736cf38a",
      "neighbor_edge_idx": 11,
      "neighbor_alias": "ThreatAnalyzer"
    }
  },
  "status": "ACTIVE"
},
];

export const INITIAL_COGNITIVE_EPOCHS: CognitiveEpochData[] = [
];
