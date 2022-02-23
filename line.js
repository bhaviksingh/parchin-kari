


const lineDefaultParams = 
{
  W: 600,
  H: 600,
  M: 10,
  SPACING: 15,
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
  drawBranch = (p, cl, pl) => {
    p.strokeWeight(1);
    p.stroke("black");
    if (cl.type == "*") {
      p.fill(cl.color || "yellow");
      p.rect(cl.x, cl.y, cl.size, cl.size);
    } else {
      p.line(cl.x, cl.y, pl.x, pl.y);
    }
    p.rect(cl.x, cl.y, 1)
  };
}

const lineDrawer = new LineDraw();
const lineSketch = sketchFactory(lineDrawer);
const linep5 = new p5(lineSketch);

const lineDrawerSpaced = new LineDraw({M: 20, SPACING: 25});
const lineSketchSpaced = sketchFactory(lineDrawerSpaced);
const linep5Spaced = new p5(lineSketchSpaced);