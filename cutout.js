

const mw = 600;

const cutoutDefaultParams = 
{
  W: mw,
  H: mw,
  M: mw / 40,
  SPACING: mw / 20,
  bgColor: [55, 50, 100],
  ANIMATE: true && !MINIMAL_MODE,
  GHOST: false
}

class CutoutDraw {

  constructor(overrideparams) {
    this.params = {
      ...cutoutDefaultParams,
      ...overrideparams
    }
    this.shapeThickness = this.params.M / 2;
    this.rotatationAmt = 5 * Math.PI / 180;
  }

  drawFlower = (p, cl) => {
    p.push();
    p.fill(180 + p.frameCount % 40, 100, 80);
    p.noStroke();
    p.translate(cl.x - cl.magnitude/2, cl.y );
    p.rotate(cl.angle); 
    p.rect(0,0, cl.magnitude, this.shapeThickness);
    p.pop();
  }
  drawFrame = (p, frame) => {
    p.noFill();
    p.strokeWeight(this.shapeThickness);
    p.stroke(0, 0, 30);
    p.rect(frame.x + frame.w / 2, frame.y + frame.h / 2, frame.w, frame.h);
  }
  drawLeaf = (p, cl) => {
    if (cl.type == "*") {
      this.drawFlower(p, cl);
      return;
    }
    if (cl.index == 0 && cl.branchD > 0) {
      //First branch 
      return;
    }

    p.push();
    
    
     
    p.strokeWeight(1);
    p.translate(cl.x - cl.magnitude/2, cl.y);
    p.rotate(cl.angle + p.random(-this.rotatationAmt, this.rotatationAmt));

    p.fill("black");
    p.stroke(...this.params.bgColor);
    p.rect(0,0, cl.magnitude, this.shapeThickness);

    // p.stroke(p.frameCount * 10 % 360, 50, 80);
    // p.line(-cl.magnitude/2, 0, cl.magnitude/2, 0);
    p.pop();
  }
  drawBranch = (p, cl, pl) => {

  }
}

const cutoutDrawer = new CutoutDraw();
const cutoutSketch = sketchFactory(cutoutDrawer);
const cutoutP5 = new p5(cutoutSketch);

