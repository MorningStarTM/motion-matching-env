import { AnimationMixer } from "three";

export function createAnimationController(model, clips) {
  const mixer = new AnimationMixer(model);

  // map name -> clip
  const clipMap = new Map();
  clips.forEach((clip, idx) => {
    const name = clip.name || `clip_${idx}`;
    clipMap.set(name, clip);
  });

  let activeAction = null;

  function play(name) {
    const clip = clipMap.get(name);
    if (!clip) return;

    const nextAction = mixer.clipAction(clip);
    nextAction.reset();
    nextAction.fadeIn(0.15);
    nextAction.play();

    if (activeAction && activeAction !== nextAction) {
      activeAction.fadeOut(0.15);
    }
    activeAction = nextAction;
  }

  function update(dt) {
    mixer.update(dt);
  }

  return { play, update };
}
