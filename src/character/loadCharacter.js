import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export async function loadCharacter(url) {
  const loader = new GLTFLoader();

  const gltf = await new Promise((resolve, reject) => {
    loader.load(url, resolve, undefined, reject);
  });

  const model = gltf.scene;

  // Optional: set scale if your model is too big/small
  // model.scale.setScalar(1.0);

  return { model, animations: gltf.animations || [] };
}
