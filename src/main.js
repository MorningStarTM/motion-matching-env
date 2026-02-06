import { Clock } from "three";
import { createScene } from "./scene/createScene.js";
import { createCamera } from "./scene/createCamera.js";
import { createRenderer } from "./scene/createRenderer.js";
import { createLights } from "./scene/createLights.js";
import { createFloor } from "./scene/createFloor.js";
import { createControls } from "./scene/controls.js";

import { loadCharacter } from "./character/loadCharacter.js";
import { createAnimationController } from "./character/animationController.js";

const app = document.getElementById("app");

const scene = createScene();
const camera = createCamera(app);
const renderer = createRenderer(app);

createLights(scene);
createFloor(scene);

const controls = createControls(camera, renderer.domElement);

const clock = new Clock();


// ---- simple character controller (WASD + Space jump)
const keys = new Set();
window.addEventListener("keydown", (e) => keys.add(e.code));
window.addEventListener("keyup", (e) => keys.delete(e.code));

const moveSpeed = 2.5;      // meters/sec
const turnSpeed = 8.0;      // rad/sec (optional)
const gravity = -9.8;       // m/s^2
const jumpVel = 4.5;

let velY = 0;
let onGround = true;

function updateCharacter(model, camera, dt) {
  // movement direction from WASD
  let x = 0, z = 0;
  if (keys.has("KeyW")) z -= 1;
  if (keys.has("KeyS")) z += 1;
  if (keys.has("KeyA")) x -= 1;
  if (keys.has("KeyD")) x += 1;

  // normalize
  const len = Math.hypot(x, z);
  if (len > 0) { x /= len; z /= len; }

  // move relative to camera yaw (so W goes where camera faces)
  const yaw = Math.atan2(camera.position.x - model.position.x, camera.position.z - model.position.z);
  const sin = Math.sin(yaw), cos = Math.cos(yaw);

  const dx = (x * cos - z * sin) * moveSpeed * dt;
  const dz = (x * sin + z * cos) * moveSpeed * dt;

  model.position.x += dx;
  model.position.z += dz;

  // rotate to face move direction
  if (len > 0) {
    const targetYaw = Math.atan2(dx, dz);
    model.rotation.y += (targetYaw - model.rotation.y) * Math.min(1, turnSpeed * dt);
  }

  // jump
  if (keys.has("Space") && onGround) {
    velY = jumpVel;
    onGround = false;
  }

  // gravity
  velY += gravity * dt;
  model.position.y += velY * dt;

  // ground collision at y=0
  if (model.position.y <= 0) {
    model.position.y = 0;
    velY = 0;
    onGround = true;
  }
}



async function init() {
  // Load character
  const { model, animations } = await loadCharacter("/models/peter.glb");
  scene.add(model);

  // Make it easy to see: center and slightly lift
  model.position.set(0, 0, 0);

  const animCtrl = createAnimationController(model, animations);

  // Populate dropdown
  const select = document.getElementById("animSelect");
  select.innerHTML = "";
  animations.forEach((clip, idx) => {
    const opt = document.createElement("option");
    opt.value = clip.name || `clip_${idx}`;
    opt.textContent = clip.name || `clip_${idx}`;
    select.appendChild(opt);
  });

  // Play first clip if exists
  if (animations.length > 0) {
    animCtrl.play(animations[0].name || "clip_0");
    select.value = animations[0].name || "clip_0";
  }

  select.addEventListener("change", () => {
    animCtrl.play(select.value);
  });

  // render loop
  function animate() {
    requestAnimationFrame(animate);
    const dt = clock.getDelta();
    
    updateCharacter(model, camera, dt);

    animCtrl.update(dt);
    controls.update();
    renderer.render(scene, camera);
  }

  animate();
}

init();
