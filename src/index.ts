import paper from "paper"
import Plant from "./algo";
import { DrawGrid } from "./draw/drawGrid";
import DrawPlant from "./draw/drawPlant";
import { Grid } from "./grid";
import { MINIMAL_MODE } from "./utils";

console.log("Hello world")

let CW = 1000;
let CH = 1000;

function setup() {
  let app = document.getElementById("app");
  let canvas = document.createElement("canvas");
  canvas.id = "paper-canvas";
  canvas.width = CW;
  canvas.height = CH;
  
  if (app) {
    app.appendChild(canvas);
  }
  paper.setup(canvas);
  //new paper.Path([[0, 0], [100, 100], [200, 0]]).fillColor = new paper.Color('red');
}

setup();

let grid = new Grid(CW, CH, 6);
let plant = new Plant({lengthPerNode: 20,  widthPerNode: 20, OFFSET_POSITION: {x: 0, y: 500}, H: 800}, grid);
let paperPlant = new DrawPlant(plant);

let plants : Plant[] = [];
let paperPlants: DrawPlant[] = [];

for (let i = 1; i <10 ; i++) {
  let newPlant = new Plant({lengthPerNode: 10, OFFSET_POSITION: {x: 100 * i, y:600}, H: 600}, grid)
  plants.push(newPlant);
  paperPlants.push(new DrawPlant(newPlant));
}

let paperGrid: DrawGrid;
if (MINIMAL_MODE) {
  paperGrid = new DrawGrid(grid);
}


const iterate = () => {
  console.log("...");
  plant.grow();
  plants.forEach((pl) => pl.grow());
  if (MINIMAL_MODE) {
    (paperGrid as DrawGrid).drawGrid();
  }
  paperPlant.drawPlant();
  paperPlants.forEach((pp) => pp.drawPlant());
};

if (MINIMAL_MODE) {
  window.addEventListener("keypress", iterate);
} else {
  setInterval(iterate, 100);
}

//@ts-ignore
window.plant = plant;
//@ts-ignore
window.paperPlant = paperPlant;







