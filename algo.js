//TYPES
/* 
 node = { 
  type: "F" for straight, "/" for start a branch, * for flower
  x: xPos,
  y: yPos,
  angle: current angle at which node is moving (heading),
  branchD: how "deep" the branches are (how many times it has been "branched" from the root),
  branchN: What the branch # is 
  index: what index is the node along the branch 
  size?: size of flower 
 }
*/

const DBG = true;

const ld = (mgs, ...args) => {
  if (DBG) {
    console.log(msg, args);
  }
};
const algo = (W, H, M, SPACING) => {
  const BRANCH_PROBABILITY = 0.2;
  const MAX_DEPTH = 1;
  const BRANCH_ANGLE = Math.PI / 4;
  const CURVE_INCREMENT = Math.PI/20;

  const ANGLED_LENGTH = ((W/2)-M) / Math.cos(BRANCH_ANGLE);
  const MAX_INCREMENTS = Math.floor(ANGLED_LENGTH/M);
  console.log("Initialized .... " +  MAX_INCREMENTS);

  //Helpers
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

  //Key variables
  let leafNodes = [
    makeNode({ x: W / 2, y: H - SPACING, angle: -Math.PI / 2, branchD: 0, branchN: 0, index: 0, type: "F" }, {}),
  ];
  const branches = [[...leafNodes]];
  const curvePoints = [undefined];

  //Action
  const intersects = (n) => {
    //If its about to circle back on itself
  
    if (n.flipped){
      //todo: fix this
      if (n.angle && n.angle < -1.45 * Math.PI) {
        return true;
      }
      if (n.x < SPACING || n.y >= H - SPACING  || n.y <= SPACING) {
        return true;
      } else {
        return false;
      }
    } else {
      //is going right, can go out at right edge, or top or bottom 
      if (n.angle && n.angle > 1.45 * Math.PI) {
        return true;
      }
      if (n.x > W - SPACING || n.y >= H - SPACING || n.y <= SPACING) {
        return true;
      } else {
        return false;
      }
    }
   
  };
  const createNewNode = (node) => {
    if (node.type == "*") {
      return undefined;
    }
    if (node.type == "F" || node.type == "+") {
      let newNode = makeNode(
        { x: node.x + M * Math.cos(node.angle), y: node.y + M * Math.sin(node.angle), index: node.index + 1 },
        node
      );
      //Can start a curve, or if it is curving, then just continue that curve
      if ( (node.curveAt && node.index > node.curveAt) || node.type == "+") { 
        if (curvePoints[node.index] === undefined) {
          //Capture the first point at which the node is curving
          curvePoints[node.index] = node.index;
        }
        let curve = node.flipped ? -CURVE_INCREMENT : CURVE_INCREMENT;
        newNode = makeNode( { angle: node.angle + curve , type: "+" }, newNode);
      }
      if (intersects(newNode)) {
        newNode = makeNode({ type: "*", size: M }, node);
      }
      addToBranch(newNode);
      return [newNode];
    }
    if (node.type == "/") {
      //When we meet a branch, we create two new nodes *at the branch spot* that then spawn nodes off it.
      //This is done so that the branch contains its original spawn point as its first spot

      //TODO There is likely a better algorithm for this -- that predicts on average how many indices there will be
      let curveAt = (MAX_INCREMENTS/3) + ( (Math.random() * 0.5) * MAX_INCREMENTS);
      let lNode = createBranchedNode(node, -Math.PI / 2 + BRANCH_ANGLE, {curveAt});
      addToBranch(lNode);
      let lNext = createNewNode(lNode);

      let rNode = createBranchedNode(node, -Math.PI / 2 - BRANCH_ANGLE, {flipped: true, curveAt});
      addToBranch(rNode);
      let rNext = createNewNode(rNode);

      return [...lNext, ...rNext];
    }
  };
  const createBranchedNode = (node, angle, {flipped, curveAt}) => {
    return makeNode(
      {
        type: "F",
        index: 0,
        branchN: branches.length,
        branchD: node.branchD + 1,
        angle,
        flipped,
        curveAt 
      },
      node
    );
  };

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
