type NodeTypes = "F" | "*" | "+";
type Position = {x: number, y:number}
type Radians = number;

interface PlantParams {
  lengthPerNode: number,
  widthPerNode: number,
  INIT_ANGLE: Radians,
  W: number,
  H: number,
  SPACE_BETWEEN_BRANCHES: number,
  MAX_FLOWER_SIZE: number
  CURVE_INCREMENT : Radians,
  MICRO_CURVE : Radians
  BRANCH_ANGLE: Radians,
  BRANCH_PROBABILITY: number,
  PADDING: number
  OFFSET_POSITION: Position
}

interface PlantNode {
  type: NodeTypes,
  pos: Position,
  angle: Radians,
  branchDepth: number,
  branchNumber: number,
  index: number,
  length: number,
  width: number,
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

