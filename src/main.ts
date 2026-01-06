import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, MeshBuilder, 
  HavokPlugin, PhysicsAggregate, PhysicsShapeType,
} from "@babylonjs/core";
import HavokPhysics from "@babylonjs/havok";

async function createGame() {
  const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  const engine = new Engine(canvas, true);
  const scene = new Scene(engine);

  const havokInstance = await HavokPhysics({
      locateFile: () => "./HavokPhysics.wasm"
  });
  const havokPlugin = new HavokPlugin(true, havokInstance);
  scene.enablePhysics(new Vector3(0, -9.8, 0), havokPlugin);

  const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
  camera.setTarget(Vector3.Zero());
  const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);

  const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene);
  sphere.position.y = 5;

  new PhysicsAggregate(sphere, PhysicsShapeType.SPHERE, { mass: 1 }, scene);
  const ground = MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene);

  new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0 }, scene);

  engine.runRenderLoop(() => {
      scene.render();
  });
}

createGame();