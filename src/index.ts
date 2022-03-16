import paper from "paper"
import Plant, { PlantContainer } from "./algo";
import DrawFrame from "./draw/drawFrame";
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

let grid = new Grid(CW, CH, 8);

let plants : PlantContainer[] = [];
let paperPlants: DrawPlant[] = [];
let paperGrid: DrawGrid;
let paperFrames: DrawFrame[] = [];
let numTrees = MINIMAL_MODE ? 1 : 4;

for (let i = 0; i < numTrees ; i++) {
  let newPlant = new PlantContainer(
    {
      lengthPerNode: 14,
      OFFSET_POSITION: { x: 100 + 210 * i, y: 400 },
      H: 400,
      W: 200,
      PADDING: 10,
      SPACE_BETWEEN_BRANCHES: MINIMAL_MODE ? 100 : Math.random() * 100,
      BRANCH_PROBABILITY: MINIMAL_MODE ? 0.2 : Math.random() + 0.3,
    },
    grid
  );
  plants.push(newPlant);
  paperPlants.push(new DrawPlant(newPlant.plant));
  paperFrames.push(new DrawFrame(newPlant.frame));
}

if (MINIMAL_MODE) {
  paperGrid = new DrawGrid(grid);
}

const iterate = () => {
  console.log("...");
  plants.forEach((pl) => pl.grow());
  if (MINIMAL_MODE) {
    (paperGrid as DrawGrid).drawGrid();
  }
  paperPlants.forEach((pp) => pp.drawPlant());
  paperFrames.forEach((pp) => pp.drawFrame());
};

if (MINIMAL_MODE) {
  window.addEventListener("keypress", iterate);
} else {
  setInterval(iterate, 100);
}

