import { ld, nextXY } from "./utils";


export class Grid {

  W: number;
  H: number;
  spacing: number;
  grid: boolean[][];
  gridDebug: string[][];
  constructor(W: number,H: number, spacing: number) {
    this.W = W;
    this.H = H;
    this.spacing = spacing;
    let numRows = Math.floor(W/spacing);
    let numCols = Math.floor(H/spacing);
    this.grid = [];
    this.gridDebug = [];
    for (let i=0; i< numRows; i++) {
      this.grid[i] = [];
      this.gridDebug[i] = [];
      for (let j =0; j < numCols; j++){
        this.grid[i][j] = false;
        this.gridDebug[i][j]  = '';
      }
    }
  }
  #posToGridIndex(p: number) {
    return Math.floor(p/this.spacing);
  }
  #nodeToGridIndex(node: GridNode) {
    let nodeEnd = nextXY(node);
    let [xs, xe] = [this.#posToGridIndex(node.pos.x), this.#posToGridIndex(nodeEnd.x)]
    let rowStart = Math.min(xs, xe);
    let rowEnd = Math.max(xs, xe);  

    let [ys, ye] = [ this.#posToGridIndex(node.pos.y), this.#posToGridIndex(nodeEnd.y)] 
    let colStart = Math.min(ys, ye);
    let colEnd = Math.max(ys, ye);
    return {rowStart, rowEnd, colStart, colEnd, nodeEnd}
  }
  addToGrid(node: GridNode) {
    let n = node.length / this.spacing;
    let ninverse = n == 0 ? 0: 1/n;
    let x0 = node.pos.x;
    let y0 = node.pos.y;

    let end = nextXY(node);
    let x1 = end.x;
    let y1 = end.y;

    let dy = (y1 - y0) * ninverse;
    let dx = (x1 - x0) * ninverse;

    let x = x0;
    let y = y0;
    this.grid[this.#posToGridIndex(x)][this.#posToGridIndex(y)] = true;
    ld(`start ${x}/${y}, l: ${node.length},  spacing: ${this.spacing}, n: ${n},`); 
    for (let i =0; i<n;i++) {

      x += dx;
      y += dy;
      this.grid[this.#posToGridIndex(x)][this.#posToGridIndex(y)] = true;
      
    }
  }

  posWouldCollide(node: GridNode) {
    let xi = this.#posToGridIndex(node.pos.x);
    let yi = this.#posToGridIndex(node.pos.y);
    return this.grid[xi][yi]; 
  }
  
  flowerWouldCollide(node: PlantNode) {
    let flowerStart = nextXY(node, node.length + 2 * this.spacing);
    let flowerNode = {pos: flowerStart, angle: node.angle, length: 2 * node.flower.size, width: node.width};
    let {rowStart, rowEnd, colStart, colEnd} = this.#nodeToGridIndex(flowerNode as GridNode);
    if (rowStart < 0 || rowEnd >= this.grid.length || colStart < 0 || colEnd >= this.grid[0].length) {
      console.warn("invariant broken - plant reaching end of grid");
      return true;
    }
    for (let i= rowStart; i<=rowEnd; i++) {
      for (let j=colStart; j<=colEnd; j++) {
        if (this.grid[i][j] == true) {
          console.log(`** Would collide at ${i}/${j}`, flowerNode);
          this.gridDebug[i][j] = "COLLIDED";
          return true;
        }
      }
    }
    return false;
  }
}