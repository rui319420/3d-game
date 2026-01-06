import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, MeshBuilder, 
  HavokPlugin, PhysicsAggregate, PhysicsShapeType,
} from "@babylonjs/core";
import HavokPhysics from "@babylonjs/havok";

async function createGame() {
  const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;

  document.body.style.margin = "0";
  document.body.style.overflow = "hidden";
  canvas.style.width = "100%";
  canvas.style.height = "100%";

  const inputMap = {};
  window.addEventListener("keydown", (ev) => {
    inputMap[ev.key] = true;
  })
  window.addEventListener("keyup", (ev) => {
    inputMap[ev.key] = false;
  })

  const engine = new Engine(canvas, true);
  const scene = new Scene(engine);

  const havokInstance = await HavokPhysics({
      locateFile: () => "./HavokPhysics.wasm"
  });
  const havokPlugin = new HavokPlugin(true, havokInstance);
  scene.enablePhysics(new Vector3(0, -9.8, 0), havokPlugin);

  const camera = new FreeCamera("camera1", new Vector3(0, 10, -10), scene);
  camera.setTarget(Vector3.Zero());
  camera.attachControl(canvas, true);

  const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);

  const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene);
  sphere.position.y = 5;

  const ground = MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene);
  new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0 }, scene);
  const sphereAggregate = new PhysicsAggregate(sphere, PhysicsShapeType.SPHERE, { mass: 1, restitution: 0.7 }, scene);

  scene.onBeforeRenderObservable.add(() => {
    const body = sphereAggregate.body;

    const power = 0.5;

    if (inputMap["ArrowUp"]) {
      body.applyImpulse(new Vector3(0, 0, power), sphere.getAbsolutePosition());
    }
    if (inputMap["ArrowDown"]) {
            body.applyImpulse(new Vector3(0, 0, -power), sphere.getAbsolutePosition());
    }
    if (inputMap["ArrowLeft"]) { 
            body.applyImpulse(new Vector3(-power, 0, 0), sphere.getAbsolutePosition());
    }
    if (inputMap["ArrowRight"]) {
            body.applyImpulse(new Vector3(power, 0, 0), sphere.getAbsolutePosition());
    }
  })

  engine.runRenderLoop(() => {
      scene.render();
  });
  window.addEventListener("resize", () => {
      engine.resize();
  });
}

createGame();