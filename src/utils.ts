
export const MINIMAL_MODE = false;
const DBG = false && MINIMAL_MODE ;

export const ld = (msg: string, ...args: any[]) => {
  if (DBG) {
    console.log(msg, args);
  }
};

export const nextXY = (node: GridNode, magnitude?: number): Position => {
  const m = magnitude || node.length;
  return { x: node.pos.x + m * Math.cos(node.angle), y: node.pos.y + m * Math.sin(node.angle) };
}