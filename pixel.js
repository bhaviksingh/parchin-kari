

const pixel = (p) => {
  let g;

  let W = 600;
  let H = 600;
  let M = 20;
  let SPACING = 20;
  
  const RSIZE = 4;

  const ANIMATE = true;
  const GHOST = false;

  let allPlanters = [];


  p.setup = () => {
    let cnv = p.createCanvas(W, H);
    g = garden(W, H, M, SPACING);
    iterate();
    p.rectMode(p.CENTER);
    p.colorMode(p.HSB);
    p.background(30, 100, 7);
  }

  let h = 100;
  let s = 50;

  p.draw = () => {
    if (GHOST) p.background(255, 255, 255, 60);

    //Draw last branch
    
    
    allPlanters.forEach((planter, i) => {
      p.strokeWeight(RSIZE);
      p.stroke("gray");
      //p.fill(20 + i * 20, 100,15);
      p.noFill();
      p.rect(planter.x + planter.w /2 , planter.y + planter.h/2, planter.w, planter.h);


      p.push();
      p.translate(planter.x, planter.y);
      planter.leaves.forEach((l) => {
        let currentLeaves = l.all;
        let newLeaves = l.new;

        currentLeaves.forEach((branch) => {
          let cn = branch[branch.length - 1];
          let pn = branch[branch.length - 2];
          //p.strokeWeight(1);
          // p.line(cn.x, cn.y, pn.x, pn.y);

          p.noStroke();

          if (cn.type != "*") {
            for (let i = 0; i < M; i = i + RSIZE) {
              p.fill(h, s, s);

              const nx = pn.x + i * Math.cos(pn.angle);
              const ny = pn.y + i * Math.sin(pn.angle);
              p.rect(nx, ny, RSIZE);
              h = h + 20;
            }
          }
          h = p.random(100, 150);
        });
        newLeaves.forEach((node) => {
          drawLeaf(node);
        });

      });
      p.pop();
      
    });

    //Draw only new leaves as points

 

    if (ANIMATE && p.frameCount % 5 == 0) {
      iterate();
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
    allPlanters = g();
    console.log(allPlanters);
  }

  p.keyPressed  = () => {
    iterate();
    if (p.key == "q") {
      p.background(30, 100, 15);
      g = garden(W, H, M, SPACING);
      allPlanters = [];
      iterate();
    }
  }
};

const pixelSketch = new p5(pixel);