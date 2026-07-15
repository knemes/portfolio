import { useEffect, useRef, useState, PointerEvent } from "react";
import * as THREE from "three";
import { Play, Pause, RefreshCw, Layers, Zap } from "lucide-react";

type GeometryType = "torus-knot" | "icosahedron" | "box" | "cylinder" | "octahedron";

export default function ThreeCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const wireframeRef = useRef<THREE.LineSegments | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);

  const [geomType, setGeomType] = useState<GeometryType>("torus-knot");
  const [wireframeOnly, setWireframeOnly] = useState<boolean>(false);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [rotationSpeed, setRotationSpeed] = useState<number>(1);
  const [colorTheme, setColorTheme] = useState<string>("#3b82f6"); // blue

  // Pointer state for drag rotation
  const isDragging = useRef(false);
  const previousPointerPosition = useRef({ x: 0, y: 0 });

  // Handle building/rebuilding geometries
  const createGeometry = (type: GeometryType): THREE.BufferGeometry => {
    switch (type) {
      case "torus-knot":
        return new THREE.TorusKnotGeometry(1.6, 0.5, 120, 16);
      case "icosahedron":
        return new THREE.IcosahedronGeometry(2.2, 1);
      case "box":
        return new THREE.BoxGeometry(2.2, 2.2, 2.2, 6, 6, 6);
      case "cylinder":
        return new THREE.CylinderGeometry(1.5, 1.5, 3.2, 32, 8);
      case "octahedron":
        return new THREE.OctahedronGeometry(2.4, 0);
      default:
        return new THREE.TorusKnotGeometry(1.5, 0.4, 100, 16);
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Setup Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.z = 8;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. Add Ambient and Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    dirLight2.position.set(-5, -5, 2);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xffffff, 0.8, 15);
    pointLight.position.set(0, 0, 4);
    scene.add(pointLight);

    // 3. Setup Group to hold meshes and rotate them
    const group = new THREE.Group();
    scene.add(group);
    groupRef.current = group;

    // 4. Create and Add Geometry
    updateMesh(geomType, colorTheme, wireframeOnly);

    // 5. Animation loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (groupRef.current && isRotating && !isDragging.current) {
        groupRef.current.rotation.y += 0.005 * rotationSpeed;
        groupRef.current.rotation.x += 0.002 * rotationSpeed;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // 6. Handle resizing
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      if (width === 0 || height === 0) return;

      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
      }
    });
    resizeObserver.observe(containerRef.current);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Update mesh geometry/material when options change
  const updateMesh = (type: GeometryType, themeColor: string, wireOnly: boolean) => {
    const scene = sceneRef.current;
    const group = groupRef.current;
    if (!scene || !group) return;

    // Remove existing meshes from group
    if (meshRef.current) group.remove(meshRef.current);
    if (wireframeRef.current) group.remove(wireframeRef.current);

    const geometry = createGeometry(type);

    const colorVal = new THREE.Color(themeColor);

    if (wireOnly) {
      // Wireframe geometry only
      const wireframeGeom = new THREE.WireframeGeometry(geometry);
      const wireMaterial = new THREE.LineBasicMaterial({
        color: colorVal,
        linewidth: 1.5,
        transparent: true,
        opacity: 0.85,
      });
      const wireframe = new THREE.LineSegments(wireframeGeom, wireMaterial);
      group.add(wireframe);
      wireframeRef.current = wireframe;
      meshRef.current = null;
    } else {
      // Double layer: translucent solid body + darker wireframe contour lines
      const solidMaterial = new THREE.MeshPhongMaterial({
        color: colorVal,
        shininess: 80,
        specular: 0x444444,
        transparent: true,
        opacity: 0.7,
        flatShading: type !== "torus-knot",
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geometry, solidMaterial);
      group.add(mesh);
      meshRef.current = mesh;

      const wireframeGeom = new THREE.WireframeGeometry(geometry);
      const wireMaterial = new THREE.LineBasicMaterial({
        color: 0x1f2937, // deep charcoal
        transparent: true,
        opacity: 0.45,
      });
      const wireframe = new THREE.LineSegments(wireframeGeom, wireMaterial);
      group.add(wireframe);
      wireframeRef.current = wireframe;
    }
  };

  // Re-run updateMesh whenever type, color, or wireframe changes
  useEffect(() => {
    updateMesh(geomType, colorTheme, wireframeOnly);
  }, [geomType, colorTheme, wireframeOnly]);

  // Pointer interaction handlers for manual rotation on drag
  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    previousPointerPosition.current = { x: e.clientX, y: e.clientY };
    containerRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !groupRef.current) return;

    const deltaX = e.clientX - previousPointerPosition.current.x;
    const deltaY = e.clientY - previousPointerPosition.current.y;

    groupRef.current.rotation.y += deltaX * 0.008;
    groupRef.current.rotation.x += deltaY * 0.008;

    previousPointerPosition.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    isDragging.current = false;
    containerRef.current?.releasePointerCapture(e.pointerId);
  };

  const colors = [
    { name: "Ink Blue", hex: "#3b82f6" },
    { name: "Marker Red", hex: "#ef4444" },
    { name: "Teal Mint", hex: "#0d9488" },
    { name: "Violet Ink", hex: "#8b5cf6" },
    { name: "Pencil Lead", hex: "#4b5563" },
  ];

  return (
    <div className="relative w-full h-[360px] md:h-[420px] rounded-2xl bg-white/40 border border-stone-200/50 shadow-inner flex flex-col justify-between overflow-hidden">
      
      {/* 3D Viewport container */}
      <div
        id="threejs-viewport"
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="w-full h-full cursor-grab active:cursor-grabbing relative"
      >
        <div className="absolute top-4 left-4 pointer-events-none">
          <span className="text-[10px] font-mono tracking-wider text-stone-400 bg-stone-100/80 px-2 py-0.5 rounded uppercase border border-stone-200/50">
            Three.js WebGL Sandbox
          </span>
          <h4 className="text-stone-800 font-sans font-medium text-sm mt-1 uppercase tracking-tight">
            {geomType.replace("-", " ")}
          </h4>
        </div>

        <div className="absolute top-4 right-4 pointer-events-none flex flex-col items-end gap-1 font-mono text-[10px] text-stone-400">
          <span>DRAG TO ROTATE MODEL</span>
          <span>SCALED RENDER-LOOP ACTIVE</span>
        </div>
      </div>

      {/* Control bar */}
      <div className="absolute bottom-4 left-4 right-4 bg-white/85 backdrop-blur-md border border-stone-200/80 rounded-xl p-3 shadow-md z-30 flex flex-wrap gap-4 items-center justify-between">
        
        {/* Geometry Selector */}
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-stone-500" />
          <span className="text-xs font-mono text-stone-500 mr-1.5 hidden sm:inline">Shape:</span>
          <div className="flex rounded-md bg-stone-100 p-0.5 border border-stone-200/60">
            {(["torus-knot", "icosahedron", "box", "octahedron"] as GeometryType[]).map((type) => (
              <button
                id={`btn-geom-${type}`}
                key={type}
                onClick={() => setGeomType(type)}
                className={`text-[10px] font-mono px-2 py-1 rounded capitalize transition-all ${
                  geomType === type
                    ? "bg-white text-stone-800 shadow-sm font-semibold"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                {type.split("-")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Color themes */}
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-stone-500" />
          <span className="text-xs font-mono text-stone-500 mr-1.5 hidden sm:inline">Hue:</span>
          <div className="flex gap-1">
            {colors.map((c) => (
              <button
                id={`btn-color-${c.hex}`}
                key={c.hex}
                onClick={() => setColorTheme(c.hex)}
                className={`w-4.5 h-4.5 rounded-full border transition-all ${
                  colorTheme === c.hex
                    ? "scale-110 border-stone-800 ring-2 ring-stone-200"
                    : "border-transparent hover:scale-105"
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        {/* Play/Pause & Wireframe controls */}
        <div className="flex items-center gap-2 border-l border-stone-200/80 pl-4 ml-auto">
          <button
            id="btn-toggle-wireframe"
            onClick={() => setWireframeOnly(!wireframeOnly)}
            className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 ${
              wireframeOnly
                ? "bg-stone-800 border-stone-800 text-white"
                : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
            }`}
            title="Toggle Wireframe Mode"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono font-medium hidden xs:inline">Wireframe</span>
          </button>

          <button
            id="btn-toggle-rotation"
            onClick={() => setIsRotating(!isRotating)}
            className={`p-1.5 rounded-lg border transition-all ${
              isRotating
                ? "bg-green-50 border-green-200 text-green-600"
                : "bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100"
            }`}
            title={isRotating ? "Pause Auto-Rotation" : "Start Auto-Rotation"}
          >
            {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          {isRotating && (
            <button
              id="btn-change-speed"
              onClick={() => setRotationSpeed((prev) => (prev >= 3 ? 0.5 : prev + 0.75))}
              className="p-1.5 rounded-lg border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 text-[10px] font-mono flex items-center gap-1"
              title="Change rotation speed"
            >
              <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: `${4 / rotationSpeed}s` }} />
              <span>{rotationSpeed.toFixed(1)}x</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
