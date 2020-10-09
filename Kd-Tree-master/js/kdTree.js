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

class KDTree {
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

  /**
   * 查找最近点
   * @param {*} point
   * @param {*} k
   */
  nearestNeighbours(point, k) {
    const inLeftPart = function (point, dim, split) {
      if (dim % 2 == 0) {
        return point.x < split ? true : false;
      } else {
        return point.y < split ? true : false;
      }
    };

    const distanceFromPlane = function (point, dim, split) {
      const planePoint =
        dim % 2 === 0 ? new Point(split, point.y) : new Point(point.x, split);
      return point.distance(planePoint);
    };

    const updateRadius = function (nodes) {
      let maxRadius = 0;
      nodes.forEach((node) => {
        if (node.distance > maxRadius) maxRadius = node.distance;
      });
      return maxRadius;
    };

    const addNewAndRemove = function (nodes, currentNode, point, k) {
      let contains = false;

      nodes.forEach((node) => {
        if (node.distance === currentNode.distance) contains = true;
      });

      if (!contains) {
        nodes.push(currentNode);
        nodes.sort((a, b) => {
          if (a.distance > b.distance) {
            return 1;
          } else if (a.distance < b.distance) {
            return -1;
          }
          return 0;
        });

        if (nodes.length > k) nodes.splice(-1, 1);
      }

      return nodes;
    };

    const findNearPoints = function (node, point, k, result) {
      if (node.point !== null) {
        node.distance = Math.round(point.distance(node.point));
        result.nodes.push(node);
        result.radius = node.distance;
        return result;
      }

      if (inLeftPart(point, node.dim, node.split)) {
        result = findNearPoints(node.left, point, k, result);
        if (result.nodes.length < k) {
          result = findNearPoints(node.right, point, k, result);
        }
      } else {
        result = findNearPoints(node.right, point, k, result);
        if (result.nodes.length < k) {
          result = findNearPoints(node.left, point, k, result);
        }
      }

      return result;
    };

    const searchSubtree = function (node, point, k, result) {
      let nodes = [];
      let currentNode, hyperplaneDistance;
      if (node !== null) nodes.push(node);

      while (nodes.length > 0) {
        currentNode = nodes.pop();

        if (currentNode.point !== null) {
          currentNode.distance = point.distance(currentNode.point);
          if (currentNode.distance < result.radius) {
            result.nodes = addNewAndRemove(result.nodes, currentNode, point, k);
            result.radius = updateRadius(result.nodes);
          }
          continue;
        }

        hyperplaneDistance = distanceFromPlane(
          point,
          currentNode.dim,
          currentNode.split
        );
        if (hyperplaneDistance > result.radius) {
          if (inLeftPart(point, currentNode.dim, currentNode.split)) {
            nodes.push(currentNode.left);
          } else {
            nodes.push(currentNode.right);
          }
        } else {
          nodes.push(currentNode.left);
          nodes.push(currentNode.right);
        }
      }

      return result;
    };

    const findNearestPoints = function (root, point, k, result) {
      let kd, hyperplaneDistance;
      let currentNode = result.nodes[0];
      while (currentNode !== root) {
        hyperplaneDistance = distanceFromPlane(
          point,
          currentNode.parent.dim,
          currentNode.parent.split
        );

        if (hyperplaneDistance < result.radius) {
          if (currentNode === currentNode.parent.left) {
            result = searchSubtree(currentNode.parent.right, point, k, result);
          } else {
            result = searchSubtree(currentNode.parent.left, point, k, result);
          }
        }

        currentNode = currentNode.parent;
      }

      return result;
    };

    let result = { nodes: [], radius: 0 };

    result = findNearPoints(this.root, point, k, result);
    result.nodes.forEach((node) => {
      if (node.distance > result.radius) result.radius = node.distance;
    });

    result = findNearestPoints(this.root, point, k, result);
    result.nodes = result.nodes.sort((a, b) => {
      if (a.distance > b.distance) {
        return 1;
      } else if (a.distance < b.distance) {
        return -1;
      }
      return 0;
    });

    return result;
  }

  insideRect(rectangle) {
    const inside = function (node, rectangle) {
      if (node === null) return;
      if (node.point !== null) {
        if (
          rectangle.xMin < node.point.x &&
          rectangle.xMax > node.point.x &&
          rectangle.yMin < node.point.y &&
          rectangle.yMax > node.point.y
        ) {
          node.point.selected = true;
        }
      } else {
        if (node.dim % 2 == 0) {
          if (rectangle.xMin < node.split) inside(node.left, rectangle);
          if (rectangle.xMax > node.split) inside(node.right, rectangle);
        } else {
          if (rectangle.yMin < node.split) inside(node.left, rectangle);
          if (rectangle.yMax > node.split) inside(node.right, rectangle);
        }
      }
    };

    inside(this.root, rectangle);
  }
}
