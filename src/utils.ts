const DBG = false;
export const MINIMAL_MODE = false;

export const ld = (msg: string, ...args: any[]) => {
  if (DBG) {
    console.log(msg, args);
  }
};

export const nextXY = (node: PlantNode, magnitude?: number): Position => {
  const m = magnitude || node.length;
  return { x: node.pos.x + m * Math.cos(node.angle), y: node.pos.y + m * Math.sin(node.angle) };
}