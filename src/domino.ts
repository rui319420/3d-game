import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, MeshBuilder, 
    HavokPlugin, PhysicsAggregate, PhysicsShapeType,
    StandardMaterial, Color3
} from "@babylonjs/core";
import HavokPhysics from "@babylonjs/havok";

export async function createDominoGame() {
  const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;

  const inputMap = {};
  window.addEventListener("keydown", (ev) => { inputMap[ev.key] = true; });
  window.addEventListener("keyup", (ev) => { inputMap[ev.key] = false; });

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

  const camera = new FreeCamera("camera1", new Vector3(0, 20, -20), scene);
  camera.setTarget(new Vector3(0, 0, 5));
  camera.attachControl(canvas, true);

  const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);

  const ground = MeshBuilder.CreateGround("ground", { width: 20, height: 40 }, scene);
  const groundMat = new StandardMaterial("groundMat", scene);
  groundMat.diffuseColor = new Color3(0.5, 0.5, 0.5);
  ground.material = groundMat;
  new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0 }, scene);

  // domino
  const dominoMat = new StandardMaterial("dominoMat", scene);
  dominoMat.diffuseColor = new Color3(0.2, 0.2, 1);

  for (let i = 0; i < 50; i++) {
    const domino = MeshBuilder.CreateBox("domino", { width: 1.5, height: 4.0, depth: 0.5 }, scene);
    domino.material = dominoMat;

    domino.position.z = 2 + i * 0.8;
    domino.position.x = Math.sin(i * 0.2) * 2;
    domino.position.y = 3;

    domino.rotation.y = Math.sin(i * 0.2) * 0.8
    
    new PhysicsAggregate(domino, PhysicsShapeType.BOX, { mass: 0.2, friction: 0.5 }, scene);
  }

  // ball
  const ball = MeshBuilder.CreateSphere("ball", { diameter: 1.5 }, scene);
  ball.position.set(0, 1, -2);

  const ballMat = new StandardMaterial("ballMat", scene);
  ballMat.diffuseColor = new Color3(1, 0, 0);
  ball.material = ballMat;

  const ballAggregate = new PhysicsAggregate(ball, PhysicsShapeType.SPHERE, { mass: 2, restitution: 0.5 }, scene);

    scene.onBeforeRenderObservable.add(() => {
        const body = ballAggregate.body;
        const power = 0.5;

        if (inputMap["ArrowUp"]) body.applyImpulse(new Vector3(0, 0, power), ball.getAbsolutePosition());
        if (inputMap["ArrowDown"]) body.applyImpulse(new Vector3(0, 0, -power), ball.getAbsolutePosition());
        if (inputMap["ArrowLeft"]) body.applyImpulse(new Vector3(-power, 0, 0), ball.getAbsolutePosition());
        if (inputMap["ArrowRight"]) body.applyImpulse(new Vector3(power, 0, 0), ball.getAbsolutePosition());
    });

  engine.runRenderLoop(() => {
      scene.render();
  });
  window.addEventListener("resize", () => {
      engine.resize();
  });
}

createDominoGame();