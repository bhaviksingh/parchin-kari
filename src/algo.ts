import { DEFAULT_PLANT_PARAMS, DEFAULT_FLOWER_PARAMS, makeRandomFlowerParams, ROOT_BRANCH_PARAMS } from "./params";
import { ld, nextXY } from "./utils";

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
  constructor(params: Partial<PlantParams>) {
    this.params = { ...DEFAULT_PLANT_PARAMS, ...params };
    let rootNode: PlantNode = {
      pos: { x: this.params.W / 2, y: this.params.H / 2 },
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
    //addToGrid(node);
  }
  #overcurved(node: PlantNode) {
    if (node.type !== "+") {
      return false;
    }
    let { INIT_ANGLE, BRANCH_ANGLE } = this.params;
    const myAngle = node.angle - INIT_ANGLE + (node.branchInfo.flipped ? BRANCH_ANGLE : -1 * BRANCH_ANGLE);
    if (myAngle && Math.abs(myAngle) > 0.6 * Math.PI) {
      ld("Stopping at ", myAngle / Math.PI);
      return true;
    }
  }
  #out(node: PlantNode) {
    let { x, y } = node.pos;
    let { W, H, PADDING } = this.params;
    if (x <= PADDING || x >= W - PADDING || y >= H - PADDING || y <= PADDING) {
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
      curveAt: (Math.random() * 0.3 + 0.1) * this.MAX_INCREMENTS,
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
    if (this.#out(node) || this.#overcurved(node)) {
      let flowerNode: FlowerNode = { ...nextNode(node), type: "*" };
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
          console.log("Branching complete", leaves);
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
