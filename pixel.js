

const pixelDefaultParams = 
{
  W: 600,
  H: 600,
  M: 20,
  SPACING: 20,
  bgColor: [30, 5, 90],
  ANIMATE: true,
  GHOST: false
}
class PixelDraw {
  constructor(overrideParams) {
    this.params = {
      ...pixelDefaultParams,
      ...overrideParams
    }
    this.RSIZE = 4;
  }
  drawFrame = (p, frame) => {
    p.strokeWeight(this.RSIZE);
    p.stroke(this.params.bgColor[0], this.params.bgColor[1], this.params.bgColor[2]/2, 100);
    p.noFill();
    p.rect(frame.x + frame.w / 2, frame.y + frame.h / 2, frame.w, frame.h);
  };
  drawBranch = (p, cl, pl) => {
    p.noStroke();
    if (cl.type == "*") {
      const f = cl;
      p.fill(f.color || "white");
      p.rect(f.x, f.y, this.RSIZE *3);

      p.fill("black");
      p.rect(f.x, f.y, this.RSIZE);
      return;
    }
    for (let i = 0; i < this.params.M; i = i + this.RSIZE) {
      p.fill("black")
      const nx = pl.x + i * Math.cos(pl.angle);
      const ny = pl.y + i * Math.sin(pl.angle);
      p.rect(nx, ny, this.RSIZE);
    }    
  };
}

const pixelDrawer = new PixelDraw();
const pixelSketch = sketchFactory(pixelDrawer);
const pixelp5 = new p5(pixelSketch);