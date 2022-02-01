let a1;

let W = 400;
let H = 400;
let M = 10;
let SPACING = 10;

let currentLeaves; 

function setup() {
  createCanvas(W,H);
  a1 = algo(W,H, M, SPACING);
  currentLeaves = a1().all;
}

function draw() {
  background(255,255,255)
  strokeWeight(3);

  currentLeaves.forEach((branch) => {
    branch.forEach((node) => {
      if (node.type == "*") {
        rect(node.x, node.y, node.size, node.size);
      } else {
        point(node.x, node.y);
      }
    } )

    //currentLeaves = a1().all;
  });
  
}

function mousePressed() {
  currentLeaves = a1().all;
  console.log(currentLeaves);
}