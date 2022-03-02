class PaperPlant {
  constructor(it, offsetx, offsety) {
    this.plantiterator = it;
    this.step = 10;
    this.skeletonPaths = [];
    this.skinPaths = [];
    this.trunkGroup = new paper.Group();
    this.branchGroup = new paper.Group();
    this.flowerGroup = new paper.Group();
    this.myGroup = new paper.Group([this.trunkGroup, this.branchGroup, this.flowerGroup]);
    this.offsetPos = [offsetx, offsety];
    this.branchGroup.sendToBack();
    this.skinGradient = new paper.Gradient(['rgb(0, 255, 180)', 'rgb(0, 220, 120)']);    
    this.outlineColor = 'rgb(0,200,100)';
    this.drawPlant();

  }

  drawPlant() {
    let iteration = this.plantiterator();
    let newNodes = iteration.new;
    if (newNodes.length == 0) return;
    for (let i = 0; i < newNodes.length; i++) {
      let node = newNodes[i];
      let nx = node.x + this.offsetPos[0];
      let ny = node.y + this.offsetPos[1];
      if (node.type == "*"){
        let flp = nextXY({x: nx, y: ny, angle: node.angle}, node.size * 0.5);
        let fl = paper.Path.Circle({x: flp.x, y:  flp.y, radius: node.size, fillColor: 'rgba(255, 255,0)', strokeColor: 'rgb(180, 180,0)'});
        this.flowerGroup.addChild(fl);
        continue;
      }
      let skel = this.skeletonPaths[node.branchN]
      let skin = this.skinPaths[node.branchN];
      if (skel == undefined) {

        skel = new paper.Path();
        this.skeletonPaths.push(skel);
        skin = new paper.Path();
        skel.strokeColor = skin.strokeColor = this.outlineColor;
        skin.closed = true;
        this.skinPaths.push(skin);
        let groupToAdd = node.branchN == 0 ? this.trunkGroup : this.branchGroup;
        groupToAdd.addChild(skin);
        groupToAdd.addChild(skel);
      }
      skel.add( [nx, ny]);
      let s = this.step;
      let lPoint = [ nx + s *  Math.cos(node.angle -Math.PI/2), ny + s * Math.sin(node.angle -Math.PI/2) ];
      let rPoint = [ nx + s *  Math.cos(node.angle +Math.PI/2), ny + s * Math.sin(node.angle + Math.PI/2) ];
      skin.add(lPoint)
      skin.insert(0, rPoint); 
      skin.fillColor = new paper.Color(this.skinGradient, skel.firstSegment.point, skel.lastSegment.point);
    }
  }
  
}
