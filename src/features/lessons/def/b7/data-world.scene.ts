import * as THREE from 'three'
import { WORLD_TIMELINES, getWorldFrame, type WorldFrame } from './data-world-timeline'

export type DataWorldProjection = { id: number; x: number; y: number; visible: boolean }

export type DataWorldController = {
  setScenario(index: number): void
  setSelected(id: number): void
  orbit(yawDelta: number, pitchDelta: number): void
  zoom(factor: number): void
  resetView(): void
  setActive(active: boolean): void
  setReducedMotion(reduced: boolean): void
  dispose(): void
}

const TAU = Math.PI * 2
const clamp = THREE.MathUtils.clamp
const LANDMARKS = [
  new THREE.Vector3(-7, 0.35, 2.7),
  new THREE.Vector3(-4.7, 0.35, -2.9),
  new THREE.Vector3(0, 0.35, 1.3),
  new THREE.Vector3(4.5, 0.35, -3.1),
  new THREE.Vector3(7.2, 0.35, 3),
  new THREE.Vector3(-0.3, 0.35, -6.7),
]
const LABEL_HEIGHTS = [3.45, 3.25, 3.8, 3.8, 4.15, 4.25]

/** A decorative, deterministic world. Lesson state and accessible text live in React. */
export function createDataWorld(
  container: HTMLDivElement,
  onProject: (points: DataWorldProjection[]) => void,
  onSelect: (id: number) => void,
  onFrame?: (frame: WorldFrame) => void,
): DataWorldController {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
  renderer.setClearColor(0x081c30, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.3
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap
  const canvas = renderer.domElement
  canvas.setAttribute('aria-hidden', 'true')
  canvas.style.display = 'block'
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.style.touchAction = 'pan-y'
  container.appendChild(canvas)

  const scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0x102c40, 45, 78)
  const camera = new THREE.OrthographicCamera(-16, 16, 10, -10, 0.1, 110)
  let yaw = 0.43
  let pitch = 0.68
  let zoomLevel = 1
  let width = 0
  let height = 0
  let active = false
  let reduced = false
  let disposed = false
  let contextLost = false
  let frameHandle = 0
  let previousTime = 0
  let elapsed = 0
  let frameCount = 0
  let scenario = 0
  let selected = 2
  let currentFrame = getWorldFrame(0, 0)
  let lastFrameKey = ''
  const geometries = new Set<THREE.BufferGeometry>()
  const materials = new Set<THREE.Material>()
  const ownGeometry = <T extends THREE.BufferGeometry>(geometry: T): T => { geometries.add(geometry); return geometry }
  const ownMaterial = <T extends THREE.Material>(material: T): T => { materials.add(material); return material }
  const material = (color: number, extra: THREE.MeshStandardMaterialParameters = {}) => ownMaterial(new THREE.MeshStandardMaterial({ color, roughness: 0.8, flatShading: true, ...extra }))
  const palette = {
    moss: material(0x466e62), stone: material(0x264455), edge: material(0x6a9084),
    navy: material(0x19394b), steel: material(0x739fa9, { metalness: 0.5, roughness: 0.45 }),
    cream: material(0xc3d9cf), cyan: material(0x49d9e5, { emissive: 0x0b6974, emissiveIntensity: 0.45 }),
    gold: material(0xd6b56f, { metalness: 0.25 }), wood: material(0x8e775b),
    snow: material(0xc9e5ec), bark: material(0x735966), teal: material(0x25737a),
    lavender: material(0x907fae), darkLeaf: material(0x1d4e52), leaf: material(0x337764),
    glow: ownMaterial(new THREE.MeshBasicMaterial({ color: 0x8cf5ef })),
    goldGlow: ownMaterial(new THREE.MeshBasicMaterial({ color: 0xffd683 })),
  }
  const box = ownGeometry(new THREE.BoxGeometry(1, 1, 1))
  const cylinder = ownGeometry(new THREE.CylinderGeometry(1, 1, 1, 12))
  const cone = ownGeometry(new THREE.ConeGeometry(1, 1, 6))
  const octahedron = ownGeometry(new THREE.OctahedronGeometry(1))
  const sphere = ownGeometry(new THREE.IcosahedronGeometry(1, 1))
  const ringGeometry = ownGeometry(new THREE.TorusGeometry(1, 0.026, 5, 48))

  function mesh(geometry: THREE.BufferGeometry, mat: THREE.Material, position: number[], scale: number[], parent: THREE.Object3D = scene) {
    const object = new THREE.Mesh(geometry, mat)
    object.position.set(position[0], position[1], position[2])
    object.scale.set(scale[0], scale[1], scale[2])
    object.castShadow = true
    object.receiveShadow = true
    parent.add(object)
    return object
  }
  function ring(parent: THREE.Object3D, radius: number, y: number, mat: THREE.Material) {
    const object = mesh(ringGeometry, mat, [0, y, 0], [radius, radius, radius], parent)
    object.rotation.x = -Math.PI / 2
    return object
  }
  const hemisphere = new THREE.HemisphereLight(0xb9e9ff, 0x496153, 2.15)
  scene.add(hemisphere)
  const sun = new THREE.DirectionalLight(0xffefd2, 3.1)
  sun.position.set(-10, 19, 9)
  sun.castShadow = true
  sun.shadow.mapSize.set(1024, 1024)
  sun.shadow.camera.left = -15
  sun.shadow.camera.right = 15
  sun.shadow.camera.top = 13
  sun.shadow.camera.bottom = -13
  sun.shadow.normalBias = 0.06
  sun.shadow.bias = -0.0001
  scene.add(sun)
  const rim = new THREE.DirectionalLight(0x79bcff, 1.8)
  rim.position.set(7, 8, -10)
  scene.add(rim)

  function path(points: number[][]) {
    return new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(p[0], p[1], p[2])), false, 'catmullrom', 0.35)
  }
  function tube(curve: THREE.Curve<THREE.Vector3>, radius: number, mat: THREE.Material, segments = 72) {
    const object = mesh(ownGeometry(new THREE.TubeGeometry(curve, segments, radius, 6, false)), mat, [0, 0, 0], [1, 1, 1])
    object.castShadow = false
    return object
  }
  const dummy = new THREE.Object3D()
  // Six autonomous city districts float on engineered, bevelled decks. There is
  // deliberately no terrain below them: sky and the propulsion units remain visible.
  const deckShape = new THREE.Shape()
  const corners = [[-2.35, -1.8], [1.9, -1.8], [2.35, -1.35], [2.35, 1.45], [1.95, 1.85], [-1.95, 1.85], [-2.35, 1.45]]
  corners.forEach(([x, y], i) => i ? deckShape.lineTo(x, y) : deckShape.moveTo(x, y))
  deckShape.closePath()
  const deckGeometry = ownGeometry(new THREE.ExtrudeGeometry(deckShape, { depth: 0.65, bevelEnabled: true, bevelSegments: 1, steps: 1, bevelSize: 0.14, bevelThickness: 0.13 }))
  deckGeometry.rotateX(-Math.PI / 2)
  const glass = material(0x2b7890, { metalness: 0.66, roughness: 0.2, emissive: 0x123d54, emissiveIntensity: 0.4 })
  const glassDark = material(0x224960, { metalness: 0.55, roughness: 0.27 })
  const glassPale = material(0x6ebec5, { metalness: 0.4, roughness: 0.28 })
  const asphalt = material(0x233644)
  const pavement = material(0x9ab0b3)
  const engineGlass = ownMaterial(new THREE.MeshBasicMaterial({ color: 0x42e4f3, transparent: true, opacity: 0.15, depthWrite: false }))
  const districtAccents = [0x7ec7ff, 0x64eed8, 0xffcd7d, 0xb8a2ff, 0x89e8ff, 0xffda92]
  const districtBeacons: THREE.Mesh[] = []
  const engines: THREE.Mesh[] = []
  const cityWindowMatrices: THREE.Matrix4[] = []
  const cityWindowColors: THREE.Color[] = []
  const cityGroups: THREE.Group[] = []

  function office(parent: THREE.Group, x: number, z: number, w: number, d: number, h: number, variant: number) {
    const skin = [glass, glassDark, glassPale][variant % 3]
    mesh(box, palette.steel, [x, 0.14, z], [w + 0.13, 0.28, d + 0.13], parent)
    mesh(box, skin, [x, h / 2 + 0.18, z], [w, h, d], parent)
    // Floor bands and a dark rooftop equipment room distinguish offices from rocks.
    mesh(box, palette.cream, [x, h + 0.22, z], [w + 0.08, 0.11, d + 0.08], parent)
    mesh(box, palette.navy, [x + w * 0.1, h + 0.36, z], [w * 0.51, 0.2, d * 0.47], parent)
    for (let floor = 0; floor < Math.floor(h / 0.3); floor++) {
      const fy = 0.37 + floor * 0.3
      for (const side of [-1, 1]) {
        dummy.position.set(parent.position.x + x, parent.position.y + fy, parent.position.z + z + side * (d / 2 + 0.006))
        dummy.rotation.set(0, 0, 0)
        dummy.scale.set(w * 0.77, 0.055, 0.015)
        dummy.updateMatrix()
        cityWindowMatrices.push(dummy.matrix.clone())
        cityWindowColors.push(new THREE.Color((floor + variant) % 4 === 0 ? 0xffdea2 : 0x89dced))
      }
    }
    if (variant % 2 === 0) {
      mesh(box, palette.leaf, [x - w * 0.21, h + 0.32, z + d * 0.15], [w * 0.37, 0.11, d * 0.48], parent)
    } else {
      mesh(cylinder, palette.steel, [x, h + 0.66, z], [0.025, 0.74, 0.025], parent)
      mesh(sphere, palette.goldGlow, [x, h + 1.03, z], [0.06, 0.06, 0.06], parent)
    }
  }
  for (let id = 0; id < LANDMARKS.length; id++) {
    const location = LANDMARKS[id]
    const district = new THREE.Group()
    district.position.copy(location)
    district.userData.nodeId = id
    scene.add(district)
    cityGroups.push(district)
    const accent = ownMaterial(new THREE.MeshBasicMaterial({ color: districtAccents[id] }))
    mesh(deckGeometry, palette.navy, [0, -0.9, 0], [1, 1, 1], district)
    mesh(deckGeometry, palette.steel, [0, -0.40, 0], [1.025, 0.15, 1.025], district)
    mesh(deckGeometry, pavement, [0, -0.23, 0], [1, 0.075, 1], district)
    mesh(box, asphalt, [0, -0.10, 1.34], [4.52, 0.08, 0.56], district)
    mesh(box, asphalt, [-1.35, -0.09, 0], [0.45, 0.06, 3.35], district)
    // Lane dashes, zebra crossings, transit shelters, and a compact civic plaza.
    for (let i = 0; i < 8; i++) mesh(box, palette.cream, [-2 + i * 0.54, -0.052, 1.34], [0.23, 0.013, 0.035], district)
    for (let i = 0; i < 5; i++) mesh(box, palette.cream, [-1.54 + i * 0.085, -0.045, 0.86], [0.045, 0.015, 0.30], district)
    mesh(box, palette.steel, [1.55, 0.12, 1.0], [0.7, 0.055, 0.21], district)
    mesh(box, glassPale, [1.55, 0.39, 0.9], [0.7, 0.48, 0.025], district)
    mesh(box, palette.cream, [1.55, 0.66, 0.98], [0.8, 0.055, 0.33], district)
    for (const lx of [-2.09, 2.1]) {
      mesh(cylinder, palette.steel, [lx, 0.52, 1.03], [0.024, 1.14, 0.024], district)
      mesh(box, accent, [lx, 1.10, 1.03], [0.21, 0.045, 0.11], district)
      mesh(box, accent, [lx, -0.56, 0], [0.032, 0.08, 2.8], district)
    }
    // Skyline sits behind the main framework landmark; low blocks flank the plaza.
    office(district, -1.84, -1.12, 0.56, 0.72, 1.9 + (id % 3) * 0.48, id)
    office(district, -0.93, -1.22, 0.54, 0.59, 2.6 + (id % 2) * 0.6, id + 1)
    office(district, 1.63, -1.05, 0.69, 0.74, 1.75 + ((id + 1) % 3) * 0.4, id + 2)
    office(district, 1.84, 0.23, 0.48, 0.62, 0.74, id + 3)
    office(district, -1.88, 0.22, 0.53, 0.62, 0.9, id + 4)
    // Hover engines are functional-looking metal nozzles with blue exhaust cones.
    for (const ex of [-1.35, 1.35]) {
      mesh(cylinder, palette.stone, [ex, -1.05, 0.1], [0.54, 0.57, 0.54], district)
      mesh(cylinder, palette.steel, [ex, -1.33, 0.1], [0.61, 0.12, 0.61], district)
      const glowRing = mesh(ringGeometry, accent, [ex, -1.41, 0.1], [0.48, 0.48, 0.48], district)
      glowRing.rotation.x = Math.PI / 2
      const exhaust = mesh(cone, engineGlass, [ex, -1.97, 0.1], [0.38, 1.1, 0.38], district)
      exhaust.rotation.z = Math.PI
      engines.push(exhaust)
    }
    const beacon = mesh(ownGeometry(new THREE.TorusGeometry(2.16, 0.042, 5, 6)), accent, [0, -0.19, 0], [1.05, 0.88, 1], district)
    beacon.rotation.x = Math.PI / 2
    districtBeacons.push(beacon)
  }
  // Batch repeated static architectural parts per district/material without losing
  // geometry, district selection, or the separately controlled beacon/exhaust meshes.
  for (const district of cityGroups) {
    const batches = new Map<string, THREE.Mesh[]>()
    for (const child of district.children) {
      if (!(child instanceof THREE.Mesh) || ![box, cylinder].includes(child.geometry) || Array.isArray(child.material)) continue
      const key = `${child.geometry.uuid}:${child.material.uuid}`
      const entries = batches.get(key) ?? []
      entries.push(child)
      batches.set(key, entries)
    }
    for (const entries of batches.values()) {
      if (entries.length < 2) continue
      const instances = new THREE.InstancedMesh(entries[0].geometry, entries[0].material, entries.length)
      entries.forEach((entry, index) => { entry.updateMatrix(); instances.setMatrixAt(index, entry.matrix); district.remove(entry) })
      instances.castShadow = instances.receiveShadow = true
      district.add(instances)
    }
  }
  const windows = new THREE.InstancedMesh(box, ownMaterial(new THREE.MeshBasicMaterial({ color: 0x7e9aa5 })), cityWindowMatrices.length)
  cityWindowMatrices.forEach((matrix, i) => { windows.setMatrixAt(i, matrix); windows.setColorAt(i, cityWindowColors[i]) })
  scene.add(windows)
  const cloudMaterial = ownMaterial(new THREE.MeshBasicMaterial({ color: 0x6c9eae, transparent: true, opacity: 0.10, depthWrite: false }))
  for (const [x, z, size] of [[-9, -2, 2], [-4, 4.6, 2.6], [2.7, 6.3, 2.4], [7.4, -4.5, 1.7], [-1, -7.5, 2]]) {
    for (let i = 0; i < 3; i++) {
      const cloud = mesh(sphere, cloudMaterial, [x + i * 0.6, -2.6 - i * 0.1, z], [size * 0.7, 0.37 + i * 0.08, size * 0.42])
      cloud.castShadow = cloud.receiveShadow = false
    }
  }

  const buildingGroups: THREE.Group[] = []
  const selectionRings: THREE.Mesh[] = []
  const buildingLights: THREE.Mesh[] = []
  function station(id: number, radius = 1.22) {
    const group = new THREE.Group()
    group.position.copy(LANDMARKS[id])
    group.userData.nodeId = id
    scene.add(group)
    buildingGroups.push(group)
    mesh(cylinder, palette.stone, [0, -0.1, 0], [radius, 0.27, radius], group)
    mesh(cylinder, palette.steel, [0, 0.035, 0], [radius * 0.91, 0.06, radius * 0.91], group)
    mesh(cylinder, palette.navy, [0, 0.08, 0], [radius * 0.85, 0.06, radius * 0.85], group)
    const halo = ring(group, radius + 0.12, 0.025, palette.goldGlow)
    halo.visible = id === selected
    selectionRings.push(halo)
    const light = ring(group, radius * 0.91, 0.075, palette.glow)
    buildingLights.push(light)
    for (let i = 0; i < 3; i++) mesh(box, palette.cream, [0, -0.07 + i * 0.055, radius + 0.20 - i * 0.13], [0.72, 0.10, 0.2], group)
    return group
  }

  // PostgreSQL: cylindrical source with visible stacked storage trays.
  const postgres = station(0)
  mesh(cylinder, palette.navy, [0, 1.13, 0], [0.66, 2.05, 0.66], postgres)
  for (let i = 0; i < 4; i++) {
    mesh(cylinder, palette.steel, [0, 0.30 + i * 0.54, 0], [0.72, 0.11, 0.72], postgres)
    ring(postgres, 0.685, 0.42 + i * 0.54, palette.glow)
  }
  mesh(sphere, palette.cyan, [0, 2.34, 0], [0.46, 0.17, 0.46], postgres)
  for (let i = 0; i < 3; i++) mesh(box, palette.glow, [-0.25 + i * 0.25, 1.2, 0.675], [0.06, 0.12, 0.02], postgres)

  // Debezium: a capture gate, its inner scanning field kept translucent.
  const debezium = station(1, 1.15)
  for (const x of [-0.73, 0.73]) {
    mesh(box, palette.navy, [x, 1.1, 0], [0.30, 2.02, 0.5], debezium)
    mesh(box, palette.gold, [x, 2.14, 0], [0.4, 0.14, 0.62], debezium)
    mesh(box, palette.glow, [x, 1.1, 0.27], [0.09, 1.48, 0.025], debezium)
  }
  mesh(box, palette.steel, [0, 2.12, 0], [1.75, 0.21, 0.55], debezium)
  mesh(box, ownMaterial(new THREE.MeshBasicMaterial({ color: 0x55edd6, transparent: true, opacity: 0.17, depthWrite: false, side: THREE.DoubleSide })), [0, 1.1, 0], [1.15, 1.75, 0.025], debezium)
  const scanner = mesh(box, palette.glow, [0, 0.9, 0.05], [1.17, 0.035, 0.06], debezium)

  // Kafka: three equal broker towers around a shared circular log plaza.
  const kafka = station(2, 1.64)
  ring(kafka, 1.16, 0.14, palette.gold)
  const towerCoords = [[-0.73, 0.26], [0.65, 0.3], [0, -0.69]]
  for (let i = 0; i < towerCoords.length; i++) {
    const [x, z] = towerCoords[i]
    mesh(cylinder, palette.navy, [x, 1.16, z], [0.42, 2.05, 0.42], kafka)
    mesh(cone, palette.steel, [x, 2.31, z], [0.53, 0.38, 0.53], kafka)
    for (let j = 0; j < 4; j++) {
      const window = mesh(box, j % 2 ? palette.goldGlow : palette.glow, [x, 0.55 + j * 0.4, z + 0.41], [0.21, 0.11, 0.035], kafka)
      window.castShadow = false
    }
    mesh(sphere, palette.goldGlow, [x, 2.59, z], [0.085, 0.085, 0.085], kafka)
  }
  mesh(cylinder, palette.gold, [0, 0.27, 0], [0.37, 0.24, 0.37], kafka)

  // Kafka Streams: an urban processing reactor with a visible transformation core.
  const streams = station(3, 1.23)
  mesh(cylinder, palette.teal, [0, 0.71, 0], [0.71, 1.2, 0.71], streams)
  mesh(cone, palette.steel, [0, 1.45, 0], [0.83, 0.5, 0.83], streams)
  const processorCore = mesh(octahedron, palette.goldGlow, [0, 2.10, 0], [0.34, 0.57, 0.34], streams)
  const processorRings: THREE.Mesh[] = []
  for (let i = 0; i < 2; i++) {
    const orbitRing = mesh(ringGeometry, i ? palette.gold : palette.glow, [0, 2.1, 0], [0.78, 0.78, 0.78], streams)
    orbitRing.rotation.set(0.55 + i * 1.2, 0, 0.65)
    processorRings.push(orbitRing)
  }
  const mill = new THREE.Group()
  mill.position.set(0, 0.81, 0.77)
  streams.add(mill)
  mesh(ringGeometry, palette.gold, [0, 0, 0], [0.52, 0.52, 0.52], mill)
  for (let i = 0; i < 8; i++) {
    const spoke = mesh(box, palette.steel, [Math.sin(i * TAU / 8) * 0.3, Math.cos(i * TAU / 8) * 0.3, 0], [0.11, 0.36, 0.12], mill)
    spoke.rotation.z = -i * TAU / 8
  }

  // Snowflake: a cluster of cut crystals, each face catches the twilight.
  const warehouse = station(4, 1.42)
  const crystalMat = material(0x9bdfef, { metalness: 0.2, roughness: 0.22, emissive: 0x207391, emissiveIntensity: 0.3 })
  for (const [x, z, h, r] of [[0, 0, 2.9, 0.68], [-0.69, 0.12, 1.76, 0.42], [0.67, 0.31, 1.57, 0.4], [0.2, -0.65, 2.13, 0.46]]) {
    const crystal = mesh(octahedron, crystalMat, [x, 0.18 + h / 2, z], [r, h / 2, r], warehouse)
    crystal.rotation.y = 0.4 + x
  }
  ring(warehouse, 1.08, 0.2, palette.glow)

  // Airflow's elevated observatory is visually separate from the data road.
  const airflow = station(5, 1.2)
  mesh(cylinder, palette.cream, [0, 0.88, 0], [0.56, 1.52, 0.56], airflow)
  mesh(cylinder, palette.navy, [0, 1.69, 0], [0.76, 0.16, 0.76], airflow)
  mesh(ownGeometry(new THREE.SphereGeometry(0.73, 12, 6, 0, TAU, 0, Math.PI / 2)), palette.teal, [0, 1.77, 0], [1, 1, 1], airflow)
  for (const x of [-0.31, 0.31]) mesh(box, palette.navy, [x, 1.09, 0.52], [0.17, 0.38, 0.025], airflow)
  mesh(cylinder, palette.gold, [0, 2.39, 0], [0.035, 1.12, 0.035], airflow)
  const windmill = new THREE.Group()
  windmill.position.set(0, 2.9, 0.08)
  airflow.add(windmill)
  const bladeColors = [palette.cyan, palette.cream, palette.gold, palette.lavender]
  for (let i = 0; i < 4; i++) {
    const blade = mesh(box, bladeColors[i], [Math.sin(i * Math.PI / 2) * 0.3, Math.cos(i * Math.PI / 2) * 0.3, 0], [0.22, 0.6, 0.05], windmill)
    blade.rotation.z = -i * Math.PI / 2 + 0.35
  }
  mesh(sphere, palette.goldGlow, [0, 0, 0.06], [0.13, 0.13, 0.13], windmill)

  type Route = {
    id: string
    curve: THREE.CatmullRomCurve3
    line: THREE.Mesh | THREE.Line
    material: THREE.MeshBasicMaterial | THREE.LineDashedMaterial
    arrows: THREE.Mesh[]
    arrowMaterial: THREE.MeshBasicMaterial
    scenarios: number[]
    control: boolean
    glow?: THREE.Mesh
  }
  const routes: Route[] = []
  const bridgeRail = material(0x4d6573, { metalness: 0.35, roughness: 0.6 })
  const arrowGeometry = ownGeometry(new THREE.BufferGeometry())
  arrowGeometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0.28, -0.18, 0, -0.12, 0, 0, -0.035, 0, 0, 0.28, 0, 0, -0.035, 0.18, 0, -0.12], 3))
  arrowGeometry.computeVertexNormals()
  function skybridge(curve: THREE.CatmullRomCurve3) {
    const vertices: number[] = []
    const left: THREE.Vector3[] = []
    const right: THREE.Vector3[] = []
    for (let i = 0; i <= 80; i++) {
      const p = curve.getPointAt(i / 80)
      const tangent = curve.getTangentAt(i / 80)
      const normal = new THREE.Vector3(tangent.z, 0, -tangent.x).normalize().multiplyScalar(0.29)
      left.push(p.clone().add(normal).add(new THREE.Vector3(0, 0.04, 0)))
      right.push(p.clone().sub(normal).add(new THREE.Vector3(0, 0.04, 0)))
      if (i > 0) {
        const a = left[i - 1].clone().add(new THREE.Vector3(0, -0.19, 0))
        const b = right[i - 1].clone().add(new THREE.Vector3(0, -0.19, 0))
        const c = left[i].clone().add(new THREE.Vector3(0, -0.19, 0))
        const d = right[i].clone().add(new THREE.Vector3(0, -0.19, 0))
        vertices.push(...a.toArray(), ...c.toArray(), ...b.toArray(), ...b.toArray(), ...c.toArray(), ...d.toArray())
      }
    }
    const deck = ownGeometry(new THREE.BufferGeometry())
    deck.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    deck.computeVertexNormals()
    mesh(deck, ownMaterial(new THREE.MeshStandardMaterial({ color: 0x294253, roughness: 0.68, metalness: 0.35, side: THREE.DoubleSide })), [0, 0, 0], [1, 1, 1])
    tube(new THREE.CatmullRomCurve3(left), 0.025, bridgeRail)
    tube(new THREE.CatmullRomCurve3(right), 0.025, bridgeRail)
    const supports = Math.max(4, Math.round(curve.getLength() / 0.65))
    const crossbeams = new THREE.InstancedMesh(box, palette.navy, supports)
    for (let i = 0; i < supports; i++) {
      const t = (i + 0.5) / supports
      dummy.position.copy(curve.getPointAt(t))
      dummy.position.y -= 0.22
      const tangent = curve.getTangentAt(t)
      dummy.rotation.set(0, Math.atan2(tangent.x, tangent.z), 0)
      dummy.scale.set(0.7, 0.10, 0.1)
      dummy.updateMatrix()
      crossbeams.setMatrixAt(i, dummy.matrix)
    }
    scene.add(crossbeams)
  }
  function route(id: string, points: number[][], scenarios: number[], control = false) {
    const curve = path(points)
    const lineMaterial = control
      ? ownMaterial(new THREE.LineDashedMaterial({ color: 0xffd27c, dashSize: 0.17, gapSize: 0.12, transparent: true, opacity: 0.55 }))
      : ownMaterial(new THREE.MeshBasicMaterial({ color: 0x70e8e0, transparent: true, opacity: 0.4, toneMapped: false }))
    const arrowMaterial = ownMaterial(new THREE.MeshBasicMaterial({ color: 0xb3fff4, transparent: true, opacity: 0.5, side: THREE.DoubleSide, toneMapped: false }))
    let line: THREE.Mesh | THREE.Line
    let glow: THREE.Mesh | undefined
    if (control) {
      line = new THREE.Line(ownGeometry(new THREE.BufferGeometry().setFromPoints(curve.getPoints(120))), lineMaterial)
      line.computeLineDistances()
      scene.add(line)
    } else {
      skybridge(curve)
      line = tube(curve, 0.09, lineMaterial)
      glow = tube(curve, 0.17, ownMaterial(new THREE.MeshBasicMaterial({ color: 0x44ffe5, transparent: true, opacity: 0.16, depthWrite: false, toneMapped: false })))
    }
    const arrows: THREE.Mesh[] = []
    for (const t of [0.24, 0.52, 0.78]) {
      const point = curve.getPointAt(t)
      const tangent = curve.getTangentAt(t)
      const arrow = mesh(arrowGeometry, arrowMaterial, [point.x, point.y + 0.09, point.z], [control ? 0.9 : 1.45, 1, control ? 0.9 : 1.45])
      arrow.rotation.y = Math.atan2(tangent.x, tangent.z)
      arrow.castShadow = false
      arrows.push(arrow)
    }
    routes.push({ id, curve, line, material: lineMaterial, arrows, arrowMaterial, scenarios, control, glow })
  }
  // Front-facing loading ports keep the followed object visible outside buildings.
  // The return bridge is offset from the outbound Streams bridge, never the reverse
  // animation of the same event: its lavender packet is a new processed result.
  route('0>1', [[-7, 0.92, 4.42], [-9.85, 1.03, 4.55], [-10.15, 1.06, 1.1], [-8.6, 1.05, -0.7], [-4.7, 0.92, -1.18]], [0, 1])
  route('1>2', [[-4.7, 0.92, -1.18], [-3.0, 1.03, -0.8], [-3.1, 1.1, 1.8], [-2.9, 1.1, 3.25], [0, 0.92, 3.02]], [0, 1])
  route('2>4', [[0, 0.92, 3.02], [2.4, 0.95, 4.1], [5.0, 1.03, 4.75], [7.2, 0.92, 4.72]], [0, 1])
  route('2>3', [[0, 0.92, 3.02], [2.9, 1.5, 3.4], [3.3, 1.5, 0.5], [4.5, 0.92, -1.38]], [1])
  route('3>2', [[4.5, 0.92, -1.38], [2.6, 1.75, -0.75], [2.45, 1.75, 1.6], [1.75, 1.6, 3.8], [0, 0.92, 3.02]], [1])
  route('0>4', [[-7, 0.92, 4.42], [-5.0, 1.02, 6.2], [0, 1.14, 7.2], [5.0, 1.03, 6.5], [7.2, 0.92, 4.72]], [2])
  route('5>0', [[-0.3, 3.45, -6.7], [-3.6, 6.0, -4.3], [-7.2, 4.8, 0.5], [-7, 3.3, 2.7]], [2], true)
  route('5>4', [[-0.3, 3.45, -6.7], [3.3, 6.6, -4.2], [7.1, 5.3, 0.2], [7.2, 3.75, 3]], [2], true)

  // A single, large followed object makes route semantics observable. Batch mode
  // packages exactly three records; scheduling has its own separate amber signal.
  const packetGroup = new THREE.Group()
  scene.add(packetGroup)
  const packetMaterial = ownMaterial(new THREE.MeshBasicMaterial({ color: 0xb7fff4 }))
  const eventPacket = new THREE.Group()
  packetGroup.add(eventPacket)
  mesh(box, packetMaterial, [0, 0.16, 0], [0.38, 0.40, 0.48], eventPacket)
  mesh(box, palette.navy, [0, 0.375, 0], [0.25, 0.025, 0.28], eventPacket)
  for (let i = 0; i < 3; i++) mesh(box, palette.cream, [0, 0.388, -0.08 + i * 0.08], [0.17, 0.017, 0.027], eventPacket)
  const packetHalo = mesh(ringGeometry, palette.glow, [0, -0.04, 0], [0.47, 0.47, 0.47], eventPacket)
  packetHalo.rotation.x = Math.PI / 2
  const batchPacket = new THREE.Group()
  packetGroup.add(batchPacket)
  mesh(box, palette.gold, [0, 0, 0], [0.84, 0.1, 0.46], batchPacket)
  for (const x of [-0.27, 0, 0.27]) mesh(box, packetMaterial, [x, 0.25, 0], [0.22, 0.41, 0.32], batchPacket)
  const controlSignal = new THREE.Group()
  scene.add(controlSignal)
  mesh(octahedron, palette.goldGlow, [0, 0, 0], [0.13, 0.22, 0.13], controlSignal)
  const signalRing = mesh(ringGeometry, palette.goldGlow, [0, 0, 0], [0.31, 0.31, 0.31], controlSignal)
  signalRing.rotation.x = Math.PI / 2

  function recordScenario() {
    container.dataset.worldScenario = String(scenario)
    container.dataset.worldRecordRoutes = ['0>1,1>2,2>4', '0>1,1>2,2>3,3>2,2>4', '0>4'][scenario]
    container.dataset.worldControlRoutes = scenario === 2 ? '5>0,5>4' : ''
  }

  const projectionVector = new THREE.Vector3()
  function projectPoint(position: THREE.Vector3, id: number, lift: number, visible = true): DataWorldProjection {
    projectionVector.copy(position)
    projectionVector.y += lift
    projectionVector.project(camera)
    return { id, x: (projectionVector.x + 1) * width / 2, y: (1 - projectionVector.y) * height / 2, visible: visible && projectionVector.z > -1 && projectionVector.z < 1 && Math.abs(projectionVector.x) < 1.15 && Math.abs(projectionVector.y) < 1.15 }
  }
  function projectLabels() {
    if (!width || !height || disposed) return
    onProject([
      ...LANDMARKS.map((position, id) => projectPoint(position, id, LABEL_HEIGHTS[id])),
      projectPoint(packetGroup.position, 6, 0.62, packetGroup.visible && !reduced && !currentFrame.complete),
    ])
  }
  function updateCamera() {
    const aspect = width / Math.max(1, height)
    const viewHeight = Math.max(21.5, 29.0 / Math.max(0.1, aspect))
    camera.left = -viewHeight * aspect / 2
    camera.right = viewHeight * aspect / 2
    camera.top = viewHeight / 2
    camera.bottom = -viewHeight / 2
    camera.zoom = zoomLevel
    const distance = 37
    camera.position.set(Math.sin(yaw) * Math.cos(pitch) * distance, Math.sin(pitch) * distance + 0.6, Math.cos(yaw) * Math.cos(pitch) * distance)
    camera.lookAt(0, 0.6, 0)
    camera.updateProjectionMatrix()
    camera.updateMatrixWorld()
    container.dataset.worldYaw = yaw.toFixed(3)
    container.dataset.worldPitch = pitch.toFixed(3)
    container.dataset.worldZoom = zoomLevel.toFixed(3)
  }
  function updateAnimatedObjects() {
    currentFrame = getWorldFrame(scenario, elapsed * 1000, reduced)
    const stage = WORLD_TIMELINES[scenario][currentFrame.stage]
    const frameKey = `${scenario}:${currentFrame.stage}:${reduced}`
    if (lastFrameKey !== frameKey) {
      lastFrameKey = frameKey
      onFrame?.(currentFrame)
    }
    const traversed = new Set(WORLD_TIMELINES[scenario].slice(0, currentFrame.stage).map(step => step.edge).filter(Boolean))
    container.dataset.worldStage = String(currentFrame.stage)
    container.dataset.worldCycle = String(currentFrame.cycle)
    container.dataset.worldPacket = stage.packet
    container.dataset.worldActiveEdge = stage.edge ?? ''
    container.dataset.worldProgress = currentFrame.progress.toFixed(3)
    container.dataset.worldComplete = String(currentFrame.complete)
    const mechanismPhase = reduced ? 0 : currentFrame.progress * TAU
    scanner.position.y = stage.node === 1 && !reduced ? 0.45 + (Math.sin(mechanismPhase) + 1) * 0.66 : 1.1
    const processing = !reduced && stage.node === 3 && stage.packet === 'result'
    processorCore.rotation.y = processing ? mechanismPhase : 0.3
    processorRings[0].rotation.y = processing ? mechanismPhase * 0.5 : 0.4
    processorRings[1].rotation.y = processing ? -mechanismPhase * 0.32 : -0.3
    mill.rotation.z = processing ? -mechanismPhase : 0
    windmill.rotation.z = !reduced && stage.packet === 'control' ? -mechanismPhase * 2 : 0.35
    let activeRoute: Route | undefined
    for (const route of routes) {
      const enabled = route.scenarios.includes(scenario)
      const following = enabled && route.id === stage.edge && !reduced
      const visited = enabled && (reduced || traversed.has(route.id))
      const processed = scenario === 1 && ['3>2', '2>4'].includes(route.id)
      const color = route.control ? 0xffd27c : processed ? 0xb995ff : 0x44ffe5
      route.material.color.setHex(color)
      route.arrowMaterial.color.setHex(color)
      route.material.opacity = following ? 1 : visited ? 0.5 : enabled ? 0.09 : 0.035
      route.arrowMaterial.opacity = following ? 1 : visited ? 0.9 : enabled ? 0.24 : 0.045
      if (route.glow) {
        route.glow.visible = following
        const glowMaterial = route.glow.material as THREE.MeshBasicMaterial
        glowMaterial.color.setHex(color)
      }
      route.line.visible = !route.control || enabled
      route.arrows.forEach(arrow => { arrow.visible = !route.control || enabled })
      if (following) activeRoute = route
    }
    packetGroup.visible = !reduced && stage.packet !== 'control'
    eventPacket.visible = stage.packet !== 'batch'
    batchPacket.visible = stage.packet === 'batch'
    packetMaterial.color.setHex(stage.packet === 'result' ? 0xd7c3ff : stage.packet === 'row' ? 0xc5e7ff : 0xa3fff2)
    controlSignal.visible = !reduced && stage.packet === 'control' && !!activeRoute
    if (activeRoute && stage.edge) {
      const position = activeRoute.curve.getPointAt(currentFrame.progress)
      const tangent = activeRoute.curve.getTangentAt(currentFrame.progress)
      if (stage.packet === 'control') {
        controlSignal.position.copy(position)
      } else {
        packetGroup.position.copy(position)
        packetGroup.position.y += 0.18
        packetGroup.rotation.y = Math.atan2(tangent.x, tangent.z)
      }
    } else {
      packetGroup.position.copy(LANDMARKS[stage.node])
      packetGroup.position.y = 1.1
      packetGroup.position.z += 1.72
      packetGroup.rotation.y = 0
    }
    // A completed delivery stays visibly parked. The HTML badge disappears to
    // expose the destination, and the next cycle explicitly begins a fresh example.
    container.dataset.worldPacketVisible = String(packetGroup.visible)
    container.dataset.worldSignalVisible = String(controlSignal.visible)
    for (let i = 0; i < selectionRings.length; i++) {
      selectionRings[i].visible = i === selected
      const relevant = scenario === 2 ? [0, 4, 5].includes(i) : scenario === 0 ? [0, 1, 2, 4].includes(i) : i !== 5
      buildingLights[i].visible = relevant
      districtBeacons[i].visible = reduced ? relevant : i === stage.node
    }
  }
  function draw() {
    if (disposed || contextLost || width < 1 || height < 1) return
    updateAnimatedObjects()
    renderer.render(scene, camera)
    onProject([projectPoint(packetGroup.position, 6, 0.62, packetGroup.visible && !reduced && !currentFrame.complete)])
    container.dataset.worldDrawCalls = String(renderer.info.render.calls)
    frameCount++
    container.dataset.worldFrame = String(frameCount)
    container.dataset.worldTime = elapsed.toFixed(2)
  }
  function tick(timestamp: number) {
    frameHandle = 0
    if (disposed || !active || reduced || contextLost || !width || !height) return
    if (previousTime) elapsed += Math.min((timestamp - previousTime) / 1000, 0.05)
    previousTime = timestamp
    draw()
    frameHandle = window.requestAnimationFrame(tick)
  }
  function syncAnimation() {
    window.cancelAnimationFrame(frameHandle)
    frameHandle = 0
    previousTime = 0
    const running = active && !reduced && !contextLost && width > 0 && height > 0
    container.dataset.worldState = contextLost ? 'unavailable' : reduced ? 'reduced' : running ? 'running' : 'suspended'
    draw()
    if (running && !disposed) frameHandle = window.requestAnimationFrame(tick)
  }
  function resize() {
    if (disposed) return
    const rect = container.getBoundingClientRect()
    width = Math.round(rect.width)
    height = Math.round(rect.height)
    if (width > 0 && height > 0) {
      renderer.setSize(width, height, false)
      updateCamera()
      projectLabels()
    }
    syncAnimation()
  }
  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(container)

  const raycaster = new THREE.Raycaster()
  let drag: { id: number; x: number; y: number; startX: number; startY: number; moved: boolean; touch: boolean } | null = null
  function orbit(yawDelta: number, pitchDelta: number) {
    if (disposed || !Number.isFinite(yawDelta) || !Number.isFinite(pitchDelta)) return
    yaw += yawDelta
    pitch = clamp(pitch + pitchDelta, 0.36, 1.15)
    updateCamera()
    projectLabels()
    draw()
  }
  function pointerDown(event: PointerEvent) {
    if (!event.isPrimary || event.button !== 0) return
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY, moved: false, touch: event.pointerType === 'touch' }
    if (event.pointerType !== 'touch') canvas.setPointerCapture(event.pointerId)
  }
  function pointerMove(event: PointerEvent) {
    if (!drag || drag.id !== event.pointerId) return
    const deltaX = event.clientX - drag.x
    const deltaY = event.clientY - drag.y
    const totalX = event.clientX - drag.startX
    const totalY = event.clientY - drag.startY
    if (Math.hypot(totalX, totalY) > 6) drag.moved = true
    if (drag.moved && (!drag.touch || Math.abs(totalX) > Math.abs(totalY))) orbit(-deltaX * 0.006, drag.touch ? 0 : deltaY * 0.005)
    drag.x = event.clientX
    drag.y = event.clientY
  }
  function pointerUp(event: PointerEvent) {
    if (!drag || drag.id !== event.pointerId) return
    const click = !drag.moved
    drag = null
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
    if (!click || !width || !height) return
    const bounds = canvas.getBoundingClientRect()
    raycaster.setFromCamera(new THREE.Vector2((event.clientX - bounds.left) / bounds.width * 2 - 1, -(event.clientY - bounds.top) / bounds.height * 2 + 1), camera)
    const hit = raycaster.intersectObjects([...buildingGroups, ...cityGroups], true)[0]
    let object: THREE.Object3D | null = hit?.object ?? null
    while (object && object.userData.nodeId === undefined) object = object.parent
    if (object && typeof object.userData.nodeId === 'number') onSelect(object.userData.nodeId)
  }
  function pointerCancel() { drag = null }
  function onContextLost(event: Event) {
    event.preventDefault()
    contextLost = true
    syncAnimation()
    container.dispatchEvent(new CustomEvent('dataworldunavailable'))
  }
  function onContextRestored() {
    contextLost = false
    resize()
  }
  canvas.addEventListener('pointerdown', pointerDown)
  canvas.addEventListener('pointermove', pointerMove)
  canvas.addEventListener('pointerup', pointerUp)
  canvas.addEventListener('pointercancel', pointerCancel)
  canvas.addEventListener('lostpointercapture', pointerCancel)
  canvas.addEventListener('webglcontextlost', onContextLost)
  canvas.addEventListener('webglcontextrestored', onContextRestored)
  recordScenario()
  container.dataset.worldSelected = '2'
  resize()

  return {
    setScenario(index) {
      if (disposed || !Number.isFinite(index)) return
      scenario = clamp(Math.round(index), 0, 2)
      elapsed = 0
      previousTime = 0
      lastFrameKey = ''
      recordScenario()
      draw()
    },
    setSelected(id) {
      if (disposed || !Number.isFinite(id)) return
      selected = clamp(Math.round(id), 0, 5)
      container.dataset.worldSelected = String(selected)
      draw()
    },
    orbit,
    zoom(factor) {
      if (disposed || !Number.isFinite(factor) || factor <= 0) return
      zoomLevel = clamp(zoomLevel * factor, 0.72, 1.65)
      updateCamera()
      projectLabels()
      draw()
    },
    resetView() {
      if (disposed) return
      yaw = 0.43
      pitch = 0.68
      zoomLevel = 1
      updateCamera()
      projectLabels()
      draw()
    },
    setActive(value) {
      if (disposed || active === value) return
      active = value
      syncAnimation()
    },
    setReducedMotion(value) {
      if (disposed || reduced === value) return
      reduced = value
      syncAnimation()
    },
    dispose() {
      if (disposed) return
      disposed = true
      window.cancelAnimationFrame(frameHandle)
      resizeObserver.disconnect()
      canvas.removeEventListener('pointerdown', pointerDown)
      canvas.removeEventListener('pointermove', pointerMove)
      canvas.removeEventListener('pointerup', pointerUp)
      canvas.removeEventListener('pointercancel', pointerCancel)
      canvas.removeEventListener('lostpointercapture', pointerCancel)
      canvas.removeEventListener('webglcontextlost', onContextLost)
      canvas.removeEventListener('webglcontextrestored', onContextRestored)
      geometries.forEach(value => value.dispose())
      materials.forEach(value => value.dispose())
      renderer.dispose()
      renderer.forceContextLoss()
      scene.clear()
      canvas.remove()
      container.dataset.worldState = 'disposed'
    },
  }
}
