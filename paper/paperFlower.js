

/*** 
 * PETAL
 * Expects in node: color, subdives, flatSide, curveIncrementLeaf, curveAtLeaf`
 */
 class PaperPetal {

  constructor(node) {
    this.petalNode = node;
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
    this.curveIncrement = node.curveIncrementPetal || 0;

    let curveAtPercent = this.curveIncrement ? (node.curveAtPetal !== undefined ? node.curveAtPetal : 0.5) : 1.2;
    this.curveIndex = Math.floor(curveAtPercent * this.subDivs);
    //console.log(this);
    this.drawLeaf(); 
  }

  drawLeaf() {
    let skeleton = this.skeleton;
    let skin = this.skin;
    let petalNode = this.petalNode;

    const flowerEnd = nextXY(petalNode, petalNode.size);

    let subdivs = this.subDivs;
    for (let i = 0; i <= subdivs; i++) {
      let step = Math.sin(i / subdivs * Math.PI) * this.width;
      let flangle = i >= this.curveIndex ? petalNode.angle + (i - this.curveIndex + 1) * this.curveIncrement : petalNode.angle;
      let subpoint = nextXY({...petalNode, angle: flangle} , petalNode.size * (i / subdivs));

      skeleton.add([subpoint.x, subpoint.y]);

      let nextL = nextXY({ ...subpoint, angle: petalNode.angle - Math.PI / 2 }, step);
      let nextR = nextXY({ ...subpoint, angle: petalNode.angle + Math.PI / 2 }, this.flatSide ? step * 0.8 : step);

      skin.add(nextL.x, nextL.y);
      skin.insert(0, [nextR.x, nextR.y]);

    }
  }
}


/**
 * FLOWER
 * expects in node: showPistil, pistilSize, numPetals, petalArcAngle, all the petal ones too
 */
class PaperFlower {

  constructor(node) {
    this.flowerNode = node;
    this.petals = [];
    this.pistil = null;
    this.showPistil = node.showPistil == undefined ? true : node.showPistil ;
    this.myGroup = new paper.Group();

    this.pistilSize = node.size  * 0.25;
    this.numPetals = node.numPetals || 3;
    this.petalArcAngle = node.petalArcAngle || Math.PI ;

    // console.log('Making flower node' , node);
    this.drawFlower();
    this.drawPistil();
  }

  drawFlower() {
    let angleIncrements = this.petalArcAngle / this.numPetals;
    let numPerSide = Math.floor(this.numPetals / 2);
    //Circumfrence * % of 2pi =  ( 2* Math.PI * this.pistilSize) * ( this.petalArcAngle  / (2 * Math.PI)) -> ps * petalArAngle inflated by 1.1 to make them supertouch
    let leafWidth = this.flowerNode.width || (this.pistilSize * this.petalArcAngle * 1.1)/ this.numPetals;

    for (let i = - numPerSide; i <= numPerSide; i++) {
      if ( i == 0 && this.numPetals % 2 == 0 ) continue;
      let petalAngle = this.flowerNode.angle + i * angleIncrements;

      let petalCoords = nextXY({...this.flowerNode, angle: petalAngle}, this.pistilSize);
      let petal = new PaperPetal({...this.flowerNode, x: petalCoords.x, y: petalCoords.y, angle: petalAngle, size: this.flowerNode.size - this.pistilSize, width: leafWidth});
      this.petals.push(petal);
      this.myGroup.addChild(petal.myGroup);
    }
  }
  drawPistil() {
    if (this.showPistil) {
      this.pistil = new paper.Path.Circle({x: this.flowerNode.x, y: this.flowerNode.y, radius: this.pistilSize});
      this.pistil.strokeColor = "black"
      this.pistil.sendToBack();
      this.myGroup.addChild(this.pistil);
    } 
  }

}

class PaperFlowerEllipse extends PaperFlower {

  constructor(node) {
    this.pistilSize = node.pistilSize || [node.size / 4, node.size / 4];
    this.drawFlower();
  }

  drawFlower() {

    let angleIncrements = this.petalArcAngle / this.numPetals;
    let numPerSide = Math.floor(this.numPetals / 2);

    for (let i = - numPerSide; i <= numPerSide; i++) {
      if ( i == 0 && this.numPetals % 2 == 0 ) continue;
      let petalAngle = this.flowerNode.angle + i * angleIncrements;

      let petalCoords = {x: this.flowerNode.x + this.pistilSize[0] * Math.cos(petalAngle), y: this.flowerNode.y + this.pistilSize[1] * Math.sin(petalAngle)};
      let petal = new PaperPetal({...this.flowerNode, x: petalCoords.x, y: petalCoords.y, angle: petalAngle, size: this.flowerNode.size - this.pistilSize[1]});
      this.petals.push(petal);
      this.myGroup.addChild(petal.myGroup);
    }

   

  }

}
