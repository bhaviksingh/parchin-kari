class PaperPetal {

  constructor(node) {
    this.flowerNode = node;
    this.skeleton = new paper.Path();
    this.skin = new paper.Path();
    this.myGroup = new paper.Group([this.skeleton, this.skin]);
    this.skeleton.strokeColor = this.skin.strokeColor = "black";
    this.skin.fillColor =  node.color || "rgb(100,200,150)";
    this.skin.closed = true;
    this.skin.sendToBack();  
    this.subDivs = node.subdivs || 5;
    this.width = node.width ||  node.size / 10;
    this.flatSide = node.flatSide;
    this.curveIncrement = node.curveIncrement || 0;

    let curveAtPercent = this.curveIncrement ? (node.curveAt !== undefined ? node.curveAt : 0.5) : 1.2;
    this.curveIndex = Math.floor(curveAtPercent * this.subDivs);
    console.log(this);
    this.drawLeaf(); 
  }

  drawLeaf() {
    let skeleton = this.skeleton;
    let skin = this.skin;
    let flowerNode = this.flowerNode;

    const flowerEnd = nextXY(flowerNode, flowerNode.size);

    let subdivs = this.subDivs;
    for (let i = 0; i <= subdivs; i++) {
      let step = Math.sin(i / subdivs * Math.PI) * this.width;
      let flangle = i >= this.curveIndex ? flowerNode.angle + (i - this.curveIndex + 1) * this.curveIncrement : flowerNode.angle;
      console.log(this.curveIndex,  i - this.curveIndex + 1, flangle);
      let subpoint = nextXY({...flowerNode, angle: flangle} , flowerNode.size * (i / subdivs));

      skeleton.add([subpoint.x, subpoint.y]);

      let nextL = nextXY({ ...subpoint, angle: flowerNode.angle - Math.PI / 2 }, step);
      let nextR = nextXY({ ...subpoint, angle: flowerNode.angle + Math.PI / 2 }, this.flatSide ? step * 0.8 : step);

      skin.add(nextL.x, nextL.y);
      skin.insert(0, [nextR.x, nextR.y]);

    }
  }
}
