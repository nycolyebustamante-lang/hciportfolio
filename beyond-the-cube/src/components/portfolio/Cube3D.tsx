import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

// Standard cube colour scheme (white top, green front)
const FACE_COLORS: Record<string, string> = {
  "0,1,0": "#f4f4f4", // U white
  "0,-1,0": "#ffd500", // D yellow
  "1,0,0": "#c41e3a", // R red
  "-1,0,0": "#ff6a00", // L orange
  "0,0,1": "#009e60", // F green
  "0,0,-1": "#0051ba", // B blue
};

type Move = { axis: 0 | 1 | 2; layer: -1 | 0 | 1; dir: 1 | -1 };
type Cubie = { pos: THREE.Vector3; quat: THREE.Quaternion; ref: THREE.Group | null };

const AXES = [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1)];

export type CubeCommand = { kind: "scramble" | "solve" | "turn"; id: number };

export default function Cube3D({
  command,
  onBusyChange,
  reducedMotion,
}: {
  command: CubeCommand | null;
  onBusyChange?: ((busy: boolean, scrambled: boolean) => void) | undefined;
  reducedMotion: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [5.2, 4.2, 6.4], fov: 34 }}
      gl={{ antialias: true, alpha: true }}
      aria-label="Interactive 3D Rubik's Cube. Drag to rotate."
      role="img"
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 8, 6]} intensity={1.6} />
      <pointLight position={[-6, -2, -4]} intensity={30} color="#9be22d" />
      <Environment resolution={64}>
        <Lightformer intensity={2} position={[0, 5, 0]} scale={[10, 10, 1]} />
        <Lightformer intensity={1} color="#7fe9ff" position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[20, 1, 1]} />
        <Lightformer intensity={0.8} color="#b48cff" position={[5, -1, 2]} rotation-y={-Math.PI / 2} scale={[20, 2, 1]} />
      </Environment>
      <CubeModel command={command} onBusyChange={onBusyChange} reducedMotion={reducedMotion} />
    </Canvas>
  );
}

function CubeModel({
  command,
  onBusyChange,
  reducedMotion,
}: {
  command: CubeCommand | null;
  onBusyChange?: ((busy: boolean, scrambled: boolean) => void) | undefined;
  reducedMotion: boolean;
}) {
  const root = useRef<THREE.Group>(null);
  const cubies = useMemo<Cubie[]>(() => {
    const list: Cubie[] = [];
    for (let x = -1; x <= 1; x++)
      for (let y = -1; y <= 1; y++)
        for (let z = -1; z <= 1; z++)
          list.push({ pos: new THREE.Vector3(x, y, z), quat: new THREE.Quaternion(), ref: null });
    return list;
  }, []);
  const initial = useMemo(() => cubies.map((c) => c.pos.clone()), [cubies]);

  const queue = useRef<Move[]>([]);
  const history = useRef<Move[]>([]);
  const active = useRef<{ move: Move; t: number; members: Cubie[]; record: boolean } | null>(null);
  const speed = useRef(1);
  const recordQueue = useRef(true);
  const drag = useRef({ down: false, x: 0, y: 0, rx: 0, ry: 0, vx: 0, vy: 0, last: 0 });
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
      const d = drag.current;
      if (d.down) {
        const dx = e.clientX - d.x;
        const dy = e.clientY - d.y;
        d.x = e.clientX;
        d.y = e.clientY;
        d.ry += dx * 0.01;
        d.rx += dy * 0.01;
        d.vx = dy * 0.01;
        d.vy = dx * 0.01;
      }
    };
    const onUp = () => (drag.current.down = false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  useEffect(() => {
    if (!command) return;
    if (command.kind === "scramble") {
      const moves: Move[] = [];
      let lastAxis = -1;
      for (let i = 0; i < 20; i++) {
        let axis = Math.floor(Math.random() * 3) as 0 | 1 | 2;
        if (axis === lastAxis) axis = ((axis + 1) % 3) as 0 | 1 | 2;
        lastAxis = axis;
        const layers = [-1, 1] as const;
        moves.push({ axis, layer: layers[Math.floor(Math.random() * 2)]!, dir: Math.random() > 0.5 ? 1 : -1 });
      }
      queue.current.push(...moves);
      recordQueue.current = true;
      speed.current = reducedMotion ? 20 : 7;
    } else if (command.kind === "solve") {
      // Genuinely solves: replays the recorded scramble in reverse with inverted turns.
      const inverse = [...history.current].reverse().map((m) => ({ ...m, dir: (m.dir * -1) as 1 | -1 }));
      history.current = [];
      queue.current = inverse;
      recordQueue.current = false;
      speed.current = reducedMotion ? 20 : 5;
    } else {
      queue.current.push({ axis: 1, layer: 1, dir: 1 });
      recordQueue.current = true;
      speed.current = 4;
    }
    onBusyChange?.(true, history.current.length > 0);
  }, [command, reducedMotion, onBusyChange]);

  const applyTransform = (c: Cubie, q?: THREE.Quaternion) => {
    if (!c.ref) return;
    if (q) {
      c.ref.position.copy(c.pos).applyQuaternion(q);
      c.ref.quaternion.copy(q).multiply(c.quat);
    } else {
      c.ref.position.copy(c.pos);
      c.ref.quaternion.copy(c.quat);
    }
  };

  useFrame((state, raw) => {
    const dt = Math.min(raw, 0.05);
    const g = root.current;
    if (!g) return;
    const d = drag.current;
    if (!d.down) {
      d.vx *= Math.exp(-4 * dt);
      d.vy *= Math.exp(-4 * dt);
      d.rx += d.vx;
      d.ry += d.vy;
      if (!reducedMotion) d.ry += dt * 0.25;
    }
    d.rx = THREE.MathUtils.clamp(d.rx, -1.2, 1.2);
    const px = reducedMotion ? 0 : pointer.current.x * 0.25;
    const py = reducedMotion ? 0 : pointer.current.y * 0.18;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, d.ry + px, 6, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, d.rx + py, 6, dt);
    if (!reducedMotion) g.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.12;

    // Layer turn animation
    if (!active.current && queue.current.length) {
      const move = queue.current.shift()!;
      const members = cubies.filter((c) => Math.round(c.pos.getComponent(move.axis)) === move.layer);
      active.current = { move, t: 0, members, record: recordQueue.current };
    }
    const a = active.current;
    if (a) {
      a.t = Math.min(1, a.t + dt * speed.current);
      const ease = a.t < 0.5 ? 2 * a.t * a.t : 1 - Math.pow(-2 * a.t + 2, 2) / 2;
      const q = new THREE.Quaternion().setFromAxisAngle(AXES[a.move.axis]!, (ease * Math.PI) / 2 * a.move.dir);
      a.members.forEach((c) => applyTransform(c, q));
      if (a.t >= 1) {
        a.members.forEach((c) => {
          c.pos.applyQuaternion(q).round();
          c.quat.premultiply(q).normalize();
          applyTransform(c);
        });
        if (a.record) history.current.push(a.move);
        active.current = null;
        if (!queue.current.length) onBusyChange?.(false, history.current.length > 0);
      }
    }
  });

  return (
    <group
      ref={root}
      onPointerDown={(e) => {
        e.stopPropagation();
        drag.current.down = true;
        drag.current.x = e.clientX;
        drag.current.y = e.clientY;
      }}
    >
      {cubies.map((c, i) => (
        <group key={i} ref={(r) => { c.ref = r; if (r) applyTransform(c); }}>
          <RoundedBox args={[0.96, 0.96, 0.96]} radius={0.08} smoothness={3}>
            <meshStandardMaterial color="#0c0d10" roughness={0.45} metalness={0.1} />
          </RoundedBox>
          {Object.entries(FACE_COLORS).map(([key, color]) => {
            const [nx = 0, ny = 0, nz = 0] = key.split(",").map(Number);
            const p = initial[i]!;
            if ((nx && p.x !== nx) || (ny && p.y !== ny) || (nz && p.z !== nz)) return null;
            const rot: [number, number, number] = nx ? [0, (nx * Math.PI) / 2, 0] : ny ? [(-ny * Math.PI) / 2, 0, 0] : [0, nz < 0 ? Math.PI : 0, 0];
            return (
              <mesh key={key} position={[nx * 0.485, ny * 0.485, nz * 0.485]} rotation={rot}>
                <boxGeometry args={[0.8, 0.8, 0.02]} />
                <meshPhysicalMaterial color={color} roughness={0.25} clearcoat={0.8} clearcoatRoughness={0.2} />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
}
