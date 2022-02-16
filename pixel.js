
function resizeWithCSSPixelated(cnv, w,h) {
  cnv.style = `width: ${w}px; height: ${h}px`;
  cnv.className = "pixelated-rendering";
} 
const sf = 10;

const pixel = (p) => {
  let a1;

  let W = Math.random() * 40 + 20;
  let H = Math.random() * 40 + 20;
  let M = 2;
  let SPACING = 1;
  

  const ANIMATE = true;
  const GHOST = false;

  let currentLeaves;
  let newLeaves;


  p.setup = () => {
    let cnv = p.createCanvas(W, H);
    a1 = algo(W, H, M, SPACING);
    iterate();
    p.background(255, 255, 255);
    p.rectMode(p.CENTER);
    resizeWithCSSPixelated(cnv.canvas, W*sf,H*sf);
  }

  p.draw = () => {
    if (GHOST) p.background(255, 255, 255, 60);

    //Draw last branch
    p.strokeWeight(1);
    currentLeaves.forEach((branch) => {
      let cn = branch[branch.length - 1];
      let pn = branch[branch.length - 2];
      p.line(cn.x, cn.y, pn.x, pn.y);
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
    p.push();
    if (node.type == "*") {
      p.strokeWeight(1);
      p.fill("yellow");
      p.rect(node.x, node.y, node.size, node.size);
    } else {
      p.strokeWeight(3);
      p.point(node.x, node.y);
    }
    p.pop();
  }

  function iterate() {
    //console.log("iterating")
    const generatedLeaves = a1();
    currentLeaves = generatedLeaves.all;
    newLeaves = generatedLeaves.new;
    //console.log(currentLeaves);
    //console.log(newLeaves);
  }

  p.keyPressed  = () => {
    iterate();
    if (p.key == "q") {
      p.background(255, 255, 255);
      a1 = algo(W, H, M, SPACING);
    }
  }
};

const pixelSketch = new p5(pixel);