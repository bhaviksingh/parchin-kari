import paper from "paper"
import Plant from "./algo";
import PaperPlant from "./paperPlant";

console.log("Hello world")

function setup() {
  let app = document.getElementById("app");
  let canvas = document.createElement("canvas");
  canvas.id = "paper-canvas";
  canvas.width = 1000;
  canvas.height = 1000;
  
  if (app) {
    app.appendChild(canvas);
  }
  paper.setup(canvas);
  //new paper.Path([[0, 0], [100, 100], [200, 0]]).fillColor = new paper.Color('red');
}

setup();

let plant = new Plant({});
let paperPlant = new PaperPlant(plant);

setInterval( () => {
  plant.grow();
  if (plant.getNewNodes().length > 0) {
    console.log(plant.getBranches())
    paperPlant.drawPlant();
  }
}, 100);

//@ts-ignore
window.plant = plant;
//@ts-ignore
window.paperPlant = paperPlant;







