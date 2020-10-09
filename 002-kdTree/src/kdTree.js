class KDTreeNode {
  constructor() {
    // 位置
    this.point = null;
    // 分割值
    this.split = null;
    // 节点的尺寸，即使不使用x 或者 y轴
    this.dim = 0;

    this.left = null;
    this.right = null;
    this.parent = null;
    this.distance = 0;
  }

  isAxisX() {
    return this.dim % 2 === 0;
  }
}

export default class KDTree {
  constructor(splitValueType) {
    this.root = null;
    this.splitValueType = splitValueType;
  }

  init(points) {
    this.root = this.constructTree(points, 0, 2);
  }

  // 创建
  constructTree(points, dim, k) {
    if (points.length === 0) return null;

    if (points.length == 6) {
      // debugger
    }
    const node = new KDTreeNode();
    dim = this.computeVarianceXY(points) == "x" ? 0 : 1;
    node.dim = dim;
    node.cdir = this.computeVarianceXY(points);
    if (points.length === 1) {
      node.point = points[0];
      return node;
    }
    if (this.splitValueType === "median") {
      let point = this.computeSplitValueMedian(points, dim);
      node.split = dim == 0 ? point.x : point.y;
      node.point = point;
    } else if (this.splitValueType === "average") {
      let point = this.computeSplitValueAverage(points, dim);
      node.split = dim == 0 ? point.x : point.y;
      node.point = point;
    }

    let temp = [];
    for (let i = 0; i < points.length; i++) {
      if (points[i].id != node.point.id) {
        temp.push(points[i]);
      }
    }
    const pointsLeft = this.splitPoints(temp, node.split, dim, "left");
    const pointsRight = this.splitPoints(temp, node.split, dim, "right");

    const newDim = ++dim % k;

    node.left = this.constructTree(pointsLeft, newDim, k);
    if (node.left !== null) node.left.parent = node;

    node.right = this.constructTree(pointsRight, newDim, k);
    if (node.right !== null) node.right.parent = node;

    return node;
  }

  computeVariance(arr) {
    let sum = 0;
    let v = 0;

    arr.forEach((item) => {
      sum += item;
    });
    let average = Math.round(sum / arr.length);
    arr.forEach((item) => {
      v += Math.pow(item - average, 2);
    });
    return v;
  }

  computeVarianceXY(points) {
    let xArr = [];
    let yArr = [];
    points.forEach((item) => {
      xArr.push(item.x);
      yArr.push(item.y);
    });
    let xv = this.computeVariance(xArr);
    let yv = this.computeVariance(yArr);
    // console.error(xv, yv)
    if (xv >= yv) {
      return "x";
    } else {
      return "y";
    }
  }

  computeSplitValueAverage(points, dim) {
    let sum = 0;
    for (let i = 0; i < points.length; i++) {
      if (dim % 2 === 0) {
        sum += points[i].x;
      } else {
        sum += points[i].y;
      }
    }
    return Math.round(sum / points.length);
  }

  computeSplitValueMedian(points, dim) {
    if (dim % 2 === 0) {
      points.sort((a, b) => {
        if (a.x > b.x) return 1;
        else if (a.x < b.x) return -1;
        return 0;
      });
      return points[Math.floor(points.length / 2)];
    } else {
      points.sort((a, b) => {
        if (a.y > b.y) return 1;
        else if (a.y < b.y) return -1;
        return 0;
      });
      return points[Math.floor(points.length / 2)];
    }
  }

  splitPoints(points, split, dim, direction) {
    const resultPoints = [];

    if (direction === "left") {
      for (let i = 0; i < points.length; i++) {
        if (dim % 2 == 0) {
          if (points[i].x < split) resultPoints.push(points[i]);
        } else {
          if (points[i].y < split) resultPoints.push(points[i]);
        }
      }
      return resultPoints;
    }

    if (direction === "right") {
      for (let i = 0; i < points.length; i++) {
        if (dim % 2 == 0) {
          if (points[i].x >= split) resultPoints.push(points[i]);
        } else {
          if (points[i].y >= split) resultPoints.push(points[i]);
        }
      }
      return resultPoints;
    }
  }

  distance_(p1, p2) {
    var vector = {x: p2.x - p1.x, y: p2.y - p1.y};
    return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
  }

  isInCircle_(p, circle) {
    return this.distance_(p, circle.center) <= circle.radius;
  }

  searchByRadius(p, radius) {
    var circle = {center: p, radius: radius}
    var result = []
    var nodesQueue = []
    var currentNode
    var partitioning

    if (this.root) {
      nodesQueue.push(this.root);

      while (currentNode = nodesQueue.pop()) {
        partitioning = currentNode.cdir

        // Traverse the left  if circle lies in the left/up half:
        if (currentNode.left &&
            p[partitioning] - radius < currentNode.point[partitioning]) {
          nodesQueue.push(currentNode.left);
        }

        // Traverse the right  if circle lies in the right/down half:
        if (currentNode.right &&
            p[partitioning] + radius >= currentNode.point[partitioning]) {
          nodesQueue.push(currentNode.right);
        }

        if (this.isInCircle_(currentNode.point, circle)) {
          result.push(currentNode.point);
        }
      }
    }

    return result;
  }
}
