const DURATION = 6.4;
const clamp = value => Math.max(0, Math.min(1, value));
const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
const mix = (a, b, t) => a + (b - a) * t;

// Angles are radians; the rig uses Minecraft's 8 × 8 head and 32-unit height.
export function avatarPose(time) {
  const t = Math.max(0, time);
  const pose = { x: 0, y: 0, yaw: .2, lean: 0, head: 0, armR: 0, armL: 0, elbowR: 0, elbowL: 0, wave: 0, legR: 0, legL: 0, kneeR: 0, kneeL: 0 };
  if (t < 1.2) {
    const stride = Math.sin(t * 16);
    Object.assign(pose, { x: mix(-34, -12, t / 1.2), y: Math.abs(stride) * .8, yaw: 1.1, lean: .16,
      armR: stride * .95, armL: -stride * .95, elbowR: -.7, elbowL: -.7,
      legR: -stride * .95, legL: stride * .95, kneeR: Math.max(0, stride) * .9, kneeL: Math.max(0, -stride) * .9 });
  } else if (t < 2.4) {
    const u = (t - 1.2) / 1.2, tuck = Math.sin(Math.PI * u);
    Object.assign(pose, { x: mix(-12, 0, smooth(u)), y: Math.sin(Math.PI * u) * 14,
      yaw: mix(1.1, .2, smooth(u)), lean: .25 * tuck, armR: -1.3 * tuck, armL: -1.15 * tuck,
      elbowR: -.9 * tuck, elbowL: -1.1 * tuck, legR: -.95 * tuck, legL: -.7 * tuck, kneeR: 1.6 * tuck, kneeL: 1.3 * tuck });
  } else if (t < 3.3) {
    const crouch = Math.sin(Math.PI * (t - 2.4) / .9);
    Object.assign(pose, { lean: .35 * crouch, armR: -.35 * crouch, armL: -.35 * crouch,
      legR: -1.1 * crouch, legL: -1.1 * crouch, kneeR: 1.8 * crouch, kneeL: 1.8 * crouch });
  } else {
    const raise = smooth((t - 3.3) / .65), settle = smooth((t - 5.75) / .65);
    const wave = Math.sin((t - 3.95) * 11) * .28 * raise * (1 - settle);
    Object.assign(pose, { head: -.08 * raise, armL: -.08 * raise, wave: -2.15 * raise,
      elbowR: -.18 * raise, armR: -.12 * raise, elbowL: -.08 * raise });
    pose.wave += wave;
  }
  return pose;
}

export async function mountContactAvatar(host, onComplete) {
  const T = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');
  const canvas = host.querySelector('canvas');
  const renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(4, Math.max(2, window.devicePixelRatio || 1)));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  const scene = new T.Scene();
  const camera = new T.OrthographicCamera(-42, 42, 30, -30, .1, 250);
  camera.position.set(42, 33, 95); camera.lookAt(0, 22, 0);
  scene.add(new T.HemisphereLight(0xffffff, 0xb4b3c6, 2.1));
  const key = new T.DirectionalLight(0xfff2df, 3.2);
  key.position.set(-25, 65, 55); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -45, right: 45, top: 45, bottom: -45, near: 1, far: 160 });
  key.shadow.normalBias = .08; key.shadow.bias = -.0003; key.shadow.radius = 4;
  scene.add(key);
  const rim = new T.DirectionalLight(0xc9ceff, 1.6); rim.position.set(25, 35, -30); scene.add(rim);
  const floor = new T.Mesh(new T.PlaneGeometry(180, 120), new T.ShadowMaterial({ opacity: .16 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -.15; floor.receiveShadow = true; scene.add(floor);

  const material = (color, roughness = .88) => new T.MeshStandardMaterial({ color, roughness });
  const skin = material('#ad7856'), cuff = material('#e8e9ec'), sole = material('#161b25');
  const hair = ['#201b1a', '#29211e', '#352920', '#403025'].map(color => material(color));
  // Each face is painted on a 64-pixel grid, with deterministic cloth/skin variation.
  const texture = (base, paint, salt = 0) => {
    const image = document.createElement('canvas'); image.width = image.height = 64;
    const ctx = image.getContext('2d'); ctx.fillStyle = base; ctx.fillRect(0, 0, 64, 64);
    for (let y = 0; y < 64; y += 2) for (let x = 0; x < 64; x += 2) {
      const n = ((x * 19 + y * 37 + x * y * 7 + salt * 11) % 23) / 23;
      ctx.fillStyle = n < .5 ? `rgba(0,0,0,${(.5 - n) * .12})` : `rgba(255,255,255,${(n - .5) * .1})`;
      ctx.fillRect(x, y, 2, 2);
    }
    const rect = (color, x, y, w, h) => { ctx.fillStyle = color; ctx.fillRect(x, y, w, h); };
    paint?.(rect);
    const map = new T.CanvasTexture(image); map.colorSpace = T.SRGBColorSpace;
    map.magFilter = T.NearestFilter; map.minFilter = T.NearestMipmapNearestFilter;
    map.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return new T.MeshStandardMaterial({ map, roughness: .88 });
  };
  const face = texture('#b98863', r => {
    r('#34261f', 0, 0, 64, 15); r('#2a211d', 0, 12, 10, 26); r('#2a211d', 56, 12, 8, 26);
    r('#50372a', 10, 12, 6, 7); r('#463026', 45, 12, 11, 5);
    r('#c99a76', 17, 19, 30, 8); r('#a8704d', 28, 30, 8, 18);
    r('#362720', 10, 24, 17, 4); r('#362720', 38, 24, 16, 4);
    r('#f0e6d8', 11, 30, 14, 5); r('#f0e6d8', 39, 30, 14, 5);
    r('#3b3025', 17, 29, 6, 7); r('#3b3025', 39, 29, 6, 7);
    r('#181a1c', 19, 30, 4, 6); r('#181a1c', 39, 30, 4, 6);
    r('#fff6e9', 19, 30, 2, 2); r('#fff6e9', 39, 30, 2, 2);
    r('#c08b63', 7, 37, 17, 7); r('#c08b63', 43, 37, 14, 7);
    r('#382921', 0, 42, 9, 22); r('#382921', 55, 42, 9, 22);
    r('#463126', 7, 47, 50, 17); r('#3b2a23', 14, 44, 10, 7); r('#3b2a23', 41, 44, 10, 7);
    r('#6d4834', 22, 43, 20, 6); r('#2e241f', 23, 45, 18, 3);
    r('#d2a080', 25, 49, 14, 5); r('#f1dfcc', 26, 49, 12, 2);
    r('#2d2521', 16, 59, 33, 5); r('#50392b', 13, 54, 5, 6); r('#50392b', 47, 53, 4, 6);
  });
  const side = texture('#b38461', r => {
    r('#30251f', 0, 0, 64, 26); r('#30251f', 0, 24, 23, 20);
    r('#30251f', 0, 44, 64, 20); r('#c28e68', 37, 29, 14, 16); r('#9e6c4f', 40, 33, 6, 8);
  });
  const back = texture('#30251f', r => { r('#3c2d23', 8, 10, 20, 6); r('#251f1b', 0, 50, 64, 14); });
  const suit = texture('#293143', r => {
    r('#323c50', 0, 0, 6, 64); r('#202738', 58, 0, 6, 64);
    r('#252c3c', 15, 0, 2, 64); r('#384156', 42, 0, 2, 64);
  });
  const jacket = texture('#293143', r => {
    r('#edf0f1', 22, 0, 20, 37); r('#d4d9e1', 24, 0, 16, 4);
    r('#77718e', 30, 5, 5, 30); r('#9890ac', 30, 5, 2, 27);
    for (let i = 0; i < 6; i++) {
      r('#3e4759', 14 + i * 2, i * 5, 8, 6); r('#343d50', 42 - i * 2, i * 5, 8, 6);
    }
    r('#f8f7f3', 40, 20, 10, 3); r('#202738', 39, 23, 13, 2);
    r('#b1a7a0', 34, 40, 3, 3); r('#b1a7a0', 34, 52, 3, 3);
    r('#1f2635', 5, 43, 15, 2); r('#3a4355', 5, 45, 15, 2);
    r('#1f2635', 45, 43, 15, 2); r('#3a4355', 45, 45, 15, 2);
    r('#1d2535', 31, 36, 1, 28);
  });
  const trousers = texture('#30394b', r => { r('#232c3d', 27, 0, 3, 64); r('#3c4558', 31, 0, 2, 64); r('#242d3c', 0, 55, 64, 5); });
  const leather = texture('#252a34', r => {
    r('#373d48', 10, 8, 40, 4); r('#1a202a', 0, 54, 64, 10);
    for (let y = 17; y < 43; y += 8) r('#59606b', 23, y, 18, 2);
  });

  const rig = new T.Group(); scene.add(rig);
  const body = new T.Group(); body.position.y = 12; rig.add(body);
  const box = (parent, size, position, mat) => {
    const mesh = new T.Mesh(new T.BoxGeometry(...size), mat);
    mesh.position.set(...position); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
  };
  box(body, [8, 12, 4], [0, 6, 0], [suit, suit, suit, suit, jacket, suit]);
  box(body, [3, 1.4, 3], [0, 12.4, 0], skin);
  const head = new T.Group(); head.position.y = 16.5; body.add(head);
  box(head, [8, 8, 8], [0, 0, 0], [side, side, back, skin, face, back]);
  // Raised hair voxels give the silhouette a swept, irregular crown.
  for (let x = -3; x <= 3; x += 2) for (let z = -3; z <= 3; z += 2) {
    const height = 1.2 + (Math.sin(x * 2 + z * 3) + 1) * .55 + (x < 0 ? .7 : 0);
    box(head, [2.1, height, 2.1], [x, 4 + height / 2, z], hair[Math.abs(x * 3 + z) % hair.length]);
  }
  box(head, [1.2, 3, 7.9], [-3.8, 3.2, -.1], hair[1]);
  box(head, [1.2, 2.5, 7.9], [3.8, 3.4, -.1], hair[0]);
  box(head, [2.1, 1.1, 2], [-2.7, 3.6, 3.7], hair[2]);
  box(head, [1.3, 1.2, .7], [0, -1, 4.2], skin);

  const arm = x => {
    const shoulder = new T.Group(); shoulder.position.set(x, 10.2, 0); body.add(shoulder);
    box(shoulder, [3.8, 6, 4], [0, -2.5, 0], suit);
    const elbow = new T.Group(); elbow.position.y = -5.5; shoulder.add(elbow);
    box(elbow, [3.6, 4, 3.9], [0, -2, 0], suit);
    box(elbow, [3.65, .7, 3.95], [0, -4.1, 0], cuff);
    box(elbow, [3.3, 2.6, 3.5], [0, -5.7, 0], skin);
    box(elbow, [.3, .5, .3], [1.82, -3.9, 1], sole);
    return { shoulder, elbow };
  };
  const right = arm(-5.9), left = arm(5.9);
  // A small watch and jacket cuffs remain legible when viewed at full resolution.
  box(left.elbow, [3.7, .7, 4], [0, -4.55, 0], sole);
  box(left.elbow, [2, .4, 2.1], [0, -4.6, 2], material('#b8bec8', .35));
  box(left.elbow, [1.4, .45, 1.5], [0, -4.6, 2.15], sole);
  const leg = x => {
    const hip = new T.Group(); hip.position.set(x, 12, 0); rig.add(hip);
    box(hip, [3.8, 6, 3.9], [0, -3, 0], trousers);
    const knee = new T.Group(); knee.position.y = -6; hip.add(knee);
    box(knee, [3.75, 5, 3.9], [0, -2.5, 0], trousers);
    box(knee, [3.9, 1.6, 5.5], [0, -5.15, .65], leather);
    box(knee, [4, .45, 5.6], [0, -5.8, .65], sole);
    return { hip, knee };
  };
  const legR = leg(-2), legL = leg(2);
  const soleY = (hip, knee) => {
    const angle = hip + knee;
    return 12 - 6 * Math.cos(hip) - 6.025 * Math.cos(angle) - (Math.sin(angle) >= 0 ? 3.45 : -2.15) * Math.sin(angle);
  };
  const applyPose = t => {
    const p = avatarPose(t);
    const ground = t < 1.2 || t >= 2.4 ? Math.min(soleY(p.legR, p.kneeR), soleY(p.legL, p.kneeL)) : 0;
    rig.position.set(p.x, p.y - ground, 0); rig.rotation.y = p.yaw; body.rotation.x = p.lean;
    head.rotation.z = p.head;
    right.shoulder.rotation.set(p.armR, 0, p.wave); left.shoulder.rotation.x = p.armL;
    right.elbow.rotation.x = p.elbowR; left.elbow.rotation.x = p.elbowL;
    legR.hip.rotation.x = p.legR; legL.hip.rotation.x = p.legL;
    legR.knee.rotation.x = p.kneeR; legL.knee.rotation.x = p.kneeL;
  };
  let elapsed = 0, last = null, frame = 0, visible = false, complete = false;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const draw = () => { applyPose(elapsed); renderer.render(scene, camera); };
  const resize = () => {
    const width = canvas.clientWidth || 224, height = canvas.clientHeight || 160;
    const halfWidth = 30 * width / height;
    camera.left = -halfWidth; camera.right = halfWidth; camera.updateProjectionMatrix();
    renderer.setSize(width, height, false); draw();
  };
  const tick = now => {
    frame = 0;
    if (last !== null) elapsed = Math.min(DURATION, elapsed + Math.min((now - last) / 1000, .05));
    last = now; draw();
    if (elapsed >= DURATION) { complete = true; last = null; onComplete(); }
    else if (visible && !document.hidden) frame = requestAnimationFrame(tick);
  };
  const sync = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0; last = null;
    if (complete) return;
    if (reduce.matches) { elapsed = DURATION; draw(); complete = true; onComplete(); return; }
    if (visible && !document.hidden) frame = requestAnimationFrame(tick);
  };
  resize();
  new ResizeObserver(resize).observe(canvas);
  document.addEventListener('visibilitychange', sync);
  reduce.addEventListener('change', sync);
  return { setVisible(value) { visible = value; sync(); } };
}
