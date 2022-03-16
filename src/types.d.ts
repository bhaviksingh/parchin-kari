
type NodeTypes = "F" | "*" | "+";
type Position = {x: number, y:number}
type Radians = number;

interface CoreParams {
  W: number,
  H: number,
  PADDING: number
  lengthPerNode: number,
  widthPerNode: number,  
  OFFSET_POSITION: Position
}


interface PlantParams extends CoreParams {
  INIT_ANGLE: Radians,
  SPACE_BETWEEN_BRANCHES: number,
  MAX_FLOWER_SIZE: number
  CURVE_INCREMENT : Radians,
  MICRO_CURVE : Radians
  BRANCH_ANGLE: Radians,
  BRANCH_PROBABILITY: number
}

interface GridNode {
  width: number,
  length: number,
  pos: Position,
  angle: Radians,
  branchDepth: number,
  branchNumber: number,
}

interface PlantNode extends GridNode {
  type: NodeTypes,
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

