


const lineDefaultParams = 
{
  W: 600,
  H: 600,
  M: 10,
  SPACING: 20,
  bgColor: [30, 0, 100],
  ANIMATE: true && !MINIMAL_MODE,
  GHOST: false
}
class LineDraw {
  constructor(overrideParams) {
    this.params = {
      ...lineDefaultParams,
      ...overrideParams
    }
  }
  drawFrame = (p, frame) => {
    p.strokeWeight(1);
    p.stroke(this.params.bgColor[0], this.params.bgColor[1], this.params.bgColor[2]/2, 100);
    p.noFill();
    p.rect(frame.x + frame.w / 2, frame.y + frame.h / 2, frame.w, frame.h);
  };
  drawFlower = (p, cl) => {
    p.fill("black");
    p.push();
    p.translate(cl.x, cl.y);
    p.rotate(cl.angle);
    
    p.rect(0, 0, cl.magnitude * 2, cl.magnitude);
    p.pop();
  }
  drawLeaf = (p, cl) => {
    // return;
    if (cl.type == "*") {
      this.drawFlower(p, cl);
    }
    //Point
    p.fill(0,50,50);
    p.noStroke();
    p.rect(cl.x, cl.y, 3);

    //Line
    p.noFill();
    p.stroke(0, 10, 80);
    p.line(cl.x, cl.y, cl.x + cl.magnitude * Math.cos(cl.angle), cl.y + cl.magnitude * Math.sin(cl.angle));

  }
  drawBranch = (p, cl, pl) => {
    return;
    p.strokeWeight(1);
    p.stroke("black");
    if (cl.type == "*") {
      this.drawFlower(p,cl);
    } else {
      p.line(cl.x, cl.y, pl.x, pl.y);
    }
  };
}

const lineDrawer = new LineDraw();
const lineSketch = sketchFactory(lineDrawer);
const linep5 = new p5(lineSketch);

// const lineDrawerSpaced = new LineDraw({M: 50, SPACING: 25});
// const lineSketchSpaced = sketchFactory(lineDrawerSpaced);
// const linep5Spaced = new p5(lineSketchSpaced);