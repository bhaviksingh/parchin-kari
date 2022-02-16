

const pixel = (p) => {
  let f1;

  let W = Math.random() * 400 + 200;
  let H = Math.random() * 400 + 200;
  let M = 20;
  let SPACING = 20;
  
  const RSIZE = 4;

  const ANIMATE = false;
  const GHOST = false;

  let currentLeaves;
  let newLeaves;


  p.setup = () => {
    let cnv = p.createCanvas(W, H);
    f1 = plant(W, H, M, SPACING);
    iterate();
    p.rectMode(p.CENTER);
    p.colorMode(p.HSB);
    p.background(30, 100, 15);
  }

  let h = 100;
  let s = 20;

  p.draw = () => {
    if (GHOST) p.background(255, 255, 255, 60);

    //Draw last branch
    
    

    currentLeaves.forEach((branch) => {
      let cn = branch[branch.length - 1];
      let pn = branch[branch.length - 2];
      //p.strokeWeight(1);
      // p.line(cn.x, cn.y, pn.x, pn.y);
      
      p.noStroke();
      
      if (cn.type != "*") {

        for (let i =0; i<M; i = i + RSIZE) {
          p.fill(h,s,s);

          const nx = pn.x + i * Math.cos(pn.angle);
          const ny = pn.y + i * Math.sin(pn.angle);
          p.rect( nx, ny, RSIZE);
          h = h + 20;
        }
      }
      h = p.random(100, 150);
      
    });

    //Draw only new leaves as points

    newLeaves.forEach((node) => {
      drawLeaf(node);
    });

    if (p.frameCount % 5 == 0) {
      iterate();
      s = (s+ 1) % 100;
    }
    
  }

  function drawLeaf(node) {
    p.push();
    if (node.type == "*") {
      if (node.color) p.fill(node.color) 
      else p.fill("yellow");
      p.rect(node.x, node.y, RSIZE * 2 );
    } else {
      p.fill("black");
      //p.rect(node.x, node.y, RSIZE);
    }
    p.pop();
  }

  function iterate() {
    //console.log("iterating")
    const generatedLeaves = f1();
    currentLeaves = generatedLeaves.all;
    newLeaves = generatedLeaves.new;
    //console.log(currentLeaves);
    //console.log(newLeaves);
  }

  p.keyPressed  = () => {
    iterate();
    if (p.key == "q") {
      p.background(30, 100, 15);
      f1 = plant(W, H, M, SPACING);
    }
  }
};

const pixelSketch = new p5(pixel);