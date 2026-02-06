import { PerspectiveCamera } from "three";

export function createCamera(container) {
  const w = container.clientWidth;
  const h = container.clientHeight;

  const camera = new PerspectiveCamera(60, w / h, 0.1, 200);
  camera.position.set(2.5, 1.8, 3.5); // nice default
  camera.lookAt(0, 1, 0);
  return camera;
}
