class PaperGarden {
  constructor(it) {
    this.gardenIterator = it;
    this.planters = undefined;
    this.paperPlants = undefined;
    this.gardenGroup = new paper.Group();
    this.drawGarden();
  }
  drawGarden() {
    if (this.planters == undefined) {
      this.planters = this.gardenIterator();
      this.paperPlants = this.planters.map((planter, i) => {
        let plant = new PaperPlant(planter.plant, planter.x, planter.y);
        this.gardenGroup.addChild(plant.myGroup);
        return plant;
      });
      return;
    }
    this.paperPlants.forEach((pp, i) => {
      pp.drawPlant(this.planters[i].x, this.planters[i].y);
    });
  }
}
