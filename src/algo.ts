import { Grid } from "./grid";
import { DEFAULT_FLOWER_PARAMS, makeRandomFlowerParams, ROOT_BRANCH_PARAMS, getDefaultPlanParams, DEFAULT_CORE_PARAMS } from "./params";
import { ld, nextXY } from "./utils";
import paper from "paper";

const nextNode = (node: PlantNode): PlantNode => {
  return {
    type: node.type,
    pos: nextXY(node),
    angle: node.angle,
    branchDepth: node.branchDepth,
    branchNumber: node.branchNumber,
    index: node.index + 1,
    length: node.length,
    branchInfo: node.branchInfo,
    flower: node.flower,
    width: node.width
  };
};


export default class Plant {
  params: PlantParams;
  newNodes: PlantNode[];
  branches: Branch[];
  distBetweenBranch: number = 0;
  MAX_INCREMENTS: number;
  grid: Grid
  constructor(params: Partial<PlantParams>, grid: Grid) {
    this.params = getDefaultPlanParams(params);
    console.log("Starting plant", this.params);
    this.grid = grid;
    let rootNode: PlantNode = {
      pos: {
        x: this.params.W / 2 + this.params.OFFSET_POSITION.x,
        y: (this.params.H - this.params.PADDING)  + this.params.OFFSET_POSITION.y,
      },
      angle: this.params.INIT_ANGLE,
      width: this.params.widthPerNode,
      length: this.params.lengthPerNode,
      branchDepth: 0,
      branchNumber: 0,
      index: 0,
      type: "F",
      branchInfo: ROOT_BRANCH_PARAMS,
      flower: DEFAULT_FLOWER_PARAMS,
    };
    this.grid.addToGrid(rootNode);
    
    this.newNodes = [rootNode];
    this.branches = [[...this.newNodes]];
    const ANGLED_LENGTH = (this.params.W / 2 - this.params.lengthPerNode) / Math.cos(this.params.BRANCH_ANGLE);
    this.MAX_INCREMENTS = Math.floor(ANGLED_LENGTH / this.params.lengthPerNode);
  }
  #addToBranch(node: PlantNode) {
    if (node.branchNumber !== undefined) {
      if (this.branches[node.branchNumber] === undefined) {
        this.branches[node.branchNumber] = [node];
      } else {
        this.branches[node.branchNumber].push(node);
      }
    }
    if (node.branchNumber == 0) {
      this.grid.addToGrid({...node, pos: {x: node.pos.x - node.width /2 , y: node.pos.y}})
    }
    this.grid.addToGrid(node);
  }
  #overcurved(node: PlantNode) {
    return false;
    if (node.type !== "+") {
      return false;
    }
    let { INIT_ANGLE, BRANCH_ANGLE } = this.params;
    const myAngle = node.angle - INIT_ANGLE + (node.branchInfo.flipped ? BRANCH_ANGLE : -1 * BRANCH_ANGLE);
    if (myAngle && Math.abs(myAngle) > 0.76 * Math.PI) {
      ld("Stopping at ", myAngle / Math.PI);
      return true;
    }
  }
  #out(pos: Position) {
    
    let { x, y } = pos;
    
    let { W, H, PADDING , OFFSET_POSITION} = this.params;
    let ox = x - OFFSET_POSITION.x;
    let oy = y - OFFSET_POSITION.y;
    if ( ox  < PADDING || ox > W-PADDING || oy < PADDING || oy > H-PADDING) {
      return true;
    } else {
      return false;
    }
  }
  #makeCurvedNode(node: PlantNode) {
    let CURVE_INCREMENT = this.params.CURVE_INCREMENT;
    let curve = node.branchInfo.flipped ? -CURVE_INCREMENT : CURVE_INCREMENT;
    curve = node.branchInfo.curveOpposite ? curve * -1 : curve;
    let curvedNode: PlantNode = {
      ...nextNode(node),
      angle: node.angle + curve,
      type: "+",
    };
    return curvedNode;
  }
  #makeBranchedNodes(node: PlantNode) {
    let branchInfo: BranchingParams = {
      curveAt: (Math.random() * 0.2 + 0.1) * this.MAX_INCREMENTS,
      curveOpposite: Math.random() < 0.5,
      flipped: false
    };
    let flower: FlowerParams = makeRandomFlowerParams(this.params.MAX_FLOWER_SIZE);
    let sharedNodeParams= { index: 0, branchDepth: node.branchDepth + 1, pos: node.pos, width: node.width, length: node.length,  flower};
    let lBranch: PlantNode = {...sharedNodeParams, branchNumber: this.branches.length, angle: node.angle - this.params.BRANCH_ANGLE, type: "F",  branchInfo: {...branchInfo, flipped:true}  };
    let rBranch : PlantNode = {...sharedNodeParams, branchNumber: this.branches.length + 1, angle: node.angle + this.params.BRANCH_ANGLE, type: "F", branchInfo}
    return [lBranch, rBranch];
  }
  #extendNode(node: PlantNode) {
    if (node.type === "*") {
      return; //This branch is finished, there is a flower here now.
    }
    //TODO: Update this to see if a *flower* here should be drawn
    let nxy = nextXY(node, Math.max(node.flower.size, node.length) * 2)
    if (this.#out(nxy) || this.grid.flowerWouldCollide(node) ) {
      let flowerNode: FlowerNode = { ...nextNode(node), width: node.flower.size, type: "*" };
      this.#addToBranch(flowerNode);
      return [flowerNode];
    }
    if (node.type == "F") {
      let leaves = [];
      if (node.index > node.branchInfo.curveAt) {
        let fc = this.#makeCurvedNode(node);
        this.#addToBranch(fc);
        leaves.push(fc);
      } else {
        let continuedNode = nextNode(node);
        this.#addToBranch(continuedNode);
        leaves.push(continuedNode);
      }
      if (node.branchDepth < 1) {
        this.distBetweenBranch += node.length;
        if (
          this.distBetweenBranch >= this.params.SPACE_BETWEEN_BRANCHES &&
          Math.random() < this.params.BRANCH_PROBABILITY
        ) {
          this.distBetweenBranch = 0;
          let branchNodes = this.#makeBranchedNodes(node);
          branchNodes.forEach(bn => { this.#addToBranch(bn); leaves.push(bn)});
          ld("Branching complete", leaves);
        }
      }
      return leaves;
    }
    if (node.type == "+") {
      let continuedNode = this.#makeCurvedNode(node);
      this.#addToBranch(continuedNode);
      return [continuedNode];
    }
  }
  grow() {
    ld("**** About to Grow Plant ", this.branches);
    //Now, for each branch, we grow
    let newLeaves = [];
    let bClone = [...this.branches]; //clone, because it can change mid for loop
    for (let i = 0; i < bClone.length; i++) {
      let branch = bClone[i];
      let lastNode = branch[branch.length - 1];
      ld("/// Branch " + i + " : Last Node type " + lastNode.type);
      let newNodes = this.#extendNode(lastNode);
      ld("/// New nodes received ", newNodes);
      if (newNodes !== undefined) {
        newLeaves.push(...newNodes);
      }
    }
    this.newNodes = newLeaves;
    ld(">>> Growth complete", this.branches, newLeaves);
  }
  getNewNodes() {
    return this.newNodes;
  }
  getBranches() {
    return this.branches;
  }
}


export class Frame {
  params: CoreParams;
  leftNodes: GridNode[] = [];
  rightNodes: GridNode[] = [];
  grid: Grid;
  constructor(params: Partial<CoreParams>, grid: Grid) {
    this.params = {...DEFAULT_CORE_PARAMS, ...params};

    let init: GridNode = {
      pos: { x: this.params.W / 2 + this.params.OFFSET_POSITION.x, y: this.params.H + this.params.OFFSET_POSITION.y },
      length: this.params.lengthPerNode,
      width: this.params.widthPerNode,
      angle: 0,
      branchDepth: 0,
      branchNumber: 0
    };
    this.rightNodes.push(init);

    let init2 = {...init, angle: Math.PI, branchNumber: 1};
    this.leftNodes.push(init2);
    this.grid = grid;

  }
  extendNode(node: GridNode): GridNode | undefined {
   
    let nxy = nextXY(node);
    let ox = nxy.x - this.params.OFFSET_POSITION.x;
    let oy = nxy.y - this.params.OFFSET_POSITION.y;
    
    let nextNode; 
    if (ox <= 0 || ox >= this.params.W ) {
      let angledNode = {...node, angle: -1 * Math.abs(node.angle - Math.PI/2)};
      nextNode = { ...angledNode,  pos: nextXY(angledNode)}
    } else if (oy <= 0 ) {
      let angledNode = {...node, angle: ox <= node.length ? 0 : Math.PI};
      nextNode = { ...angledNode,  pos: nextXY(angledNode)}
      return nextNode;
    } else if (oy <= node.length && ((node.angle == 0 && ox > this.params.W/2) || (node.angle == Math.PI && ox < this.params.W/2))) {
      return undefined;
    } else { 
      nextNode = { ...node, pos: nxy };
    }
    return nextNode;
  }
  grow() {
    let currentL: GridNode = this.leftNodes[this.leftNodes.length - 1];
    if (currentL) {
      let nextL = this.extendNode(currentL);
      if (nextL) {
        this.leftNodes.push(nextL);
        this.grid.addToGrid(nextL);
      }
    }
    let currentR: GridNode = this.rightNodes[this.rightNodes.length - 1];
    if (currentR) {
      let nextR = this.extendNode(currentR);
      if (nextR) {
        this.rightNodes.push(nextR);
        this.grid.addToGrid(nextR);
      }
      
    }
  }
  getNewNodes() {
    return [this.leftNodes[this.leftNodes.length - 1], this.rightNodes[this.rightNodes.length - 1]]
  }
  getAllNodes() {
    return [this.leftNodes, this.rightNodes];
  }
}
export class PlantContainer {
  plant: Plant;
  frame: Frame;
  constructor(params: Partial<PlantParams>, grid: Grid) {
    this.plant = new Plant(params, grid);
    this.frame = new Frame(params, grid);
  }
  grow(){
    this.plant.grow();
    this.frame.grow();
  }
}