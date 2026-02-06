import { AmbientLight, DirectionalLight } from "three";

export function createLights(scene) {
  const amb = new AmbientLight(0xffffff, 0.6);
  scene.add(amb);

  const dir = new DirectionalLight(0xffffff, 1.2);
  dir.position.set(4, 8, 2);
  scene.add(dir);
}
