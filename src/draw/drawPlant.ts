import paper from "paper"
import Plant from "../algo";

export default class DrawPlant {
  plant: Plant;
  skeletonPaths: paper.Path[] = [];
  skinPaths: paper.Path[] = [];
  trunkGroup = new paper.Group();
  flowerGroup = new paper.Group();
  branchGroup = new paper.Group()
  myGroup = new paper.Group([this.trunkGroup, this.branchGroup, this.flowerGroup]);
  skinColor = "rgb(0, 220, 120)";
  outlineColor = "rgb(0,200,100)";

  constructor(plant: Plant) {    
    this.plant = plant;
    this.branchGroup = new paper.Group();
    this.flowerGroup = new paper.Group();
    this.branchGroup.sendToBack();
    this.drawPlant();
  }

  drawPlant() {
    let newNodes = this.plant.getNewNodes();
    for (let i = 0; i < newNodes.length; i++) {
      let node = newNodes[i];
      let nx = node.pos.x;
      let ny = node.pos.y;
      if (node.type == "*") {
        let fl = new paper.Path.Circle({
          x: node.pos.x,
          y: node.pos.y,
          radius: node.flower.size,
          fillColor: node.flower.color,
          strokeColor: this.outlineColor,
        });
        this.flowerGroup.addChild(fl);
        //let fl = new PaperFlower({ ...node, x: nx, y: ny });
        //this.flowerGroup.addChild(fl);
        continue;
      }
      let skel = this.skeletonPaths[node.branchNumber];
      let skin = this.skinPaths[node.branchNumber];
      if (skel == undefined) {
        skel = new paper.Path();
        this.skeletonPaths.push(skel);
        skin = new paper.Path();
        skel.strokeColor = skin.strokeColor = new paper.Color(this.outlineColor);
        skin.closed = true;
        this.skinPaths.push(skin);
        let groupToAdd = node.branchNumber == 0 ? this.trunkGroup : this.branchGroup;
        groupToAdd.addChild(skin);
        groupToAdd.addChild(skel);
      }
      skel.add([nx, ny]);
      let s = node.width;
      let lPoint = new paper.Point([nx + s * Math.cos(node.angle - Math.PI / 2), ny + s * Math.sin(node.angle - Math.PI / 2)]);
      let rPoint = new paper.Point({x: nx + s * Math.cos(node.angle + Math.PI / 2), y: ny + s * Math.sin(node.angle + Math.PI / 2)});
      skin.add(lPoint);
      skin.insert(0, rPoint);

      // skin.fillColor = new paper.Color(this.skinGradient, skel.firstSegment.point, skel.lastSegment.point);
      skin.fillColor = new paper.Color(this.skinColor);
    }
  }
}
