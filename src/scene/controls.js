import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export function createControls(camera, domElement) {
  const controls = new OrbitControls(camera, domElement);
  controls.target.set(0, 1, 0);
  controls.enableDamping = true;
  return controls;
}
