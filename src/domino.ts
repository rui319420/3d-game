import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, MeshBuilder, 
    HavokPlugin, PhysicsAggregate, PhysicsShapeType,
    StandardMaterial, Color3
} from "@babylonjs/core";
import HavokPhysics from "@babylonjs/havok";

export async function createDominoGame() {
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

    const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(canvas, true);

    const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);

    const ground = MeshBuilder.CreateGround("ground", { width: 20, height: 20 }, scene);
    const groundMat = new StandardMaterial("groundMat", scene);
    groundMat.diffuseColor = new Color3(0.5, 0.5, 0.5);
    ground.material = groundMat;
    new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0 }, scene);

    engine.runRenderLoop(() => {
        scene.render();
    });
    window.addEventListener("resize", () => {
        engine.resize();
    });
}

createDominoGame();