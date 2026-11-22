import * as React from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

import { useTheme } from "@/components/layout/ThemeProvider";
import { signalProgress, stageFromProgress } from "@/lib/signalProgress";

/**
 * The signal chain.
 *
 * Four nodes — device, satellite, server, operator panel — with a packet
 * running between them. Scrolling the section walks the packet forward, so
 * the stage described in the copy is the stage lit on the canvas.
 */

const NODE_X = [-4.6, -1.55, 1.55, 4.6];
const NODE_Y = [0, 2.3, 0, 0];

type Palette = { node: string; nodeOn: string; link: string; ink: string };

const PALETTES: Record<"dark" | "light", Palette> = {
  dark: { node: "#191070", nodeOn: "#22D3EE", link: "#2A1E93", ink: "#04003A" },
  light: { node: "#C9D1EA", nodeOn: "#0891B2", link: "#B4BFDF", ink: "#F7F8FC" },
};

/** Where the packet is, in world space, for a given 0..1 run. */
function packetAt(t: number, out: THREE.Vector3) {
  const span = 1 / 3;
  const leg = Math.min(2, Math.floor(t / span));
  const local = (t - leg * span) / span;
  const x = THREE.MathUtils.lerp(NODE_X[leg], NODE_X[leg + 1], local);
  const y = THREE.MathUtils.lerp(NODE_Y[leg], NODE_Y[leg + 1], local);
  // Lift the hop so it reads as a transmission, not a slide.
  const arc = Math.sin(local * Math.PI) * (leg === 0 || leg === 1 ? 0.35 : 0.8);
  return out.set(x, y + arc, 0);
}

function Node({
  index,
  palette,
  active,
}: {
  index: number;
  palette: Palette;
  active: React.MutableRefObject<number>;
}) {
  const mesh = React.useRef<THREE.Mesh>(null);
  const ring = React.useRef<THREE.Mesh>(null);
  const color = React.useMemo(() => new THREE.Color(), []);

  useFrame(({ clock }) => {
    const on = active.current === index;
    const m = mesh.current;
    if (m) {
      const mat = m.material as THREE.MeshLambertMaterial;
      mat.color.lerp(color.set(on ? palette.nodeOn : palette.node), 0.08);
      const target = on ? 1.16 : 1;
      m.scale.lerp(new THREE.Vector3(target, target, target), 0.1);
      m.rotation.y += 0.0035;
    }
    if (ring.current) {
      const mat = ring.current.material as THREE.MeshBasicMaterial;
      mat.opacity = on ? 0.35 + Math.sin(clock.elapsedTime * 2.6) * 0.18 : 0;
      ring.current.scale.setScalar(on ? 1 + Math.sin(clock.elapsedTime * 2.6) * 0.08 : 1);
    }
  });

  const geometry = () => {
    switch (index) {
      case 0: // Device: a small unit in the vehicle.
        return <boxGeometry args={[1, 0.62, 0.78]} />;
      case 1: // Satellite: a faceted body overhead.
        return <octahedronGeometry args={[0.78, 0]} />;
      case 2: // Server: a tower.
        return <boxGeometry args={[0.86, 1.5, 0.86]} />;
      default: // Panel: the operator screen.
        return <boxGeometry args={[1.7, 1.1, 0.12]} />;
    }
  };

  return (
    <group position={[NODE_X[index], NODE_Y[index], 0]}>
      <mesh ref={mesh}>
        {geometry()}
        <meshLambertMaterial color={palette.node} />
      </mesh>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.9, 0]}>
        <ringGeometry args={[1.0, 1.06, 40]} />
        <meshBasicMaterial color={palette.nodeOn} transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Links({ palette }: { palette: Palette }) {
  // One dashed THREE.Line per leg. Dash distances are cumulative along a
  // Line (unlike LineSegments), so the pattern runs unbroken end to end.
  const legs = React.useMemo(() => {
    return [0, 1, 2].map((i) => {
      const verts: number[] = [];
      for (let s = 0; s <= 24; s++) {
        const local = s / 24;
        const x = THREE.MathUtils.lerp(NODE_X[i], NODE_X[i + 1], local);
        const y = THREE.MathUtils.lerp(NODE_Y[i], NODE_Y[i + 1], local);
        const arc = Math.sin(local * Math.PI) * (i === 0 || i === 1 ? 0.35 : 0.8);
        verts.push(x, y + arc, 0);
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
      const material = new THREE.LineDashedMaterial({
        dashSize: 0.18,
        gapSize: 0.16,
        transparent: true,
        opacity: 0.8,
      });
      const line = new THREE.Line(geometry, material);
      line.computeLineDistances();
      return line;
    });
  }, []);

  React.useEffect(() => {
    legs.forEach((l) => (l.material as THREE.LineDashedMaterial).color.set(palette.link));
  }, [legs, palette]);

  React.useEffect(() => () => {
    legs.forEach((l) => {
      l.geometry.dispose();
      (l.material as THREE.Material).dispose();
    });
  }, [legs]);

  return (
    <>
      {legs.map((line, i) => (
        <primitive key={i} object={line} />
      ))}
    </>
  );
}

function Packet({ palette, run }: { palette: Palette; run: React.MutableRefObject<number> }) {
  const ref = React.useRef<THREE.Mesh>(null);
  const trail = React.useRef<THREE.Mesh>(null);
  const v = React.useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    packetAt(run.current, v);
    ref.current?.position.copy(v);
    trail.current?.position.copy(v);
  });

  return (
    <group>
      <mesh ref={trail}>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshBasicMaterial color={palette.nodeOn} transparent opacity={0.16} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={ref}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshBasicMaterial color={palette.nodeOn} />
      </mesh>
    </group>
  );
}

function Rig({ active, run }: { active: React.MutableRefObject<number>; run: React.MutableRefObject<number> }) {
  const { camera } = useThree();

  useFrame(() => {
    const p = signalProgress.current;
    active.current = stageFromProgress(p);

    // Three legs for four nodes: the packet is always between the stage it
    // has left and the stage it is arriving at.
    const target = Math.min(1, Math.max(0, (active.current / 3) * 0.999 + 0.0005));
    run.current += (target - run.current) * 0.06;

    camera.position.x = (p - 0.5) * 2.2;
    camera.position.y = 1.6 - p * 0.6;
    camera.lookAt(0, 0.7, 0);
  });

  return null;
}

export default function SignalChainScene() {
  const { theme } = useTheme();
  const palette = PALETTES[theme];
  const active = React.useRef(0);
  const run = React.useRef(0);

  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 1.6, 16.5], fov: 34 }}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={theme === "dark" ? 0.8 : 1.2} />
      <directionalLight position={[3, 8, 7]} intensity={theme === "dark" ? 1 : 0.8} />

      <Links palette={palette} />
      {[0, 1, 2, 3].map((i) => (
        <Node key={i} index={i} palette={palette} active={active} />
      ))}
      <Packet palette={palette} run={run} />

      <Rig active={active} run={run} />
    </Canvas>
  );
}
