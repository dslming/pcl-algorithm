import KDTree from "./kdTree.js";

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.id = parseInt(Math.random() * 100000);
  }
}

export default class TreeApp {
  constructor() {
    this.points = [];
    this.tree = new KDTree("median");
    window.tree = this.tree;
    this.loadData();
  }

  recalculateTree() {
    this.tree.init(this.points);
  }

  addPoint(point) {
    if (
      this.points.length === 0 ||
      point.x !== this.points[this.points.length - 1].x ||
      point.y !== this.points[this.points.length - 1].y
    ) {
      this.points.push(point);
      this.recalculateTree();
    }
  }

  loadData() {
    let arr = [
      { x: 2, y: 3 },
      { x: 5, y: 4 },
      { x: 9, y: 6 },
      { x: 4, y: 7 },
      { x: 8, y: 1 },
      { x: 7, y: 2 },
    ];

    arr.forEach((item) => {
      this.addPoint(new Point(item.x, item.y));
    });
  }
}
