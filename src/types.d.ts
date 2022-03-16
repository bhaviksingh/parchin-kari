
type NodeTypes = "F" | "*" | "+";
type Position = {x: number, y:number}
type Radians = number;

interface CoreParams {
  W: number,
  H: number,
  lengthPerNode: number,
  widthPerNode: number,  
}
interface FrameParams extends CoreParams {
  type: "TRIANGLE" | "RECTANGLE",
}

interface PlantParams extends CoreParams {
  INIT_ANGLE: Radians,
  SPACE_BETWEEN_BRANCHES: number,
  MAX_FLOWER_SIZE: number
  CURVE_INCREMENT : Radians,
  MICRO_CURVE : Radians
  BRANCH_ANGLE: Radians,
  BRANCH_PROBABILITY: number,
  PADDING: number
  OFFSET_POSITION: Position
}

interface GridNode {
  width: number,
  length: number,
  pos: Position,
  angle: Radians,
}

interface PlantNode extends GridNode {
  type: NodeTypes,
  branchDepth: number,
  branchNumber: number,
  index: number,
  branchInfo: BranchingParams
  flower: FlowerParams
}
interface StraightPlantNode extends PlantNode {
  type: "F" 
}
interface FlowerNode extends PlantNode {
  type: "*"
  flower: FlowerParams
}
type Branch = PlantNode[];

interface BranchingParams {
  curveAt: number,
  flipped: boolean,
  curveOpposite: boolean
}

interface FlowerParams {
  size: number,
  color: string,
  numPetals: number,
  petalArcAngle: Radians,
  pistilSize: number,
  pistilColor: string 
}

