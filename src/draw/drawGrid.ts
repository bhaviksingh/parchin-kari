import { Grid } from "../grid";
import paper from "paper"

let trueColor = new paper.Color("rgba(200,200,250, 0.8)")
let repeatedTrueColor = new paper.Color("rgba(220,200,200), 0.8)")
let falseColor =  new paper.Color("rgba(250,250,250, 0.5)");

export class DrawGrid {
  grid: Grid;
  gridGroup = new paper.Group();
  constructor(grid: Grid) {
    this.grid = grid;
    this.drawGrid();
  }
  drawGrid() {
    let g = this.grid.grid;
    let M = this.grid.spacing;
    let squares = [...this.gridGroup.children];

    for (var i = 0; i < g.length; i++) {
      for (var j = 0; j < g[i].length; j++) {
        let square;
        if (squares.length == 0) {
          square = new paper.Path.Rectangle({ x: M * i, y: M * j, width: M, height: M });
          square.strokeColor = new paper.Color("rgba(100,100,100,0.1)");
          this.gridGroup.addChild(square);
        } else {
          square = squares[i * g.length + j];
        }
        if (g[i][j] == true) {
          if (this.grid.gridDebug[i][j] == "COLLIDED") 
            square.fillColor = new paper.Color("rgba(255,0,0,1)");
          else if (square.fillColor?.equals(trueColor) || square.fillColor?.equals(repeatedTrueColor)) 
            square.fillColor = repeatedTrueColor;
          else
            square.fillColor = trueColor;
        } else {
          square.fillColor = falseColor
        }
      }
    }
  }
}
