const createGarden = (W, H, M, SPACING) => {
  let grow = garden(W, H, M, SPACING);
  let planters;

  const iterate = () => {
    planters = grow();
  };

  const reset = () => {
    grow = garden(W, H, M, SPACING);
    planterFrames = [];
  };

  //Returns *just* the frames -- removing leaves
  const getPlanters = () => {
    //console.log("Returning planters" , planters);
    return planters.map((planter) => ({
      x: planter.x,
      y: planter.y,
      w: planter.w,
      h: planter.h,
      hasBorder: planter.hasBorder,
    }));
  };

  //Given a planter ID, returns all leaves
  const getAllBranches = (i) => {
    const branches = planters[i].leaves.all;
    //console.log("Returning all branches" , branches, planters[i]);
    return branches;
  };

  //Given a planter ID, returns just the necessary leaves
  const getCurrentLeaves = (i) => {
    return planters[i].leaves.new;
  };

  iterate();
  return {
    iterate,
    reset,
    getPlanters,
    getAllBranches,
    getCurrentLeaves,
  };
};

//p5.js creator, gP is gardenParams
const sketchFactory = (drawHelper) => {
  return (p) => {

    const gP = drawHelper.params;
    console.log("Creating sketch", gP);
    const W = gP.W;
    const H = gP.H;
    const M = gP.M;
    const SPACING = gP.SPACING;
    const bgColor = gP.bgColor || [30, 5, 90];
    const ANIMATE = gP.ANIMATE;
    const GHOST = gP.GHOST;
    

    let myGarden;

    p.setup = () => {
      p.createCanvas(W, H);
      myGarden = createGarden(W, H, M, SPACING);
      p.rectMode(p.CENTER);
      p.colorMode(p.HSB, 360, 100, 100, 100);
      p.background(...bgColor);
    };

    p.draw = () => {
      if (GHOST) p.background(...bgColor, 10);
    

      const allFrames = myGarden.getPlanters();

      allFrames.forEach((frame, i) => {
        if (frame.hasBorder) {
          drawHelper.drawFrame(p, frame);
        }
        p.push();
        p.translate(frame.x, frame.y);
        const allBranches = myGarden.getAllBranches(i);

        allBranches.forEach((branch) => {
          let currentLeaf = branch[branch.length - 1];
          let prevLeaf = branch[branch.length - 2];
          if(drawHelper.drawBranch && prevLeaf) {
            drawHelper.drawBranch(p, currentLeaf, prevLeaf);
          }
        });

        //This function is kinda broken - because we're drawing "one ahead" (eg: the first node is never even returned here)
        const newLeaves = myGarden.getCurrentLeaves(i);
        newLeaves.forEach((newLeaf) => {
          if(drawHelper.drawLeaf) {
            drawHelper.drawLeaf(p, newLeaf);
         } 
        })

        p.pop();
      });
      if (ANIMATE && p.frameCount % 5 == 0) {
        myGarden.iterate();
      }
    };

    p.keyPressed = () => {
      if (p.key == "q") {
        p.background(...bgColor);
        myGarden.reset();
      }

      myGarden.iterate();
    };
  };
};
