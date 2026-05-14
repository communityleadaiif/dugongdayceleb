import { useRef, useMemo, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/* ───────── Shimmering Light Rays from surface ───────── */
function LightRays() {
  const meshRef = useRef()
  const mat = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        varying vec2 vUv;
        void main(){
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        void main(){
          float ray = sin(vUv.x * 12.0 + uTime * 0.5) * 0.5 + 0.5;
          ray *= sin(vUv.x * 7.0 - uTime * 0.3) * 0.5 + 0.5;
          ray *= smoothstep(1.0, 0.0, vUv.y);
          ray *= 0.12;
          gl_FragColor = vec4(0.3, 0.8, 1.0, ray);
        }
      `
    })
  }, [])

  useFrame((_, delta) => {
    mat.uniforms.uTime.value += delta
  })

  return (
    <mesh ref={meshRef} position={[0, 6, -5]} material={mat}>
      <planeGeometry args={[30, 14, 1, 1]} />
    </mesh>
  )
}

/* ───────── Bubbles ───────── */
function Bubbles({ count = 60 }) {
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const particles = useMemo(() => {
    const arr = []
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 20,
        y: Math.random() * -12,
        z: (Math.random() - 0.5) * 10 - 2,
        speed: 0.3 + Math.random() * 0.6,
        size: 0.02 + Math.random() * 0.06,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.5 + Math.random() * 1.5
      })
    }
    return arr
  }, [count])

  useFrame((_, delta) => {
    if (!meshRef.current) return
    particles.forEach((p, i) => {
      p.y += p.speed * delta
      p.wobble += p.wobbleSpeed * delta
      if (p.y > 8) {
        p.y = -8
        p.x = (Math.random() - 0.5) * 20
      }
      dummy.position.set(
        p.x + Math.sin(p.wobble) * 0.3,
        p.y,
        p.z
      )
      dummy.scale.setScalar(p.size)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#90e0ef" transparent opacity={0.35} />
    </instancedMesh>
  )
}

/* ───────── Single Fish (made of simple shapes) ───────── */
function Fish({ startPos, speed, scale, color, direction = 1 }) {
  const groupRef = useRef()
  const tailRef = useRef()
  const data = useRef({
    x: startPos[0],
    y: startPos[1],
    z: startPos[2],
    baseY: startPos[1],
    wobble: Math.random() * Math.PI * 2,
    tailWobble: Math.random() * Math.PI * 2
  })

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const d = data.current
    d.x += speed * direction * delta
    d.wobble += 1.5 * delta
    d.tailWobble += 8 * delta

    // Reset when off screen
    if (direction > 0 && d.x > 14) d.x = -14
    if (direction < 0 && d.x < -14) d.x = 14

    groupRef.current.position.set(
      d.x,
      d.baseY + Math.sin(d.wobble) * 0.4,
      d.z
    )
    groupRef.current.rotation.z = Math.sin(d.wobble) * 0.08
    groupRef.current.scale.set(
      scale * direction,
      scale,
      scale
    )

    if (tailRef.current) {
      tailRef.current.rotation.y = Math.sin(d.tailWobble) * 0.4
    }
  })

  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh>
        <sphereGeometry args={[0.3, 12, 8]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Tail */}
      <group ref={tailRef} position={[-0.35, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <coneGeometry args={[0.2, 0.3, 4]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
        </mesh>
      </group>
      {/* Eye */}
      <mesh position={[0.18, 0.06, 0.12]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="white" />
      </mesh>
      <mesh position={[0.2, 0.06, 0.13]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#001d3d" />
      </mesh>
      {/* Fin */}
      <mesh position={[0, 0.18, 0]} rotation={[0, 0, -0.3]}>
        <coneGeometry args={[0.08, 0.2, 4]} />
        <meshStandardMaterial color={color} transparent opacity={0.7} />
      </mesh>
    </group>
  )
}

/* ───────── Fish School ───────── */
function FishSchool() {
  const fishData = useMemo(() => [
    { pos: [-10, 2, -3], speed: 0.8, scale: 0.6, color: '#48cae4', dir: 1 },
    { pos: [-8, 2.5, -4], speed: 0.75, scale: 0.5, color: '#00b4d8', dir: 1 },
    { pos: [-9, 1.8, -3.5], speed: 0.85, scale: 0.45, color: '#90e0ef', dir: 1 },
    { pos: [-7, 2.2, -2.5], speed: 0.78, scale: 0.55, color: '#48cae4', dir: 1 },
    { pos: [-11, 2.8, -4.5], speed: 0.72, scale: 0.4, color: '#caf0f8', dir: 1 },
    { pos: [8, -1, -3], speed: 0.9, scale: 0.7, color: '#ffd166', dir: -1 },
    { pos: [10, -0.5, -4], speed: 0.85, scale: 0.5, color: '#ff8787', dir: -1 },
    { pos: [9, -1.5, -2.5], speed: 0.88, scale: 0.55, color: '#ffd166', dir: -1 },
    { pos: [6, 0, -5], speed: 1.0, scale: 0.8, color: '#00f5d4', dir: 1 },
    { pos: [-5, -3, -3], speed: 0.6, scale: 0.35, color: '#90e0ef', dir: 1 },
    { pos: [-4, -3.3, -4], speed: 0.58, scale: 0.3, color: '#48cae4', dir: 1 },
    { pos: [-6, -2.8, -3.5], speed: 0.62, scale: 0.33, color: '#00b4d8', dir: 1 },
    { pos: [7, 4, -6], speed: 0.5, scale: 0.9, color: '#0077b6', dir: -1 },
    { pos: [3, -4, -4], speed: 0.7, scale: 0.45, color: '#48cae4', dir: 1 },
    { pos: [-3, 4.5, -5], speed: 0.55, scale: 0.65, color: '#00f5d4', dir: 1 },
  ], [])

  return (
    <>
      {fishData.map((f, i) => (
        <Fish
          key={i}
          startPos={f.pos}
          speed={f.speed}
          scale={f.scale}
          color={f.color}
          direction={f.dir}
        />
      ))}
    </>
  )
}

/* ───────── Dugong (larger, gentle shape) ───────── */
function Dugong() {
  const groupRef = useRef()
  const flipperLRef = useRef()
  const flipperRRef = useRef()
  const data = useRef({
    x: -16,
    wobble: 0,
    flipperWobble: 0
  })

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const d = data.current
    d.x += 0.3 * delta
    d.wobble += 0.5 * delta
    d.flipperWobble += 2.0 * delta

    if (d.x > 16) d.x = -16

    groupRef.current.position.set(
      d.x,
      -1 + Math.sin(d.wobble) * 0.5,
      -6
    )
    groupRef.current.rotation.z = Math.sin(d.wobble) * 0.05

    if (flipperLRef.current) {
      flipperLRef.current.rotation.z = Math.sin(d.flipperWobble) * 0.2
    }
    if (flipperRRef.current) {
      flipperRRef.current.rotation.z = -Math.sin(d.flipperWobble) * 0.2
    }
  })

  return (
    <group ref={groupRef} scale={[1.2, 1.2, 1.2]}>
      {/* Body - main */}
      <mesh>
        <sphereGeometry args={[0.8, 16, 12]} />
        <meshStandardMaterial color="#5a7d8a" roughness={0.6} metalness={0.05} />
      </mesh>
      {/* Body - front */}
      <mesh position={[0.7, 0, 0]}>
        <sphereGeometry args={[0.55, 12, 10]} />
        <meshStandardMaterial color="#6b8e9b" roughness={0.6} metalness={0.05} />
      </mesh>
      {/* Snout */}
      <mesh position={[1.15, -0.1, 0]}>
        <sphereGeometry args={[0.3, 10, 8]} />
        <meshStandardMaterial color="#7a9da8" roughness={0.7} />
      </mesh>
      {/* Tail */}
      <mesh position={[-1.0, 0, 0]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[0.4, 10, 8]} />
        <meshStandardMaterial color="#5a7d8a" roughness={0.6} />
      </mesh>
      {/* Tail fin */}
      <mesh position={[-1.5, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.5, 0.15, 8]} />
        <meshStandardMaterial color="#4a6d7a" roughness={0.5} />
      </mesh>
      {/* Left flipper */}
      <group ref={flipperLRef} position={[0.2, -0.3, 0.5]}>
        <mesh rotation={[0.5, 0, -0.3]}>
          <coneGeometry args={[0.12, 0.5, 6]} />
          <meshStandardMaterial color="#5a7d8a" roughness={0.5} />
        </mesh>
      </group>
      {/* Right flipper */}
      <group ref={flipperRRef} position={[0.2, -0.3, -0.5]}>
        <mesh rotation={[-0.5, 0, -0.3]}>
          <coneGeometry args={[0.12, 0.5, 6]} />
          <meshStandardMaterial color="#5a7d8a" roughness={0.5} />
        </mesh>
      </group>
      {/* Eye */}
      <mesh position={[0.95, 0.15, 0.28]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>
    </group>
  )
}

/* ───────── Submarine silhouette ───────── */
function Submarine() {
  const groupRef = useRef()
  const data = useRef({ x: 18, wobble: 0 })

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const d = data.current
    d.x -= 0.15 * delta
    d.wobble += 0.3 * delta
    if (d.x < -18) d.x = 18

    groupRef.current.position.set(
      d.x,
      -4 + Math.sin(d.wobble) * 0.3,
      -9
    )
  })

  return (
    <group ref={groupRef} scale={[0.6, 0.6, 0.6]}>
      {/* Hull */}
      <mesh>
        <capsuleGeometry args={[0.5, 2.5, 8, 16]} />
        <meshStandardMaterial color="#0a1628" roughness={0.8} metalness={0.3} transparent opacity={0.6} />
      </mesh>
      {/* Tower */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[0.5, 0.4, 0.3]} />
        <meshStandardMaterial color="#0a1628" roughness={0.8} metalness={0.3} transparent opacity={0.6} />
      </mesh>
      {/* Periscope */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
        <meshStandardMaterial color="#0a1628" roughness={0.8} transparent opacity={0.5} />
      </mesh>
      {/* Propeller area glow */}
      <mesh position={[-1.5, 0, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial color="#00f5d4" transparent opacity={0.2} />
      </mesh>
    </group>
  )
}

/* ───────── Seaweed cluster ───────── */
function Seaweed({ position, height = 2, color = '#0a6640' }) {
  const meshRef = useRef()
  const data = useRef({ wobble: Math.random() * Math.PI * 2 })

  useFrame((_, delta) => {
    if (!meshRef.current) return
    data.current.wobble += 1.2 * delta
    meshRef.current.rotation.z = Math.sin(data.current.wobble) * 0.15
  })

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <cylinderGeometry args={[0.03, 0.06, height, 6]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
    </group>
  )
}

/* ───────── Sea floor ───────── */
function SeaFloor() {
  const seaweedPositions = useMemo(() => {
    const arr = []
    for (let i = 0; i < 30; i++) {
      arr.push({
        pos: [(Math.random() - 0.5) * 24, -6 + Math.random() * 0.5, -3 - Math.random() * 6],
        height: 1 + Math.random() * 2,
        color: ['#0a6640', '#0d7a4a', '#065535', '#0e8c55'][Math.floor(Math.random() * 4)]
      })
    }
    return arr
  }, [])

  return (
    <>
      {/* Floor */}
      <mesh position={[0, -6.5, -3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 15]} />
        <meshStandardMaterial color="#0a1a2e" roughness={1} />
      </mesh>
      {/* Seaweed */}
      {seaweedPositions.map((s, i) => (
        <Seaweed key={i} position={s.pos} height={s.height} color={s.color} />
      ))}
    </>
  )
}

/* ───────── Floating particles / plankton ───────── */
function Plankton({ count = 100 }) {
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const particles = useMemo(() => {
    const arr = []
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 24,
        y: (Math.random() - 0.5) * 14,
        z: (Math.random() - 0.5) * 10 - 2,
        speed: 0.05 + Math.random() * 0.15,
        size: 0.01 + Math.random() * 0.025,
        wobbleX: Math.random() * Math.PI * 2,
        wobbleY: Math.random() * Math.PI * 2,
      })
    }
    return arr
  }, [count])

  useFrame((_, delta) => {
    if (!meshRef.current) return
    particles.forEach((p, i) => {
      p.wobbleX += 0.3 * delta
      p.wobbleY += 0.5 * delta
      p.y += p.speed * delta
      if (p.y > 7) {
        p.y = -7
        p.x = (Math.random() - 0.5) * 24
      }
      dummy.position.set(
        p.x + Math.sin(p.wobbleX) * 0.2,
        p.y,
        p.z + Math.cos(p.wobbleY) * 0.1
      )
      dummy.scale.setScalar(p.size)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#90e0ef" transparent opacity={0.2} />
    </instancedMesh>
  )
}

/* ───────── Scene Setup ───────── */
function Scene() {
  return (
    <>
      <color attach="background" args={['#000814']} />
      <fog attach="fog" args={['#000a1a', 5, 18]} />

      {/* Lighting */}
      <ambientLight intensity={0.15} color="#4488aa" />
      <directionalLight position={[0, 10, 5]} intensity={0.3} color="#88ccff" />
      <pointLight position={[5, 3, -2]} intensity={0.4} color="#00f5d4" distance={15} />
      <pointLight position={[-5, -2, -3]} intensity={0.2} color="#0077b6" distance={12} />

      {/* Scene elements */}
      <LightRays />
      <Bubbles count={50} />
      <Plankton count={80} />
      <FishSchool />
      <Dugong />
      <Submarine />
      <SeaFloor />
    </>
  )
}

/* ───────── Main Underwater Canvas ───────── */
export default function UnderwaterScene() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
      pointerEvents: 'none'
    }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60, near: 0.1, far: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
        performance={{ min: 0.5 }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
