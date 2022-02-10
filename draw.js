let a1;

let W = Math.random() * 400 + 200;
let H = Math.random() * 400 + 200;
let M = 10;
let SPACING = 10;

const ANIMATE = true;
const GHOST = false;

let currentLeaves;
let newLeaves;

function setup() {
  createCanvas(W, H);
  a1 = algo(W, H, M, SPACING);
  iterate();
  background(255, 255, 255);
  rectMode(CENTER);
}

function draw() {
  if (GHOST) background(255, 255, 255, 60);

  //Draw last branch
  strokeWeight(1);
  currentLeaves.forEach((branch) => {
    let cn = branch[branch.length - 1];
    let pn = branch[branch.length - 2];
    line(cn.x, cn.y, pn.x, pn.y);
  });

  //Draw only new leaves as points

  newLeaves.forEach((node) => {
    drawLeaf(node);
  });

  if (ANIMATE) {
    iterate();
  }
}

function drawLeaf(node) {
  push();
  if (node.type == "*") {
    strokeWeight(1);
    fill("yellow");
    rect(node.x, node.y, node.size, node.size);
  } else {
    strokeWeight(3);
    point(node.x, node.y);
  }
  pop();
}

function iterate() {
  //console.log("iterating")
  const generatedLeaves = a1();
  currentLeaves = generatedLeaves.all;
  newLeaves = generatedLeaves.new;
  //console.log(currentLeaves);
  //console.log(newLeaves);
}


function keyPressed() {
  iterate();
  if (key == "q") {
    background(255, 255, 255);
    a1 = algo(W, H, M, SPACING);
  }
}
