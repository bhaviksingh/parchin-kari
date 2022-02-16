
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
  size?: size of flower 
  flipped?: true if its a LEFT branch (useful for updating curve angles later)
  curveAt?: static number generated for curve branches, deciding when they should start curving
 }

*************
DO AT SOME POINT 
*************
- Maybe use SPACING to FORCE the branches to be a certain distance apart. Eg: every "F" on home, subtract M/S and then when counter == 0 , you *can* draw... but you may not.
- optimization: right now the curves are checking intersection with all branches -- not needed, can check every 2nd (other than first), because it should only intersect on "its side"
*/

const DBG = true;

const ld = (mgs, ...args) => {
  if (DBG) {
    console.log(msg, args);
  }
};
const plant = (W, H, M, SPACING) => {
  const BRANCH_PROBABILITY = 0.2;
  const MAX_DEPTH = 1;
  const INIT_ANGLE = 1.5 *  Math.PI;
  const BRANCH_ANGLE = 0.30 * Math.PI;
  const CURVE_INCREMENT = 0.1 * Math.PI;

  const ANGLED_LENGTH = ((W/2)-M) / Math.cos(BRANCH_ANGLE);
  const MAX_INCREMENTS = Math.floor(ANGLED_LENGTH/M)  ;
  //const MAX_INCREMENTS = 2;
  
  console.log("Initialized .... " +  MAX_INCREMENTS);

  //******** Helpers
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
  };
  const captureCurvePoint = (node) => {
    if (curvePoints[node.branchN] === undefined) {
      //Capture the first point at which the node is curving
      curvePoints[node.branchN] = node.index;
    }
  }
  const makeStraightNode = (node) => {
    return makeNode(
      { x: node.x + M * Math.cos(node.angle), y: node.y + M * Math.sin(node.angle), index: node.index + 1 },
      node
    );
  }
  const makeFlowerNode = (node) => {
    return makeNode({ type: "*", size: M }, node);
  }
  const makeCurvedNode = (node) => {
    let curve = node.flipped ? -CURVE_INCREMENT : CURVE_INCREMENT;
    curve = node.curveOpposite ? curve * -1 : curve;
    let newNode = makeStraightNode(node); //continue this, and increase angle for next time.
    return makeNode( { angle: node.angle + curve , type: "+" }, newNode);
  }
  const makeBranchedNode = (node, angle, {flipped, curveAt, curveOpposite}) => {
    return makeNode(
      {
        type: "F",
        index: 0,
        branchN: branches.length,
        branchD: node.branchD + 1,
        angle,
        flipped,
        curveAt,
        curveOpposite
      },
      node
    );
  };
  

  //******** Key variables
  let leafNodes = [
    makeNode({ x: W / 2, y: H - SPACING, angle: INIT_ANGLE, branchD: 0, branchN: 0, index: 0, type: "F" }, {}),
  ];
  const branches = [[...leafNodes]];
  const curvePoints = [undefined];
  
  //******** Action
  const out = (n) => {
    if (n.x <= SPACING || n.x >= W - SPACING || n.y >= H - SPACING || n.y <= SPACING) {
      return true;
    } else {
      return false;
    }
  };
  const intersectsCurve = (n, nn) => {
    const myAngle = n.angle - INIT_ANGLE + (n.flipped ? BRANCH_ANGLE : -1 * BRANCH_ANGLE);
    if (myAngle && Math.abs(myAngle) > 1.9 * Math.PI) {
      //console.log("Stopping at ", myAngle / Math.PI);
      return true;
    }
    //Check if im about to intersect another branch
    //Create a line for myself projecting out at my current angle
    const myLine = [{x: nn.x, y: n.y}, {x: nn.x + SPACING * Math.cos(nn.angle), y: nn.y + SPACING * Math.sin(nn.angle)}];
    for (var i =0; i<branches.length; i++) {
      let lbi = curvePoints[i] !== undefined ? curvePoints[i] : 0;
      let b0 = branches[i][0];
      let bn = branches[i][lbi];
      let branchLine = [{x: b0.x, y: b0.y} , {x: bn.x, y: bn.y}];
      if (lineoverlap(myLine[0], myLine[1], branchLine[0], branchLine[1])) {
        console.log("OVERLAP! stopping", n.branchN,  i);
        return true;
      }
      //What if it hits a curve? TODO: Use NN for this eventually..
    }
  }
  const createNewNode = (node) => {
    if (node.type == "*") {
      return undefined;
    }
    if (node.type == "/") {
      //When we meet a branch, we create two new nodes, the spawn point and the first branch node, so the branch contains its spawn point
      let curveAt = (MAX_INCREMENTS/3) + ( (Math.random() * 0.5) * MAX_INCREMENTS);
      let curveOpposite = Math.random() > 0.5; 
      let lNode = makeBranchedNode(node, node.angle + BRANCH_ANGLE, {curveAt, curveOpposite});
      addToBranch(lNode);
      let lNext = createNewNode(lNode);
      let rNode = makeBranchedNode(node, node.angle - BRANCH_ANGLE, {flipped: true, curveAt, curveOpposite});
      addToBranch(rNode);
      let rNext = createNewNode(rNode);
      return [...lNext, ...rNext]; //we only return the new nodes as these are the "leaves" 
    }
    let newNode;
    if (node.type == "F") {
      newNode = makeStraightNode(node);
      if (out(newNode) ) {
        captureCurvePoint(node);
        newNode = makeFlowerNode(node);
      }
      if (node.curveAt && node.index > node.curveAt){
        captureCurvePoint(node);
        newNode = makeCurvedNode(node);
        console.log("Creating curved node", newNode);
      }
    } else if (node.type == "+") {
      //TOOD: Can optimizie this by unbundling checks and doing more efficient ones first
      newNode = makeCurvedNode(node);
      let isOut = out(newNode);
      let intersectsC = intersectsCurve(node, newNode);
      if (isOut || intersectsC){
        newNode = makeFlowerNode({...node, color: intersectsC ? "red" : "purple"});
      }
    }
    addToBranch(newNode);
    return [newNode];
  };


  //Main function. Acts as public iterator to move things along
  const addLeaf = () => {
    let newLeaves = [];

    leafNodes.forEach((node) => {
      //Every node gets a chance to continue growing
      const continuedNodes = createNewNode(node);
      if (continuedNodes) {
        // console.log("Continuing node");
        newLeaves.push(...continuedNodes);
      }
      //Some nodes get a chance to branch
      if (Math.random() < BRANCH_PROBABILITY && node.branchD < MAX_DEPTH) {
        // console.log("Creating branches");
        let newNodes = createNewNode({ ...node, type: "/" });
        if (newNodes) {
          newLeaves.push(...newNodes);
        }
      }  
     
    });
    leafNodes = newLeaves;
    return { new: leafNodes, all: branches };
  };

  return addLeaf;
};


const garden = (W,H, M, SPACING) => {

  const divide = Math.random() > 0.5 ? "horizontally" : "vertically";
  const numDivisions = Math.floor(Math.random() * 2 + 1);

  const planters = [];

  //Setup planters
  if (divide == "horizontally") {
    const spaceEach = W / numDivisions;
    for (var i =0; i<numDivisions; i++) {
      let mw = spaceEach;
      planters.push( {
        w: mw,
        h: H,
        x: spaceEach * i,
        y: 0,
        plant: [ plant(mw, H, M, SPACING) ],
        leaves: []
      })
      
    }
  } else {
    const spaceEach = H / numDivisions;
    for (var i =0; i<numDivisions; i++) {
      let mh = spaceEach;
      planters.push( {
        w: W,
        h: mh,
        x: 0,
        y: spaceEach * i,
        plant: [ plant(W, mh, M, SPACING) ],
        leaves: []
      })
    }
  }

  //Add plants to planters
  const getLeaves = () => {
    planters.forEach((planter) => {
      planter.leaves = planter.plant.map(f => f());
    });

    return planters;
  }
  return getLeaves;
}

//from: https://stackoverflow.com/questions/3838329/how-can-i-check-if-two-segments-intersect
function ccw(A,B,C){
  return (C.y-A.y) * (B.x-A.x) > (B.y-A.y) * (C.x-A.x)
}

function lineoverlap(A,B,C,D) {
  return ccw(A,C,D) != ccw(B,C,D) && ccw(A,B,C) != ccw(A,B,D)
}
 