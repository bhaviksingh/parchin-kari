const DEFAULT_CORE_PARAMS = {
  W: 200,
  H: 600,
  lengthPerNode: 10,
  widthPerNode: 5
}
export const getDefaultPlanParams = (params: Partial<PlantParams>): PlantParams  => {
  const constants = {
    ...DEFAULT_CORE_PARAMS,
    INIT_ANGLE: -0.5 * Math.PI,
    BRANCH_ANGLE: 0.25 * Math.PI,
    MICRO_CURVE: 0,
    CURVE_INCREMENT: 0.1 * Math.PI,
    BRANCH_PROBABILITY: 0.5,
    OFFSET_POSITION: { x: 0, y: 0 },
  };
  const defaults = {...constants, ...params};
  const calculated = {
    ...defaults,
    widthPerNode: params.widthPerNode || defaults.lengthPerNode / 2,
    SPACE_BETWEEN_BRANCHES: params.SPACE_BETWEEN_BRANCHES || defaults.lengthPerNode * 10,
    MAX_FLOWER_SIZE: params.MAX_FLOWER_SIZE || defaults.lengthPerNode * 1.2,
    PADDING: params.PADDING || defaults.H /10,
  }
  return calculated;
};
export const DEFAULT_FLOWER_PARAMS: FlowerParams = {
  size: 5,
  color: "red",
  numPetals: 5,
  petalArcAngle: 0.25 * Math.PI,
  pistilSize: 0.5,
  pistilColor: "blue",
};

export const DEFAULT_FRAME_PARAMS : FrameParams = {
  type: "TRIANGLE",
  ...DEFAULT_CORE_PARAMS
}
export const ROOT_BRANCH_PARAMS = { curveAt: 10000, flipped: false, curveOpposite: false };

export const makeRandomFlowerParams = (max_size: number): FlowerParams => {
  return {
    size: (Math.random() * 0.5 + 0.5) * max_size,
    color: `hsl(${Math.floor(Math.random() * 90)},50,50)`,
    numPetals: (Math.random() * 12 + 2) * 2 + 1,
    petalArcAngle: (Math.random() * 2 + 0.5) * Math.PI,
    pistilSize: Math.random() * 0.3 + 0.1,
    pistilColor: `hsl(${Math.floor(Math.random() * 90)},50,50)`,
  };
};
