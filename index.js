const W = 600;
const H = 600;
const D = 20;
const SPACING = 10;
let BRANCH_PROBABILITY = 0.5;
let MAX_DEPTH = 2;
let nBranches = 0;
const GHOST_LINES = false;
const BRANCH_ANGLE = Math.PI / 4;

const out = (n) => {
  if (
    n.x >= W - SPACING ||
    n.y >= H - SPACING ||
    n.x <= SPACING ||
    n.y <= SPACING
  ) {
    return true;
  } else {
    return false;
  }
};

//Helper, create "node"
const cN = (x, y, angle, d, i) => {
  return {
    x: x,
    y: y,
    a: angle,
    i: i,
    d: d || 1,
  };
};

//Helper, create "flower" ( node with depth = 1000, size, and isFlower = true )
const cF = (x, y, angle, d, i) => {
  const FS = 10;
  return {
    x: x - FS / 2,
    y: y - FS / 2,
    a: angle,
    i: i,
    d: 1000,
    size: FS,
    isFlower: true, 
  };
};

//Creates a new node, by calculating new node pos, and checking if its "out of bounds" (creating flower). 
//Also adds this new node to the "branching" data structure to draw lines.
const cNN = (n, ang, r, index) => {
  let a = ang || n.a;
  let i = index ? index : n.i;
  let nn = cN(
    n.x + D * cos(a),
    n.y + D * sin(a),
    a,
    r ? n.d + 1 : n.d,
    i
  );

  if (out(nn)) {
    nn = cF(n.x, n.y, a, i);
  }
  if (allNodes[i]) {
    allNodes[i].push(nn);
  } else {
    allNodes[i] = [n, nn];
  }
  return nn;
};

//Variables to store nodes 
let leafNodes = [cN(W / 2, H - SPACING, -Math.PI / 2, false, 0)];
const allNodes = [[...leafNodes]];

function setup() {
  createCanvas(W, H);
  // frameRate(2);
  background("black");
}

function draw() {
  if (GHOST_LINES) background(0, 0, 0, 50);

  //Draw nodes
  stroke("white");
  strokeWeight(1);
  for (var i = 0; i < allNodes.length; i++) {
    if (allNodes[i].length >= 2) {
      let branch = allNodes[i];
      let pn = branch[branch.length - 2];
      let cn = branch[branch.length - 1];
      if (cn.isFlower) {
        drawFlower(cn);
      } else {
        point(cn.x, cn.y);
        line(pn.x, pn.y, cn.x, cn.y);
      }
    }
  }
  //Note: can also only draw leaf nodes pretty easily - by just doing leafNodes.forEach((n) => draw..)
  addLeaf();
}

function drawFlower(n) {
  push();
  fill("blue");
  noStroke();
  rect(n.x, n.y, n.size);
  pop();
}
function mousePressed() {
  //addLeaf();
}

function addLeaf() {
  let newLeaves = [];
  leafNodes.forEach((n, i) => {
    //If node is not a flower, create next node and add to leaves
    if (n.isFlower == undefined) {
      newLeaves.push(cNN(n));
    }
    // At this moment, could also create a flower! 
    // Leaves?
    
    //With some probability (and if its not at MAX_DEPTH), branch left and right too 
    //labeling "r" as recursive which sets branch depth + 1
    //and also just enumerating which branch # we're on (ie : 0 for main, 1 for next, 2 for next, etc used by allnodes)
    if (Math.random() < BRANCH_PROBABILITY && n.d < MAX_DEPTH) {
      nBranches = nBranches + 1;
      newLeaves.push(cNN(n, -Math.PI / 2 + BRANCH_ANGLE, n.d + 1, nBranches));

      nBranches = nBranches + 1;
      newLeaves.push(cNN(n, -Math.PI / 2 - BRANCH_ANGLE, n.d + 1, nBranches));
    }
  });
  leafNodes = newLeaves;
}
