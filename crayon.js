


const crayonDefaultParams = 
{
  W: 600,
  H: 600,
  M: 10,
  SPACING: 15,
  bgColor: [30, 0, 100],
  ANIMATE: true && !MINIMAL_MODE,
}
class crayonDraw extends LineDraw {
  constructor(overrideParams) {
    super({});
    this.params = {...crayonDefaultParams, ...overrideParams};
  }
  drawFrame = (p, frame) => {
    p.strokeWeight(1);
    p.stroke(this.params.bgColor[0], this.params.bgColor[1], this.params.bgColor[2]/2, 100);
    p.noFill();
    p.rect(frame.x + frame.w / 2, frame.y + frame.h / 2, frame.w, frame.h);
  };
  drawLeaf = (p, cl) => {
    if (cl.type == "*") {
      this.drawFlower(p, cl);
    }else {

      //As a subdivided line, randomly vibing (changes ever y frame)0
      let its = 5;
      let amt = (this.params.M ) / its;
      let thickness = 2;
      let deviation = 4;

      const shapePoints = [[],[]];
      //On the way up 
      for (let i =0; i<=its; i++) {
        let msub = amt * i;
        
        // Create a point that is offset by 90 degrees
        let cx = cl.x + msub * Math.cos(cl.angle); 
        let cy = cl.y + msub * Math.sin(cl.angle);

        let disturbance = () => i == 0 || i == its ? thickness : thickness + (Math.random() * deviation/2 - deviation/4);
        let upx = cx - disturbance() * Math.cos(cl.angle + Math.PI/2);
        let upy = cy - disturbance() * Math.sin(cl.angle + Math.PI/2);
        let downx = cx + disturbance() * Math.cos(cl.angle + Math.PI/2);
        let downy = cy  + disturbance() * Math.sin(cl.angle + Math.PI/2);

        shapePoints[0].push({x: upx, y: upy});
        shapePoints[1].push({x: downx, y: downy});

        
      }


      p.noStroke();
      p.fill(p.random(80,100), 100,100);
      p.beginShape();
      for (let i =0; i<shapePoints[0].length; i++) {
        p.vertex(shapePoints[0][i].x, shapePoints[0][i].y);
      }
      for (let i = shapePoints[1].length -1; i >= 0; i--) {
        p.vertex(shapePoints[1][i].x, shapePoints[1][i].y);
      }
      p.endShape(p.CLOSE);

      p.noFill();
      p.stroke(p.random(30,100),100,0);
      p.strokeWeight(1);
      p.beginShape();
      for (let i =0; i<shapePoints[0].length; i++) {
        p.vertex(shapePoints[0][i].x - p.random(), shapePoints[0][i].y);
      }
      p.endShape();
      p.beginShape();
      for (let i = shapePoints[1].length -1; i >= 0; i--) {
        p.vertex(shapePoints[1][i].x + p.random(), shapePoints[1][i].y);
      }
      p.endShape();
  
      
      // p.strokeWeight(1);
      // for (let i = 0 ; i < its ; i++) {
      //   let cx = cl.x  + p.random(-deviation, deviation) * Math.cos(cl.angle + Math.PI/2) + amt * i *  Math.cos(cl.angle) ;
      //   let cy = cl.y   + p.random(-deviation, deviation) * Math.sin(cl.angle + Math.PI/2) +  amt * i * Math.sin(cl.angle );
      //   if (i == 0 )
      //     p.stroke("yellow");
      //   else if (i == its - 1) 
      //     p.stroke("red");
      //   else
      //     p.stroke("black");
      //   p.point(cx, cy);
      // }

 
      // p.stroke("black");
      // p.strokeWeight(1);
      // if (Math.random() < 0.5) {
      //   p.fill("rgb(0,255,0)");
      // } else {
      //   p.fill("yellow");
      // }
      // p.beginShape();
      // for (let i = 0 ; i <= its ; i++) {
      //   let cx = cl.x  + p.random(-deviation, deviation) * Math.cos(cl.angle + Math.PI/2) + amt * i *  Math.cos(cl.angle) ;
      //   let cy = cl.y   + p.random(-deviation, deviation) * Math.sin(cl.angle + Math.PI/2) +  amt * i * Math.sin(cl.angle );  
      //   p.vertex(cx, cy);
      // }
      // p.endShape();
    }
  }
  drawBranch = (p, cl, pl) => {
  
  };
}

const crayonDrawer = new crayonDraw();
const crayonSketch = sketchFactory(crayonDrawer);
const crayonp5 = new p5(crayonSketch);

const crayonDrawerSpaced = new crayonDraw({M: 20, SPACING: 25});
const crayonSketchSpaced = sketchFactory(crayonDrawerSpaced);
const crayonp5Spaced = new p5(crayonSketchSpaced);