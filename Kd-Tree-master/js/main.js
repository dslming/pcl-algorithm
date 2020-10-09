var canvas;
var vincent;
var points;
var tree;
var kValueElement, clearElement;
var kValue;
var rectangle = { xMin: 0, yMin: 0, xMax: 0, yMax: 0 };
var splitValueType = "median";
// on document ready load
$(function () {
  // main function that is called when document is loaded
  canvas = document.getElementById("canvas"); // canvas where would be draw element
  kValueElement = document.getElementById("kValue"); // number of neighbours element
  clearElement = document.getElementById("clear"); // clear button element

  canvas.addEventListener("mousedown", mouseControl, false); // mouse event listener for mouse down
  canvas.addEventListener("mousemove", mouseControl, false); // mouse event listener for mouse move
  canvas.addEventListener("mouseup", mouseControl, false); // mouse event listener for mouse up

  kValueElement.addEventListener("change", getKValue, false);

  clearElement.addEventListener("click", clear, false);

  document.getElementById("median").addEventListener(
    "click",
    function () {
      splitValueType = "median";
      recalculateTree();
    },
    false
  ); // changing value of splitValueType and recalculate tree

  document.getElementById("average").addEventListener(
    "click",
    function () {
      splitValueType = "average";
      recalculateTree();
    },
    false
  ); // changing value of splitValueType and recalculate tree

  document
    .getElementById("pointRadius")
    .addEventListener("change", function () {
      pointRadius = parseInt(this.value);
      pointRadius = pointRadius < 0 ? 0 : pointRadius;
      vincent.pointRadius = pointRadius;
      redraw();
    }); // change size of points

  // initialization of vincet for drawing
  vincent = new Vincent(canvas);
  vincent.init();

  // array for added points that would be sent to KdTree
  points = [];

  getKValue(); // set the default value for closest neighbours

  tree = new KDTree(splitValueType);
});

function getKValue() {
  kValue = parseInt(kValueElement.value);
  kValue = kValue < 0 ? 0 : kValue;
}

// clear canvas and remove all added points; reset tree
function clear() {
  points = [];
  tree = new KDTree();
  redraw();
}

function mouseControl(ev) {
  var x, y;

  // Get the mouse position relative to the <canvas> element
  if (ev.layerX || ev.layerX == 0) {
    x = ev.layerX;
    y = ev.layerY;
  } else if (ev.offsetX || ev.offsetX == 0) {
    x = ev.offsetX;
    y = ev.offsetY;
  }

  if (ev.type == "mouseup" && !ev.shiftKey && ev.button === 0) {
    addPoint(new Point(x, y));
  }

  if ((ev.type = "mouseup" && ev.button == 2)) {
    selectPoint(new Point(x, y));
  }

  if (ev.type == "mousedown" && ev.button == 1) {
    rectangle.xMin = x;
    rectangle.yMin = y;
  }

  if (ev.type == "mousemove" && ev.button == 1) {
    rectangle.xMax = x;
    rectangle.yMax = y;

    redraw();
  }

  if (ev.type == "mouseup" && ev.button == 1) {
    rectangle.xMax = x;
    rectangle.yMax = y;

    selectInRectangle();
  }
}

// debugging function
function showPoints() {
  var result = [];
  points.forEach(function (point, index) {
    result.push(point.x + "x" + point.y);
  });
  console.log(result.join(","));
}

// 重新计算值并重新绘制画布
function recalculateTree() {
  tree.splitValueType = splitValueType;
  tree.init(points);
  redraw();
}

function addPoint(point) {
  // add new point if the coordinates had changed
  if (
    points.length === 0 ||
    point.x !== points[points.length - 1].x ||
    point.y !== points[points.length - 1].y
  ) {
    points.push(point);
    recalculateTree();
  }

  resetRectangle();
}

function swap(a, b) {
  return [b, a];
}

function selectInRectangle() {
  if (rectangle.xMin > rectangle.xMax) {
    var swapped = swap(rectangle.xMin, rectangle.xMax);
    rectangle.xMin = swapped[0];
    rectangle.xMax = swapped[1];
  }
  if (rectangle.yMin > rectangle.yMax) {
    var swapped = swap(rectangle.yMin, rectangle.yMax);
    rectangle.yMin = swapped[0];
    rectangle.yMax = swapped[1];
  }

  tree.insideRect(rectangle);

  redraw();

  resetRectangle();
}

function selectPoint(point) {
  var selectedPoint = null;

  points.forEach(function (centerPoint, index) {
    if (centerPoint.select(point, vincent.pointRadius))
      selectedPoint = centerPoint;
  });

  if (selectedPoint !== null) {
    // find k+1 nearest neighbours; it counts itself to neighbours. for that
    // is there +1 to k
    var result = tree.nearestNeighbours(selectedPoint, kValue + 1);

    result.nodes.forEach(function (node, index) {
      if (node.point.selected) node.point.neighbourRadius = result.radius;
      node.point.neighbour = true;
    });

    redraw();
  }

  resetRectangle();
}

function redraw() {
  vincent.clear();

  points.forEach(function (point, index) {
    // base on type of point set drawing color
    var color = point.neighbour ? "#0000ce" : "#333333";
    var color = point.selected ? "#ce0000" : color;

    if (point.selected && point.neighbour)
      vincent.circle(point, point.neighbourRadius, "#cece00");

    vincent.point(point, color);
  });

  if (
    rectangle.xMin !== 0 &&
    rectangle.yMin !== 0 &&
    rectangle.xMax !== 0 &&
    rectangle.yMax !== 0
  ) {
    vincent.rect(
      new Point(rectangle.xMin, rectangle.yMin),
      new Point(rectangle.xMax, rectangle.yMax),
      "#da7700"
    );
  }

  drawDividingLines(this.tree.root, [0, 0, canvas.width, canvas.height]);

  deselectAllPoints();
}

function resetRectangle() {
  rectangle = { xMin: 0, yMin: 0, xMax: 0, yMax: 0 };
}

function deselectAllPoints() {
  points.forEach(function (point) {
    point.selected = false;
    point.neighbour = false;
  });
}

function drawDividingLines2(node, viewport) {
  var XMIN = 0,
    YMIN = 1,
    XMAX = 2,
    YMAX = 3;

  if (node === null) return;

  var viewportLocal = viewport.slice();

  if (node.isAxisX()) {
    viewportLocal[XMIN] = node.split;
    viewportLocal[XMAX] = node.split;
  } else {
    viewportLocal[YMIN] = node.split;
    viewportLocal[YMAX] = node.split;
  }

  // x方向颜色
  let blue = `#0000ff`;
  // y方向颜色
  let red = `#ff0000`;
  var color = node.isAxisX() ? red : blue;
  vincent.line(
    new Point(viewportLocal[XMIN], viewportLocal[YMIN]),
    new Point(viewportLocal[XMAX], viewportLocal[YMAX]),
    color
  );

  var viewportLeft = viewport.slice();
  var viewportRight = viewport.slice();

  if (node.isAxisX()) {
    viewportLeft[XMAX] = node.split;
    viewportRight[XMIN] = node.split;
  } else {
    viewportLeft[YMAX] = node.split;
    viewportRight[YMIN] = node.split;
  }

  drawDividingLines(node.left, viewportLeft);
  drawDividingLines(node.right, viewportRight);
}

function calcViewPort(node) {
  let s = { x: 0, y: 0 };
  let e = { x: 0, y: 0 };

  // 根节点
  if (!node.parent) {
    if (node.isAxisX()) {
      s.x = node.point.x;
      s.y = 0;

      e.x = node.point.x;
      e.y = canvas.height;
    } else {
      s.x = 0;
      s.y = node.point.y;

      e.x = canvas.width;
      e.y = node.point.y;
    }
  } else if (node.parent) {
    let parentNode = node.parent;
    let dir = parentNode.left.point.id == node.point.id ? "left" : "right";
    // console.error(dir)
    if (node.isAxisX()) {
      // 垂直方向
      s.x = node.point.x;
      s.y = 0;

      e.x = node.point.x;
      e.y = parentNode.point.y;
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

        e.x = canvas.width;
        e.y = node.point.y;
      }
    }
  }
  return { start: s, end: e };
}

function drawDividingLines(node) {
  if (node === null) return;

  // x方向颜色
  let blue = `#0000ff`;
  // y方向颜色
  let red = `#ff0000`;
  var color = node.isAxisX() ? red : blue;
  let { start, end } = this.calcViewPort(node);
  vincent.line(new Point(start.x, start.y), new Point(end.x, end.y), color);
  drawDividingLines(node.left);
  drawDividingLines(node.right);
}

setTimeout(() => {
  // let arr = [
  //   { x: 2, y: 3 },
  //   { x: 5, y: 4 },
  //   { x: 9, y: 6 },
  //   { x: 4, y: 7 },
  //   { x: 8, y: 1 },
  //   { x: 7, y: 2 },
  // ];
  // // 坐标轴的变换
  // arr.forEach((item) => {
  //   item.x *= 50;
  //   item.y *= 50;
  //   // item.y -= 500;
  //   // item.y = -item.y;
  //   addPoint(new Point(item.x, item.y));
  // });
}, 500);
