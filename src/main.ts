import { Engine, Scene, FreeCamera, Vector3, HemisphericLight } from "@babylonjs/core";

const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;

const engine = new Engine(canvas, true);

const scene = new Scene(engine);

const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
camera.setTarget(Vector3.Zero());

const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);

engine.runRenderLoop(() => {
    scene.render();
});