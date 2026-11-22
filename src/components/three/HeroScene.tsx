import * as React from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

import { useTheme } from "@/components/layout/ThemeProvider";

/**
 * The territory.
 *
 * A city plate built from instanced boxes, a route traced across it, and a
 * vehicle pin riding the route with a geofence sitting on its path. Every
 * shape is a primitive: nothing is downloaded, and the whole scene stays
 * under forty draw calls.
 */

const CURVE_POINTS: [number, number][] = [
  [-9.2, 5.6],
  [-5.4, 5.6],
  [-5.4, 1.8],
  [-1.2, 1.8],
  [-1.2, -1.6],
  [3.4, -1.6],
  [3.4, -5.0],
  [8.6, -5.0],
];

const ZONE_AT = 0.56;

function useRouteCurve() {
  return React.useMemo(() => {
    const pts = CURVE_POINTS.map(([x, z]) => new THREE.Vector3(x, 0.06, z));
    const curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.03);
    return curve;
  }, []);
}

type Palette = {
  block: string;
  blockAlt: string;
  ground: string;
  route: string;
  grid: string;
  fog: string;
  /* The car is deliberately NOT route-coloured: a cyan car on a cyan route
     reads as one glowing smear. Near-white paint separates it from the road
     and from the city, and is what a real vehicle would look like anyway. */
  carBody: string;
  carGlass: string;
  carTyre: string;
  carRim: string;
};

const PALETTES: Record<"dark" | "light", Palette> = {
  dark: {
    block: "#110A66",
    blockAlt: "#1B1192",
    ground: "#04003A",
    route: "#22D3EE",
    grid: "#1D1470",
    fog: "#04003A",
    carBody: "#DCE4F2",
    carGlass: "#0A0620",
    carTyre: "#070414",
    carRim: "#8E9BD6",
  },
  light: {
    block: "#DDE2F2",
    blockAlt: "#C9D1EA",
    ground: "#F2F4FB",
    route: "#0891B2",
    grid: "#CDD4EA",
    fog: "#F7F8FC",
    carBody: "#FFFFFF",
    carGlass: "#2A2F45",
    carTyre: "#1C2033",
    carRim: "#9AA3BF",
  },
};

/* Headlamps and tail lamps are the same in both themes — at this scale the
   two warm points at the nose and two red at the tail are what actually
   tell the eye "car", more than any amount of body detail. */
const LAMP_HEAD = "#FFF4D6";
const LAMP_TAIL = "#FF4D5E";

/* ------------------------------------------------------------------ */

function City({ palette, curve }: { palette: Palette; curve: THREE.CatmullRomCurve3 }) {
  const ref = React.useRef<THREE.InstancedMesh>(null);

  const blocks = React.useMemo(() => {
    // Sample the route so no block is built on top of it.
    const samples = curve.getSpacedPoints(160);
    const out: { x: number; z: number; h: number; tall: boolean }[] = [];
    const dummySeed = (x: number, z: number) => {
      // Deterministic pseudo-random: the skyline is the same every load.
      const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453;
      return s - Math.floor(s);
    };

    for (let gx = -10; gx <= 10; gx += 1.7) {
      for (let gz = -7; gz <= 7; gz += 1.7) {
        const near = samples.some((p) => Math.abs(p.x - gx) < 1.25 && Math.abs(p.z - gz) < 1.25);
        if (near) continue;
        const r = dummySeed(gx, gz);
        if (r < 0.22) continue;
        const h = 0.22 + r * 1.35;
        out.push({ x: gx, z: gz, h, tall: r > 0.78 });
      }
    }
    return out;
  }, [curve]);

  React.useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const color = new THREE.Color();
    blocks.forEach((b, i) => {
      m.makeScale(1.18, b.h, 1.18);
      m.setPosition(b.x, b.h / 2, b.z);
      mesh.setMatrixAt(i, m);
      mesh.setColorAt(i, color.set(b.tall ? palette.blockAlt : palette.block));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [blocks, palette]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, blocks.length]} castShadow={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshLambertMaterial />
    </instancedMesh>
  );
}

function Route({
  curve,
  palette,
  drawn,
}: {
  curve: THREE.CatmullRomCurve3;
  palette: Palette;
  drawn: React.MutableRefObject<number>;
}) {
  const core = React.useRef<THREE.Mesh>(null);
  const halo = React.useRef<THREE.Mesh>(null);

  const geo = React.useMemo(() => new THREE.TubeGeometry(curve, 220, 0.075, 8, false), [curve]);
  const haloGeo = React.useMemo(() => new THREE.TubeGeometry(curve, 220, 0.21, 8, false), [curve]);
  const total = geo.index?.count ?? 0;
  const haloTotal = haloGeo.index?.count ?? 0;

  useFrame(() => {
    const t = drawn.current;
    core.current?.geometry.setDrawRange(0, Math.floor(total * t));
    halo.current?.geometry.setDrawRange(0, Math.floor(haloTotal * t));
  });

  return (
    <group>
      <mesh ref={halo} geometry={haloGeo}>
        <meshBasicMaterial
          color={palette.route}
          transparent
          opacity={0.14}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={core} geometry={geo}>
        <meshBasicMaterial color={palette.route} />
      </mesh>
    </group>
  );
}

function Zone({ curve, palette }: { curve: THREE.CatmullRomCurve3; palette: Palette }) {
  const ref = React.useRef<THREE.Group>(null);
  const at = React.useMemo(() => curve.getPointAt(ZONE_AT), [curve]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const pulse = 1 + Math.sin(clock.elapsedTime * 1.4) * 0.04;
    ref.current.scale.set(pulse, 1, pulse);
  });

  return (
    <group ref={ref} position={[at.x, 0, at.z]}>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 1, 48, 1, true]} />
        <meshBasicMaterial color={palette.route} transparent opacity={0.09} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.46, 1.5, 48]} />
        <meshBasicMaterial color={palette.route} transparent opacity={0.65} />
      </mesh>
    </group>
  );
}

/* Car dimensions. The profile below is drawn at 1.05 long, then the whole
   car is scaled by CAR_SCALE — so this one number is the only thing to
   touch if it sits wrong against the city (a block is 1.18 across). At 0.78
   the car is roughly two-thirds of a block long, which reads as a vehicle on
   a street rather than a lorry parked between houses. */
const CAR_SCALE = 0.78;
const CAR_LENGTH = 1.05;
const CAR_WIDTH = 0.46;
const WHEEL_R = 0.1;
const SILL_Y = 0.062; // lifts the body so the wheels carry it
const PROFILE_SQUASH = 0.88; // flattens the silhouette into a saloon stance

/**
 * The car body, built from its side profile.
 *
 * Drawing the silhouette once and extruding it across the width is what
 * makes this read as a car rather than as stacked boxes: bonnet, raked
 * screen, roof and fast rear all come from a single outline. The shape is
 * drawn with length on X and height on Y, then rotated so length runs down
 * +Z — the direction `Vehicle` already points along the route tangent.
 */
function buildBodyGeometry() {
  const s = new THREE.Shape();
  s.moveTo(0.055, 0.015);
  s.lineTo(0.012, 0.055);
  s.lineTo(0.004, 0.145);
  s.quadraticCurveTo(0.004, 0.198, 0.06, 0.206); // bootlid lip
  s.lineTo(0.17, 0.212);
  s.quadraticCurveTo(0.285, 0.222, 0.345, 0.302); // rear screen
  s.lineTo(0.63, 0.306); // roof
  s.quadraticCurveTo(0.735, 0.304, 0.815, 0.218); // windscreen
  s.lineTo(0.9, 0.196); // bonnet
  s.quadraticCurveTo(1.012, 0.19, 1.042, 0.135); // nose crown
  s.lineTo(1.048, 0.062);
  s.quadraticCurveTo(1.03, 0.016, 0.962, 0.012); // front bumper
  s.lineTo(0.055, 0.015); // sill

  const depth = CAR_WIDTH - 0.04;
  const geo = new THREE.ExtrudeGeometry(s, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.022,
    bevelSegments: 2,
    curveSegments: 10,
  });
  geo.scale(1, PROFILE_SQUASH, 1);
  geo.translate(-CAR_LENGTH / 2, 0, -depth / 2);
  geo.rotateY(-Math.PI / 2);
  geo.computeVertexNormals();
  return geo;
}

/** The window band, extruded a hair wider than the body so it reads from the side. */
function buildGlassGeometry() {
  const s = new THREE.Shape();
  s.moveTo(0.2, 0.205);
  s.quadraticCurveTo(0.295, 0.215, 0.352, 0.292);
  s.lineTo(0.625, 0.296);
  s.quadraticCurveTo(0.725, 0.294, 0.8, 0.212);
  s.lineTo(0.2, 0.205);

  const depth = CAR_WIDTH + 0.005;
  const geo = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 10 });
  geo.scale(1, PROFILE_SQUASH, 1);
  geo.translate(-CAR_LENGTH / 2, 0, -depth / 2);
  geo.rotateY(-Math.PI / 2);
  geo.computeVertexNormals();
  return geo;
}

/** The tracked vehicle: a saloon riding the route, nose down the tangent. */
function Vehicle({
  curve,
  palette,
  drawn,
  travel,
}: {
  curve: THREE.CatmullRomCurve3;
  palette: Palette;
  drawn: React.MutableRefObject<number>;
  travel: React.MutableRefObject<number>;
}) {
  const group = React.useRef<THREE.Group>(null);

  const bodyGeo = React.useMemo(buildBodyGeometry, []);
  const glassGeo = React.useMemo(buildGlassGeometry, []);

  React.useEffect(
    () => () => {
      bodyGeo.dispose();
      glassGeo.dispose();
    },
    [bodyGeo, glassGeo],
  );

  useFrame(() => {
    const g = group.current;
    if (!g) return;

    // The car only exists once the route it drives has been drawn.
    const visible = drawn.current > 0.995;
    g.visible = visible;
    if (!visible) return;

    const t = travel.current % 1;
    const at = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t);
    g.position.set(at.x, 0, at.z);
    g.rotation.y = Math.atan2(tangent.x, tangent.z);
  });

  const wheels: [number, number][] = [
    [0.2, 0.3],
    [-0.2, 0.3],
    [0.2, -0.3],
    [-0.2, -0.3],
  ];

  return (
    <group ref={group}>
      {/* One scale for the whole vehicle, so body, wheels and lamps stay in
          proportion and the wheels keep touching the road. */}
      <group scale={CAR_SCALE}>
        <group position={[0, SILL_Y, 0]}>
          <mesh geometry={bodyGeo}>
            <meshPhongMaterial color={palette.carBody} shininess={70} specular="#ffffff" />
          </mesh>
          <mesh geometry={glassGeo}>
            <meshPhongMaterial color={palette.carGlass} shininess={110} specular="#8899bb" />
          </mesh>
        </group>

        {wheels.map(([x, z]) => (
          <group key={`${x},${z}`} position={[x, WHEEL_R, z]} rotation={[0, 0, Math.PI / 2]}>
            <mesh>
              <cylinderGeometry args={[WHEEL_R, WHEEL_R, 0.07, 18]} />
              <meshLambertMaterial color={palette.carTyre} />
            </mesh>
            <mesh>
              <cylinderGeometry args={[0.055, 0.055, 0.074, 14]} />
              <meshLambertMaterial color={palette.carRim} />
            </mesh>
          </group>
        ))}

        {/* Lamps. Basic material, so they stay lit regardless of the sun angle. */}
        {[0.135, -0.135].map((x) => (
          <mesh key={`h${x}`} position={[x, 0.15, 0.505]}>
            <boxGeometry args={[0.11, 0.045, 0.02]} />
            <meshBasicMaterial color={LAMP_HEAD} />
          </mesh>
        ))}
        {[0.145, -0.145].map((x) => (
          <mesh key={`t${x}`} position={[x, 0.175, -0.512]}>
            <boxGeometry args={[0.1, 0.04, 0.02]} />
            <meshBasicMaterial color={LAMP_TAIL} />
          </mesh>
        ))}
      </group>

      {/* The fix on the ground beneath it. */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.34, 24]} />
        <meshBasicMaterial color={palette.route} transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

/** Three arcs sweeping down to the vehicle: the satellite fix. */
function SignalArcs({ curve, palette, travel }: { curve: THREE.CatmullRomCurve3; palette: Palette; travel: React.MutableRefObject<number> }) {
  const group = React.useRef<THREE.Group>(null);
  const rings = [0.55, 0.95, 1.4];

  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    const at = curve.getPointAt(travel.current % 1);
    g.position.set(at.x, 0.02, at.z);
    g.children.forEach((child, i) => {
      const phase = (clock.elapsedTime * 0.55 + i * 0.33) % 1;
      const mesh = child as THREE.Mesh;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = (1 - phase) * 0.5;
      mesh.scale.setScalar(0.5 + phase * 1.6);
    });
  });

  return (
    <group ref={group}>
      {rings.map((r, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[r - 0.02, r, 40]} />
          <meshBasicMaterial color={palette.route} transparent opacity={0.3} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function Ground({ palette }: { palette: Palette }) {
  // The whole graticule is one LineSegments: a single draw call rather than
  // thirty, and no line-geometry library to pull in.
  const grid = React.useMemo(() => {
    const verts: number[] = [];
    for (let i = -11; i <= 11; i += 1.7) {
      verts.push(i, 0.004, -8, i, 0.004, 8);
      verts.push(-11, 0.004, i * 0.72, 11, 0.004, i * 0.72);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
    const material = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.55 });
    return new THREE.LineSegments(geometry, material);
  }, []);

  React.useEffect(() => {
    (grid.material as THREE.LineBasicMaterial).color.set(palette.grid);
  }, [grid, palette]);

  React.useEffect(() => () => {
    grid.geometry.dispose();
    (grid.material as THREE.Material).dispose();
  }, [grid]);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]}>
        <planeGeometry args={[40, 30]} />
        <meshBasicMaterial color={palette.ground} />
      </mesh>
      <primitive object={grid} />
    </group>
  );
}

/* ------------------------------------------------------------------ */

function Rig({ drawn, travel }: { drawn: React.MutableRefObject<number>; travel: React.MutableRefObject<number> }) {
  const { camera, size } = useThree();
  const start = React.useRef(performance.now());
  // A phone-sized canvas needs a tighter frame or the plate reads as a speck.
  const dolly = size.width < 520 ? 0.74 : 1;

  useFrame((_, delta) => {
    const elapsed = (performance.now() - start.current) / 1000;

    // Load sequence: the route draws itself over the first two seconds.
    const d = Math.min(elapsed / 2.1, 1);
    drawn.current = 1 - Math.pow(1 - d, 3);

    // Then the vehicle cruises, one lap every eighteen seconds.
    if (drawn.current > 0.995) travel.current += delta / 18;

    // Scrolling the hero tips the camera from an oblique view toward plan.
    const scroll = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1);
    const eased = scroll * scroll;
    camera.position.set(
      (15.5 - eased * 5) * dolly,
      (14.2 + eased * 13) * dolly,
      (25.5 - eased * 8) * dolly,
    );
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function HeroScene() {
  const { theme } = useTheme();
  const palette = PALETTES[theme];
  const curve = useRouteCurve();
  const drawn = React.useRef(0);
  const travel = React.useRef(0);

  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [15.5, 14.2, 25.5], fov: 36 }}
      style={{ pointerEvents: "none" }}
    >
      <fog attach="fog" args={[palette.fog, 30, 62]} />
      <ambientLight intensity={theme === "dark" ? 0.75 : 1.5} />
      <directionalLight position={[6, 12, 8]} intensity={theme === "dark" ? 1.1 : 0.45} />
      {/* Sky-to-ground gradient, so the car roof catches light and its
          flanks fall away. Flat ambient alone leaves the body shapeless. */}
      <hemisphereLight args={["#ffffff", palette.ground, theme === "dark" ? 0.55 : 0.4]} />

      <Ground palette={palette} />
      <City palette={palette} curve={curve} />
      <Route curve={curve} palette={palette} drawn={drawn} />
      <Zone curve={curve} palette={palette} />
      <SignalArcs curve={curve} palette={palette} travel={travel} />
      <Vehicle curve={curve} palette={palette} drawn={drawn} travel={travel} />

      <Rig drawn={drawn} travel={travel} />
    </Canvas>
  );
}
