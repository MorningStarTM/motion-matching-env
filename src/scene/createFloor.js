import { GridHelper, Mesh, MeshStandardMaterial, PlaneGeometry } from "three";

export function createFloor(scene) {
  const floorGeo = new PlaneGeometry(20, 20);
  const floorMat = new MeshStandardMaterial({ roughness: 0.95, metalness: 0.0 });
  const floor = new Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  scene.add(floor);

  const grid = new GridHelper(20, 20);
  scene.add(grid);
}
