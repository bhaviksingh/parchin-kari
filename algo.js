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

let BRANCH_PROBABILITY = 0.2;
let MAX_DEPTH = 1;
const BRANCH_ANGLE = Math.PI / 4;

const ld = (mgs, ...args) => {
  if (DBG) {
    console.log(msg, args);
  }
};
const algo = (W, H, M, SPACING) => {
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


  //Action
  const out = (n) => {
    if (n.x >= W - SPACING || n.y >= H - SPACING || n.x <= SPACING || n.y <= SPACING) {
      return true;
    } else {
      return false;
    }
  };
  const createNewNode = (node) => {
    if (node.type == "*") {
      return undefined;
    }

    if (node.type == "F") {
      let newNode = makeNode(
        { x: node.x + M * Math.cos(node.angle), y: node.y + M * Math.sin(node.angle), index: node.index + 1 },
        node
      );
      if (out(newNode)) {
        newNode = makeNode({ type: "*", size: M }, node);
      }
      console.log("NEW NODE CREATED", newNode);
      addToBranch(newNode);
      return [newNode];
    }
    if (node.type == "/") {
      let lNode = createBranchedNode(node, - Math.PI/2 + BRANCH_ANGLE);
      addToBranch(lNode);

      let rNode = createBranchedNode(node, - Math.PI/2 - BRANCH_ANGLE);
      addToBranch(rNode);

      return [lNode, rNode];
    }
  };
  const createBranchedNode = (node, angle) => {
    let bn =  makeNode(
      {
        type: "F",
        x: node.x + M * Math.cos(angle),
        y: node.y + M * Math.sin(angle),
        angle,
        index: 0,
        branchN: branches.length,
        branchD: node.branchD + 1,
      },
      node
    );
    return bn;
  }

  const addLeaf = () => {
    let newLeaves = [];

    leafNodes.forEach((node) => {
      //Every node gets a chance to continue
      const continuedNodes = createNewNode(node);
      if (continuedNodes) {
        // console.log("Continuing node");
        newLeaves.push(...continuedNodes);
      }

      
      //Some nodes get a chance to branch
      if (Math.random() < BRANCH_PROBABILITY && node.branchD <  MAX_DEPTH) {
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
