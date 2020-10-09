import KDTree from "./kdTree.js";
import { sleep } from "./utils.js";

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.id = parseInt(Math.random() * 100000);
  }
}

export default class TreeApp {
  constructor(draw) {
    this.points = [];
    this.width = 10;
    this.height = 10;
    this.tree = new KDTree("median");
    window.tree = this.tree;
    this.draw = draw;
    this.loadData();
  }

  redraw() {
    this.draw.claer();
    this.drawDividingLines(this.tree.root);
  }

  calcViewPort(node) {
    let s = { x: 0, y: 0, z: 0 };
    let e = { x: 0, y: 0, z: 0 };
    s = new THREE.Vector3(s.x, s.y, s.z);
    e = new THREE.Vector3(e.x, e.y, e.z);

    // 根节点
    if (!node.parent) {
      if (node.isAxisX()) {
        s.x = node.point.x;
        s.y = 0;

        e.x = node.point.x;
        e.y = this.height;
      } else {
        s.x = 0;
        s.y = node.point.y;

        e.x = this.width;
        e.y = node.point.y;
      }
    } else if (node.parent) {
      let parentNode = node.parent;
      let dir = parentNode.left.point.id == node.point.id ? "left" : "right";
      // console.error(dir)
      if (node.isAxisX()) {
        // 垂直方向
        if (dir == "left") {
          s.x = node.point.x;
          s.y = 0;

          e.x = node.point.x;
          e.y = parentNode.point.y;
        } else {
          s.x = node.point.x;
          s.y = parentNode.point.y;

          e.x = node.point.x;
          e.y = this.height;
        }
      } else {
        // 水平方向
        if (dir == "left") {
          s.x = 0;
          s.y = node.point.y;

          e.x = parentNode.point.x;
          e.y = node.point.y;
        } else if (dir == "right") {
          s.x = parentNode.point.x;
          s.y = node.point.y;

          e.x = this.width;
          e.y = node.point.y;
        }
      }
    }
    return { start: s, end: e };
  }

  async drawDividingLines(node) {
    if (node === null) return;
    // x方向颜色
    let blue = 0x0000ff;
    // y方向颜色
    let red = 0xff0000;

    var color = node.isAxisX() ? red : blue;
    let { start, end } = this.calcViewPort(node);
    this.draw.addLine(start, end, color);
    this.drawDividingLines(node.left);
    this.drawDividingLines(node.right);
  }

  recalculateTree() {
    this.tree.init(this.points);

    this.redraw();
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

  async loadData() {
    let arr = [
      { x: 2, y: 3 },
      { x: 5, y: 4 },
      { x: 9, y: 6 },
      { x: 4, y: 7 },
      { x: 8, y: 1 },
      { x: 7, y: 2 },
    ];
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];
      await sleep(20);
      this.draw.addPoint(new THREE.Vector3(item.x, item.y, item.z));
      this.addPoint(new Point(item.x, item.y));
    }
  }
}
