import { createBallGame } from "./ball";
import { createDominoGame } from "./domino";
import { createSlopeGame } from "./slope";

const app = document.getElementById("app");
const style = `
  position: absolute; 
  top: 50%; left: 50%; 
  transform: translate(-50%, -50%); 
  text-align: center;
  font-family: sans-serif;
`;

const menuDiv = document.createElement("div");
menuDiv.style.cssText = style;
menuDiv.innerHTML = `
  <h1>ゲーム選択メニュー</h1>
  <button id="btn-ball" style="padding: 10px 20px; font-size: 20px; cursor: pointer;">🔴 ボール転がし</button>
  <br><br>
  <button id="btn-domino" style="padding: 10px 20px; font-size: 20px; cursor: pointer;">🧱 ドミノ倒し</button>
  <br><br>
  <button id="btn-slope" style="padding: 10px 20px; font-size: 20px; cursor: pointer;">⛰️ 坂</button>
`;
document.body.appendChild(menuDiv);

document.getElementById("btn-ball")?.addEventListener("click", () => {
    menuDiv.remove();
    createBallGame();
});

document.getElementById("btn-domino")?.addEventListener("click", () => {
    menuDiv.remove();
    createDominoGame();
});

document.getElementById("btn-slope")?.addEventListener("click", () => {
    menuDiv.remove();
    createSlopeGame();
});