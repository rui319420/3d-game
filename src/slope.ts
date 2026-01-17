import {
  Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, 
  HavokPlugin, SceneLoader, PhysicsAggregate, PhysicsShapeType, Mesh,
} from "@babylonjs/core";
import HavokPhysics from "@babylonjs/havok";
import "@babylonjs/loaders/glTF";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";

export async function createSlopeGame() {
  const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;

  document.body.style.margin = "0";
  document.body.style.overflow = "hidden";
  canvas.style.width = "100%";
  canvas.style.height = "100%";

  const engine = new Engine(canvas, true);
  const scene = new Scene(engine);

  const havokInstance = await HavokPhysics({
      locateFile: () => "./HavokPhysics.wasm"
  });
  const havokPlugin = new HavokPlugin(true, havokInstance);
  scene.enablePhysics(new Vector3(0, -9.8, 0), havokPlugin);

  const result = await SceneLoader.ImportMeshAsync("", "./", "myModel3.glb", scene);

  result.meshes.forEach((mesh) => {
    if (mesh.getTotalVertices() > 0) {
      (mesh as Mesh).bakeCurrentTransformIntoVertices(); 
      new PhysicsAggregate(mesh, PhysicsShapeType.MESH, { mass: 0, restitution: 0.5 }, scene);
    }
  });

  scene.createDefaultCameraOrLight(true, true, true);

  const camera = scene.activeCamera;
  if (camera) {
    camera.attachControl(canvas, true);
    camera.maxZ = 10000; 

  }

  engine.runRenderLoop(() => {
      scene.render();
  });
  window.addEventListener("resize", () => {
      engine.resize();
  });
}