/* 
*************
   TYPES 
*************
 node = { 
  type: "F" for straight, "/" for start a branch, * for flower, + for curve 
  x: xPos,
  y: yPos,
  angle: current angle at which node is moving (heading),
  branchD: how "deep" the branches are (how many times it has been "branched" from the root),
  branchN: What the branch # is 
  index: what index is the node along the branch 
  magnitude: what is the magnitude of the vector 
  size?: size of flower 
  flipped?: true if its a LEFT branch (useful for updating curve angles later)
  curveAt?: static number generated for curve branches, deciding when they should start curving
  color?: What thec color of the flower is (PLACEHOLDER FOR FLOWER TYPE)
 }
 plant(W,H,M,SPACING)
  => iterator...  () => { all: all nodes, new: new nodes }  <-- iterates plants, giving leaves
 planter = {
   x,y,w,h,
   hasBorder
   plant: the ONE plant that this planter contains
   leaves: All the leaves of the plant.... //TODO: CAN probably simplify this..
 }
 garden(W,H,M,SPACING) 
  => iterate... () => planter[] <-- iterates each plant in each garden, updating the data structure

*************
DO AT SOME POINT 
*************
- Maybe use SPACING to FORCE the branches to be a certain distance apart. Eg: every "F" on home, subtract M/S and then when counter == 0 , you *can* draw... but you may not.
- optimization: right now the curves are checking intersection with all branches -- not needed, can check every 2nd (other than first), because it should only intersect on "its side"
*/

const DBG = false;

const ld = (msg, ...args) => {
  if (DBG) {
    console.log(msg, args);
  }
};

const nextXY = (node, m) => {
  m = m || node.magnitude || 0;
  return { x: node.x + m * Math.cos(node.angle), y: node.y + m * Math.sin(node.angle) };
};

//Note: this system assumes that UP is -Y axis, as is convention with graphics drawing systems
const plant = (W, H, M, SPACING, { SPACE_BETWEEN_BRANCHES, FLOWER_SIZE}) => {
  const BRANCH_PROBABILITY = 0.2;
  const MAX_DEPTH = 1;
  const INIT_ANGLE = -0.5 * Math.PI; 
  const BRANCH_ANGLE = 0.25 * Math.PI;
  const CURVE_INCREMENT = 0.1 * Math.PI;
  const MICRO_CURVE = 0 * Math.PI;

  const grid = [];

  const ANGLED_LENGTH = (W / 2 - M) / Math.cos(BRANCH_ANGLE);
  const MAX_INCREMENTS = Math.floor(ANGLED_LENGTH / M);
  let dist_since_branch = 0;
  const BRANCH_SPACING = SPACE_BETWEEN_BRANCHES || SPACING;

  //const MAX_INCREMENTS = 2;

  ld("Algorithm initialized with MAX_INCREMENTS at .... " + MAX_INCREMENTS);

  //******** Helpers
  const gridCoord = (node ) => {
    let xIndex = Math.floor(node.x / M);
    let yIndex = Math.floor(node.y / M);
    return [xIndex, yIndex]
  }
  const addToGrid = (node ) => {
    const [xIndex, yIndex] = gridCoord(node);
    grid[xIndex][yIndex] = true;
    ld("Updated grid to true at " + xIndex + ":" + yIndex  + " with node", node)
  }
  const makeNode = (override, node) => {
    return {
      ...node,
      ...override,
    };
  };
  const addToBranch = (node) => {
    if (node.branchN !== undefined) {
      if (branches[node.branchN] === undefined) {
        branches[node.branchN] = [node];
      } else {
        branches[node.branchN].push(node);
      }
    }
    addToGrid(node);
  };
  const makeStraightNode = (node) => {
    let nextAngle = node.angle;
    if (node.branchD > 0) 
      nextAngle = node.flipped ? node.angle - MICRO_CURVE : node.angle + MICRO_CURVE;
    return makeNode({ index: node.index + 1, ...nextXY(node), angle: nextAngle }, node);
  };
  const makeFlowerNode = (node) => {
    // return makeNode({ type: "*", size: node.flowerSize || FLOWER_SIZE || M, ...nextXY(node), color: "yellow", angle: node.angle}, node);
    return {
      type: "*",
      x: node.x,
      y: node.y,
      angle: node.angle,
      color: node.color || "pink",
      size: node.flowerSize || FLOWER_SIZE || M,
      branchN: node.branchN,
      branchD: node.branchD,
      index: node.index + 1,
      numPetals: node.numPetals,
      petalArcAngle: node.petalArcAngle,
      pistilSize: node.pistilSize,
      pistilColor: node.pistilColor
    };
  };
  const makeCurvedNode = (node) => {
    let curve = node.flipped ? -CURVE_INCREMENT : CURVE_INCREMENT;
    curve = node.curveOpposite ? curve * -1 : curve;
    let newNode = makeStraightNode(node); //continue this, and increase angle for next time.
    return makeNode({ angle: node.angle + curve, type: "+" }, newNode);
  };
  const makeBranchedNode = (node, angle, options) => {
    return makeNode(
      {
        type: "F",
        index: 0,
        branchN: branches.length,
        branchD: node.branchD + 1,
        angle,
        ...options
      },
      node
    );
  };

  //******** Key variables
  let rootNodes = [
    makeNode(
      { x: W / 2, y: H - SPACING, angle: INIT_ANGLE, branchD: 0, branchN: 0, index: 0, type: "F", magnitude: M },
      {}
    ),
  ];
  let branches = [[...rootNodes]];

  //******** Action
  const out = ({ x, y }) => {
    if (x <= SPACING || x >= W - SPACING || y >= H - SPACING || y <= SPACING) {
      return true;
    } else {
      return false;
    }
  };
  const overcurved = (type, angle, flipped) => {
    if (type !== "+") {
      return false;
    }
    const myAngle = angle - INIT_ANGLE + (flipped ? BRANCH_ANGLE : -1 * BRANCH_ANGLE);
    if (myAngle && Math.abs(myAngle) > 0.60 * Math.PI) {
      //console.log("Stopping at ", myAngle / Math.PI);
      return true;
    }
  };
  const intersectsplant = (type, n, nn) => {
    //Right now straight lines shouldnt curve, may change
    
    if (type !== "+") {
      return false;
    }
    //Simply checks if the line about to be created (n -> nn) intersects literally any other line in the system....
    let [xIndexN, yIndexN] = gridCoord(nn);
    let [xIndex, yIndex] = gridCoord(n);
    let intersects = grid[xIndexN][yIndexN];
    if (intersects) {
      console.log("Intersects" , intersects);
      grid[xIndexN][yIndexN] = "flower";
      console.log(grid);
    }
    return intersects;
    
    // for (var i = 0; i < branches.length; i++) {
    //   for (var j = 0; j < branches[i].length - 1; j++) {
    //     if (i == n.branchN) continue;
    //     let b0 = branches[i][j];
    //     let bn = branches[i][j + 1];
    //     let branchLine = [
    //       { x: b0.x, y: b0.y },
    //       { x: bn.x, y: bn.y },
    //     ];
    //     if (lineoverlap(n, nn, branchLine[0], branchLine[1])) {
    //       ld(`Branch ${n.branchN} intersects with branch ${i} at ${j}`, myLine, branchLine, branches);
    //       return true;
    //     }
    //   }
    // }
  };
  const extendNode = (node) => {
    if (node.type === "*") {
      return; //This branch is finished, there is a flower here now.
    }
    let flowerStart = nextXY(node,  node.flowerSize);
    let flowerEnd = nextXY({ x: flowerStart.x, y: flowerStart.y, angle: node.angle}, node.flowerSize);
    //check: IF the node is overcurved, or drawing a flower here would send us out of bounds.
    if (
      out(flowerEnd) ||
      overcurved(node.type, node.angle, node.flipped) ||
      intersectsplant(node.type, flowerStart, flowerEnd)
    ) {
      let newNode = makeFlowerNode(node);
      addToBranch(newNode);

      return [newNode];
    }
    if (node.type == "F") {
      let newNodes = [];
      //Continues!
      if (node.curveAt !== undefined && node.index > node.curveAt) {
        let firstCurve = makeCurvedNode(node);
        addToBranch(firstCurve);
        newNodes.push(firstCurve);
      } else {
        let continuedNode = makeStraightNode(node);
        addToBranch(continuedNode);
        newNodes.push(continuedNode);
        if (node.branchD < MAX_DEPTH && node.y - SPACE_BETWEEN_BRANCHES > 0) {
          dist_since_branch += node.magnitude;
          if (dist_since_branch >= BRANCH_SPACING && Math.random() < BRANCH_PROBABILITY) {
            dist_since_branch = 0; //TODO: needs to be an array eventually
            let curveAt = (Math.random() * 0.3 + 0.1) * MAX_INCREMENTS
            let curveOpposite = Math.random() > 0.5;
            let flowerSize = FLOWER_SIZE ? (Math.random() * 0.5 + 0.5) * FLOWER_SIZE : M;
            let color = `hsl(${Math.floor(Math.random() * 90)},50,50)`
            let numPetals = (Math.random() * 12 + 2) * 2 + 1;
            let petalArcAngle = (Math.random() * 2 + 0.5) * Math.PI;
            let pistilSize = Math.random() * 0.3 + 0.1;
            let pistilColor = `hsl(${Math.floor(Math.random() * 90)},50,50)`

            let rNode = makeBranchedNode(node, node.angle + BRANCH_ANGLE, { flipped: false, curveAt, curveOpposite, flowerSize, color, numPetals, petalArcAngle, pistilSize, pistilColor});
            addToBranch(rNode);
            newNodes.push(rNode);
            let lNode = makeBranchedNode(node, node.angle - BRANCH_ANGLE, { flipped: true, curveAt, curveOpposite, flowerSize, color, numPetals, petalArcAngle, pistilSize, pistilColor});
            addToBranch(lNode);
            newNodes.push(lNode);
            ld("EYYYY BRANCHING COMPLETE", newNodes);
          }
        }
        //Can branch
      
      }
      return newNodes;
    }
    if (node.type == "+") {
      let continuedNode = makeCurvedNode(node);
      addToBranch(continuedNode);
      return [continuedNode];
    }
  };

  //Main function.
  let firstRun = true;
  const grow = () => {
    //throw new Error("who is calling me now");
    //Initial seed
    if (firstRun) {
      for (let i = 0; i < W / M; i++) {
        grid[i] = [];
        for (let j = 0; j < H / M; j ++) {
          grid[i][j] = false;
        }
      }      
      addToGrid(branches[0][0]);
      firstRun = false;
      ld("Intersection grid created: ", grid);
      console.log("Initial state", branches);
      return { all: branches, new: branches[0], grid: grid, M:M };
    }
    ld("**** About to Grow Plant ", branches);
    //Now, for each branch, we grow
    let newLeaves = [];
    let bClone = [...branches]; //clone, because it can change mid for loop
    for (let i = 0; i < bClone.length; i++) {
      let branch = bClone[i];
      let lastNode = branch[branch.length - 1];
      ld("/// Branch " +  i + " : Last Node type " + lastNode.type);
      let newNodes = extendNode(lastNode);
      ld("/// New nodes received ", newNodes)
      if (newNodes !== undefined) {
        newLeaves.push(...newNodes);
      } 
    }
    ld(">>> Growth complete", branches, newLeaves);
    return { all: branches, new: newLeaves, grid: grid, M: M };
  };

  return grow;
};

const garden = (W, H, M, SPACING, {SPACE_BETWEEN_BRANCHES, FLOWER_SIZE}) => {
  const divide = Math.random() > 0.5 ? "horizontally" : "vertically";
  const numDivisions = MINIMAL_MODE ? 1 : Math.floor( 1+ Math.random() * 2 + 1);
  let firstRun = true;
  const planters = [];

  //Setup planters
  if (divide == "horizontally") {
    const spaceEach = W / numDivisions;
    for (var i = 0; i < numDivisions; i++) {
      let mw = spaceEach;
      planters.push({
        w: mw,
        h: H,
        x: spaceEach * i,
        y: 0,
        plant: plant(mw, H, M, SPACING, {SPACE_BETWEEN_BRANCHES, FLOWER_SIZE}),
        leaves: [],
        hasBorder: true,
      });
    }
  } else {
    const spaceEach = H / numDivisions;
    for (var i = 0; i < numDivisions; i++) {
      let mh = spaceEach;
      planters.push({
        w: W,
        h: mh,
        x: 0,
        y: spaceEach * i,
        plant: plant(W, mh, M, SPACING, {SPACE_BETWEEN_BRANCHES, FLOWER_SIZE}),
        leaves: [],
        hasBorder: true,
      });
    }
  }

  //For each planter, iterate the plants
  const iterate = () => {
    if (firstRun) {
      firstRun = false;
      return planters;
    }
    planters.forEach((planter) => {
      planter.leaves = planter.plant();
    });
    return planters;
  };
  return iterate;
};

//from: https://stackoverflow.com/questions/3838329/how-can-i-check-if-two-segments-intersect
function ccw(A, B, C) {
  return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x);
}

function lineoverlap(A, B, C, D) {
  return ccw(A, C, D) != ccw(B, C, D) && ccw(A, B, C) != ccw(A, B, D);
}
