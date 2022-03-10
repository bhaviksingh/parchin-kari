class PaperPlant {
  constructor(it, offsetx, offsety) {
    this.plantiterator = it;
    this.step = 10;
    this.skeletonPaths = [];
    this.skinPaths = [];
    this.trunkGroup = new paper.Group();
    this.branchGroup = new paper.Group();
    this.flowerGroup = new paper.Group();
    this.gridGroup = new paper.Group();
    this.myGroup = new paper.Group([this.trunkGroup, this.branchGroup, this.flowerGroup, this.gridGroup]);
    this.offsetPos = [offsetx, offsety];
    this.branchGroup.sendToBack();
    this.gridGroup.sendToBack();
    this.skinGradient = new paper.Gradient(["rgb(0, 220, 120)", "rgb(0, 220, 120)"]);
    this.outlineColor = "rgb(0,200,100)";
    this.drawPlant();
  }

  drawPlant() {
    let iteration = this.plantiterator();
    this.drawGrid(iteration.grid, iteration.M);
    let newNodes = iteration.new;
    if (newNodes.length == 0) return;

    for (let i = 0; i < newNodes.length; i++) {
      let node = newNodes[i];
      let nx = node.x + this.offsetPos[0];
      let ny = node.y + this.offsetPos[1];
      if (node.type == "*") {
        // let flposition = nextXY({x: nx, y: ny, angle: node.angle}, node.size * 0.5);
        // let fl = paper.Path.Circle({x: flp.x, y:  flp.y, radius: node.size, fillColor: 'rgba(255, 255,0)', strokeColor: 'rgb(180, 180,0)'});
        //TODO: We are drawing flowers many times? I'm not sure why.
        let fl = new PaperFlower({ ...node, x: nx, y: ny });
        this.flowerGroup.addChild(fl.myGroup);
        continue;
      }
      let skel = this.skeletonPaths[node.branchN];
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
      skel.add([nx, ny]);
      let s = this.step;
      let lPoint = [nx + s * Math.cos(node.angle - Math.PI / 2), ny + s * Math.sin(node.angle - Math.PI / 2)];
      let rPoint = [nx + s * Math.cos(node.angle + Math.PI / 2), ny + s * Math.sin(node.angle + Math.PI / 2)];
      skin.add(lPoint);
      skin.insert(0, rPoint);
      skin.fillColor = new paper.Color(this.skinGradient, skel.firstSegment.point, skel.lastSegment.point);
    }
  }

  drawGrid(grid, M) {
    if (!MINIMAL_MODE) {
      return false;
    }
    let nodes = [...this.gridGroup._children];
    for (var i = 0; i < grid.length; i++) {
      for (var j = 0; j < grid[i].length; j++) {
        let node;
        if (nodes.length == 0) {
          node = new paper.Path.Rectangle({ x: M * i, y: M * j, width: M, height: M });
          node.strokeColor = "grey";
          this.gridGroup.addChild(node);
        } else {
          node = nodes[i * grid.length + j];
        }
        if (grid[i][j] !== false) {
          node.fillColor = grid[i][j] === 'flower' ?  'blue ': "rgb(200,250,200)"
        } else {
          node.fillColor = "rgb(250,250,250)";
        }
      }
    }
  }
}
