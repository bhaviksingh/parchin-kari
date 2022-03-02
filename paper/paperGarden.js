class PaperGarden {
  constructor(it) {
    this.gardenIterator = it;
    this.planters = it();
    this.paperPlants = this.planters.map((planter, i) => 
      new PaperPlant(planter.plant, planter.x, planter.y)
    );
    
    this.drawGarden();
  }
  drawGarden() {
    this.paperPlants.forEach((pp,i) => {
      pp.drawPlant(this.planters[i].x, this.planters[i].y);
    })
  }
}