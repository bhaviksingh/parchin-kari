import { Frame } from "../algo";
import { MINIMAL_MODE } from "../utils";
import paper from "paper"

export default class DrawFrame {

  params: CoreParams;
  frame: Frame;
  paths: paper.Path[] = [];
  myGroup: paper.Group;
  constructor(frame:Frame) {
    this.params = frame.params;
    this.frame = frame;
    if (MINIMAL_MODE) {
      new paper.Path.Rectangle({point: this.params.OFFSET_POSITION, size: {width: this.params.W, height: this.params.H}}).strokeColor = new paper.Color("grey");
      new paper.Path.Rectangle({
        point: {
          x: this.params.OFFSET_POSITION.x + this.params.PADDING,
          y: this.params.OFFSET_POSITION.y + this.params.PADDING,
        },
        size: { width: this.params.W - 2 * this.params.PADDING, height: this.params.H - 2 * this.params.PADDING },
      }).strokeColor = new paper.Color("red");
    }
    this.myGroup = new paper.Group();
    this.drawFrame();
  }

  drawFrame() {
    let newNodes = this.frame.getNewNodes();
    // console.log(this.frame.getAllNodes());
    for (let i = 0; i<newNodes.length; i++) {
      let node = newNodes[i];
      if (this.paths[node.branchNumber] == undefined) {
        let newPath = new paper.Path();
        newPath.strokeColor = new paper.Color("grey");
        newPath.strokeWidth = 5;
        //newPath.selected = true;
        this.paths[node.branchNumber] = newPath;
        this.myGroup.addChild(newPath);
      }
      console.log(newNodes[i]);
      this.paths[node.branchNumber].add(new paper.Point({x: newNodes[i].pos.x, y: newNodes[i].pos.y}));
    }
    
  }

}