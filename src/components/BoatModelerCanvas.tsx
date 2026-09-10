import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { KayakParameters } from "../kayakGeometry/types";
import { KayakBuilder } from "../kayakGeometry/KayakBuilder";

interface BoatModelerCanvasProps {
  params: KayakParameters;
  builder: KayakBuilder | null;
  viewMode: "perspective" | "plan" | "side";
  showPhysics: boolean;
  showRibs: boolean;
  showDimensions: boolean;
  draft: number;
  vcb: number;
  lcb: number;
  isDrawingActive?: boolean;
}

// Technical Sprite Text for CAD labels
function createTextSprite(text: string, colorStr = "#1A1A1A", fontSize = 22): THREE.Sprite {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `bold ${fontSize}px "JetBrains Mono", monospace`;
    ctx.fillStyle = colorStr;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(16, 4, 1);
  return sprite;
}

export default function BoatModelerCanvas({
  params,
  builder,
  viewMode,
  showPhysics,
  showRibs,
  showDimensions,
  draft,
  vcb,
  lcb,
  isDrawingActive = false,
}: BoatModelerCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  const paramsRef = useRef(params);
  paramsRef.current = params;
  const builderRef = useRef(builder);
  builderRef.current = builder;

  const draftRef = useRef(draft);
  draftRef.current = draft;
  const vcbRef = useRef(vcb);
  vcbRef.current = vcb;
  const lcbRef = useRef(lcb);
  lcbRef.current = lcb;

  const showPhysicsRef = useRef(showPhysics);
  showPhysicsRef.current = showPhysics;
  const showRibsRef = useRef(showRibs);
  showRibsRef.current = showRibs;
  const showDimensionsRef = useRef(showDimensions);
  showDimensionsRef.current = showDimensions;

  const viewModeRef = useRef(viewMode);
  viewModeRef.current = viewMode;

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const pCameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const oCameraRef = useRef<THREE.OrthographicCamera | null>(null);

  const kayakGroupRef = useRef<THREE.Group>(new THREE.Group());
  const sternSpriteRef = useRef<THREE.Sprite | null>(null);
  const bowSpriteRef = useRef<THREE.Sprite | null>(null);

  // 1. Initialize Scene & Renderer
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeae7df);
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0xeae7df, 0.0014);

    const w = mountRef.current.clientWidth || 600;
    const h = mountRef.current.clientHeight || 450;

    const pCamera = new THREE.PerspectiveCamera(38, w / h, 1, 1000);
    pCamera.position.set(135, 75, 140);
    pCameraRef.current = pCamera;

    const oCamera = new THREE.OrthographicCamera(w / -4, w / 4, h / 4, h / -4, 1, 1000);
    oCamera.position.set(0, 160, 0);
    oCameraRef.current = oCamera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(pCamera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 25;
    controls.maxDistance = 420;
    controlsRef.current = controls;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffdfa, 0.85);
    keyLight.position.set(80, 160, 60);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf5ede4, 0.4);
    fillLight.position.set(-80, 60, -60);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xe8f0f8, 0.3);
    rimLight.position.set(0, -50, 0);
    scene.add(rimLight);

    // Drafting grid floor
    const gridHelper = new THREE.GridHelper(320, 32, 0x8a928c, 0xc5cbbf);
    gridHelper.position.y = 0;
    const gridMat = gridHelper.material as THREE.LineBasicMaterial;
    gridMat.transparent = true;
    gridMat.depthWrite = false;
    gridMat.opacity = 0.45;
    scene.add(gridHelper);

    // Axis indicator
    const axesHelper = new THREE.AxesHelper(14);
    axesHelper.position.set(-140, -0.5, -40);
    scene.add(axesHelper);

    // Bow & Stern text sprites
    const sternSprite = createTextSprite("STERN", "#d9534f", 24);
    scene.add(sternSprite);
    sternSpriteRef.current = sternSprite;

    const bowSprite = createTextSprite("BOW", "#337ab7", 24);
    scene.add(bowSprite);
    bowSpriteRef.current = bowSprite;

    // Group for boat geometry
    scene.add(kayakGroupRef.current);

    // Initial rebuild
    rebuildGeometries();

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const widthVal = entry.contentRect.width || mountRef.current?.clientWidth || 600;
        const heightVal = entry.contentRect.height || mountRef.current?.clientHeight || 450;

        if (rendererRef.current) {
          rendererRef.current.setSize(widthVal, heightVal);
        }
        if (pCameraRef.current) {
          pCameraRef.current.aspect = widthVal / heightVal;
          pCameraRef.current.updateProjectionMatrix();
        }
        if (oCameraRef.current) {
          oCameraRef.current.left = widthVal / -4;
          oCameraRef.current.right = widthVal / 4;
          oCameraRef.current.top = heightVal / 4;
          oCameraRef.current.bottom = heightVal / -4;
          oCameraRef.current.updateProjectionMatrix();
        }
      }
    });

    if (mountRef.current) {
      resizeObserver.observe(mountRef.current);
    }

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const activeCamera = viewModeRef.current === "perspective" ? pCamera : oCamera;

      if (viewModeRef.current === "perspective") {
        controls.update();
      }

      renderer.render(scene, activeCamera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      if (rendererRef.current?.domElement) {
        rendererRef.current.domElement.remove();
      }
      controls.dispose();
    };
  }, []);

  // Update controls enabled state depending on sketch mode
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enabled = !isDrawingActive;
    }
  }, [isDrawingActive]);

  // Handle camera view modes
  useEffect(() => {
    if (!controlsRef.current || !pCameraRef.current || !oCameraRef.current) return;

    if (viewMode === "plan") {
      oCameraRef.current.position.set(0, 160, 0);
      oCameraRef.current.lookAt(0, 0, 0);
      oCameraRef.current.zoom = 2.2;
      oCameraRef.current.updateProjectionMatrix();
    } else if (viewMode === "side") {
      oCameraRef.current.position.set(0, 0, 160);
      oCameraRef.current.lookAt(0, 0, 0);
      oCameraRef.current.zoom = 2.2;
      oCameraRef.current.updateProjectionMatrix();
    } else {
      controlsRef.current.target.set(0, params.hullHeight / 3, 0);
      controlsRef.current.update();
    }
  }, [viewMode, params.length, params.hullHeight]);

  // Rebuild geometries on param or builder change
  useEffect(() => {
    rebuildGeometries();
  }, [builder, params, showPhysics, showRibs, showDimensions, draft, vcb, lcb]);

  const rebuildGeometries = () => {
    const group = kayakGroupRef.current;
    const currentBuilder = builderRef.current;
    if (!group || !currentBuilder) return;

    // Clear old elements
    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    const currentParams = paramsRef.current;
    const L = currentParams.length * 12;
    const halfL = L / 2;

    // Update Bow and Stern markers
    if (sternSpriteRef.current) {
      sternSpriteRef.current.position.set(-halfL - 8, currentParams.hullHeight + 4, 0);
    }
    if (bowSpriteRef.current) {
      bowSpriteRef.current.position.set(halfL + 8, currentParams.hullHeight + 4, 0);
    }

    // Material palette matching the architectural sketchbook theme
    const hullMaterial = new THREE.MeshStandardMaterial({
      color: 0xadb6b0, // Satin slate / silver birch
      roughness: 0.32,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });

    const deckMaterial = new THREE.MeshStandardMaterial({
      color: 0xe0e6e1, // Off-white clay / chalk
      roughness: 0.36,
      metalness: 0.04,
      side: THREE.DoubleSide,
    });

    const technicalLineMaterial = new THREE.LineBasicMaterial({
      color: 0x1a1a1a, // Deep charcoal ink
      linewidth: 1.5,
      transparent: true,
      opacity: 0.85,
    });

    try {
      // 1. Hull Surface Mesh
      const hullData = currentBuilder.generateHullMesh();
      const hullGeo = new THREE.BufferGeometry();
      hullGeo.setAttribute("position", new THREE.BufferAttribute(hullData.vertices, 3));
      hullGeo.setAttribute("uv", new THREE.BufferAttribute(hullData.uvs, 2));

      const posAttr = hullGeo.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        posAttr.setX(i, posAttr.getX(i) - halfL);
      }
      hullGeo.setIndex(new THREE.BufferAttribute(hullData.indices, 1));
      hullGeo.computeVertexNormals();

      const hullMesh = new THREE.Mesh(hullGeo, hullMaterial);
      hullMesh.castShadow = true;
      hullMesh.receiveShadow = true;
      group.add(hullMesh);

      // 2. Deck Surface Mesh
      const deckData = currentBuilder.generateDeckMesh();
      const deckGeo = new THREE.BufferGeometry();
      deckGeo.setAttribute("position", new THREE.BufferAttribute(deckData.vertices, 3));
      deckGeo.setAttribute("uv", new THREE.BufferAttribute(deckData.uvs, 2));

      const dPosAttr = deckGeo.attributes.position;
      for (let i = 0; i < dPosAttr.count; i++) {
        dPosAttr.setX(i, dPosAttr.getX(i) - halfL);
      }
      deckGeo.setIndex(new THREE.BufferAttribute(deckData.indices, 1));
      deckGeo.computeVertexNormals();

      const deckMesh = new THREE.Mesh(deckGeo, deckMaterial);
      deckMesh.castShadow = true;
      deckMesh.receiveShadow = true;
      group.add(deckMesh);

      // 3. Cockpit Coaming
      const sternDeckZ = currentBuilder.sternDeckZ;
      const getGunwaleAndDeckHeight = (xVal: number) => {
        const gunLeft = currentBuilder.gunwale.getLeftPointAtX(xVal);
        const dPtUntrimmed = currentBuilder.deckLine.getUntrimmedPointAtX(xVal);
        const planeZ = sternDeckZ + xVal * currentBuilder.slope;
        const yFlat = currentBuilder.getFlatPlaneWidth(xVal, planeZ, Math.abs(gunLeft.y), dPtUntrimmed.z);
        return {
          gunwaleY: Math.abs(gunLeft.y),
          gunwaleZ: gunLeft.z,
          deckZ: dPtUntrimmed.z,
          yFlat,
        };
      };

      const coamingData = currentBuilder.cockpit.generateCoamingMesh(
        currentParams,
        sternDeckZ,
        currentBuilder.slope,
        halfL,
        getGunwaleAndDeckHeight,
        currentBuilder.facetOutlineCurve
      );

      const coamingGeo = new THREE.BufferGeometry();
      coamingGeo.setAttribute("position", new THREE.BufferAttribute(coamingData.vertices, 3));
      coamingGeo.setIndex(new THREE.BufferAttribute(coamingData.indices, 1));
      coamingGeo.computeVertexNormals();

      const coamingMaterial = new THREE.MeshStandardMaterial({
        color: 0x3d2719, // Walnut wood tone
        roughness: 0.35,
        metalness: 0.08,
        side: THREE.DoubleSide,
      });

      const coamingMesh = new THREE.Mesh(coamingGeo, coamingMaterial);
      coamingMesh.castShadow = true;
      coamingMesh.receiveShadow = true;
      group.add(coamingMesh);

      // 4. CAD Wireframe Curves
      const divs = 60;
      // Keel
      const keelPoints: THREE.Vector3[] = [];
      for (let i = 0; i <= divs; i++) {
        const x = (i / divs) * L;
        const pt = currentBuilder.keel.getPointAtX(x);
        keelPoints.push(new THREE.Vector3(pt.x - halfL, pt.z, pt.y));
      }
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(keelPoints), technicalLineMaterial));

      // Gunwales
      const glPoints: THREE.Vector3[] = [];
      const grPoints: THREE.Vector3[] = [];
      for (let i = 0; i <= divs; i++) {
        const x = (i / divs) * L;
        const ptl = currentBuilder.gunwale.getLeftPointAtX(x);
        const ptr = currentBuilder.gunwale.getRightPointAtX(x);
        glPoints.push(new THREE.Vector3(ptl.x - halfL, ptl.z, ptl.y));
        grPoints.push(new THREE.Vector3(ptr.x - halfL, ptr.z, ptr.y));
      }
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(glPoints), technicalLineMaterial));
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(grPoints), technicalLineMaterial));

      // Deck Centerline
      const dcPoints: THREE.Vector3[] = [];
      for (let i = 0; i <= divs; i++) {
        const x = (i / divs) * L;
        const pt = currentBuilder.deckLine.getPointAtX(x);
        dcPoints.push(new THREE.Vector3(pt.x - halfL, pt.z, pt.y));
      }
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(dcPoints), technicalLineMaterial));

      // 5. Rib Stations
      if (showRibsRef.current) {
        const stations = currentBuilder.generateStations(0);
        const ribMat = new THREE.LineBasicMaterial({ color: 0x111614, linewidth: 2 });
        stations.forEach((st) => {
          const xOffset = st.x - halfL;
          const pts = st.closedProfile.map((p) => new THREE.Vector3(xOffset, p.z, p.y));
          group.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), ribMat));
        });
      }

      // 6. Physics Overlays (Waterplane & Stability)
      if (showPhysicsRef.current) {
        const activeDraft = draftRef.current;
        const planeLength = Math.max(260, L * 1.35);
        const planeWidth = Math.max(65, currentParams.beam * 2.8);

        const wlGeo = new THREE.PlaneGeometry(planeLength, planeWidth);
        const wlMat = new THREE.MeshBasicMaterial({
          color: 0x5a9be5,
          transparent: true,
          opacity: 0.12,
          depthWrite: false,
          side: THREE.DoubleSide,
        });
        const wlMesh = new THREE.Mesh(wlGeo, wlMat);
        wlMesh.rotation.x = -Math.PI / 2;
        wlMesh.position.set(0, activeDraft, 0);
        group.add(wlMesh);

        // Center of Buoyancy marker
        const cbGeo = new THREE.SphereGeometry(1.2, 16, 16);
        const cbMat = new THREE.MeshBasicMaterial({ color: 0x2e7d32 });
        const cbMarker = new THREE.Mesh(cbGeo, cbMat);
        cbMarker.position.set(lcbRef.current - halfL, vcbRef.current, 0);
        group.add(cbMarker);

        // Center of Gravity marker
        const paddlerKG = 7.2;
        const kayakKG = currentParams.hullHeight * 0.45;
        const cgZ = (180 * paddlerKG + 45 * kayakKG) / (180 + 45);

        const cgGeo = new THREE.SphereGeometry(1.2, 16, 16);
        const cgMat = new THREE.MeshBasicMaterial({ color: 0xd84315 });
        const cgMarker = new THREE.Mesh(cgGeo, cgMat);
        cgMarker.position.set(lcbRef.current - halfL, cgZ, 0);
        group.add(cgMarker);

        // Stability Vector
        const vectorPoints = [
          new THREE.Vector3(lcbRef.current - halfL, vcbRef.current, 0),
          new THREE.Vector3(lcbRef.current - halfL, cgZ, 0),
        ];
        const vectorGeo = new THREE.BufferGeometry().setFromPoints(vectorPoints);
        const vectorMat = new THREE.LineDashedMaterial({
          color: 0x1a1a1a,
          dashSize: 0.8,
          gapSize: 0.4,
          linewidth: 1.5,
        });
        const vectorLine = new THREE.Line(vectorGeo, vectorMat);
        vectorLine.computeLineDistances();
        group.add(vectorLine);
      }
    } catch (err) {
      console.error("Error building 3D boat geometries:", err);
    }
  };

  return (
    <div
      ref={mountRef}
      className="w-full h-full relative overflow-hidden rounded-none border border-[#1A1A1A]/10 bg-[#EAE7DF] cursor-grab active:cursor-grabbing select-none"
    >
      {/* Drafting frame boundary markers */}
      <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[#1A1A1A]/30 pointer-events-none z-10" />
      <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[#1A1A1A]/30 pointer-events-none z-10" />
      <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-[#1A1A1A]/30 pointer-events-none z-10" />
      <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-[#1A1A1A]/30 pointer-events-none z-10" />

      {/* Floating HUD status indicator */}
      <div className="absolute top-3 left-3 pointer-events-none font-mono text-[9px] text-[#1A1A1A]/60 flex items-center gap-2 z-10">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
        <span className="font-bold tracking-wider">RHINO_WASM::NURBS_ACTIVE</span>
        <span className="opacity-40">|</span>
        <span className="uppercase">{viewMode} CAMERA</span>
      </div>

      <div className="absolute bottom-3 right-3 pointer-events-none font-mono text-[8px] text-[#1A1A1A]/40 uppercase tracking-wider z-10">
        DRAG TO ORBIT • SCROLL TO ZOOM
      </div>
    </div>
  );
}
