export default class Line {
  constructor({ start, end, width = 0.04, color = 0x00c8c8 }) {
    this.root = new THREE.Group();
    this.lineMesh = null;
    this.hLine = null;
    this.vLine = null;

    this.creatParam = {};
    this.type = "line";
    this.creatLine({
      start,
      end,
      width,
      color,
    });
    this.backColor = "";
    this.color = "rgb(0,200,200)";
  }

  getPoints() {
    return [this.creatParam.start, this.creatParam.end];
  }

  dispose() {
    this.tween && this.tween.kill();
  }

  creatLine({ start, end, width, color }) {
    this.creatParam = {
      start,
      end,
      width,
      color,
    };

    let s = new THREE.Vector3(start.x, start.y, start.z);
    let e = new THREE.Vector3(end.x, end.y, end.z);

    let lineMesh = this._creatLine(s, e, width, color);
    lineMesh.renderOrder = 1;
    this.lineMesh = lineMesh;

    this.root.add(lineMesh);
  }

  getRoot() {
    return this.root;
  }

  _cloneLine(oldLine, newLine) {
    oldLine.geometry.vertices = newLine.geometry.vertices;
    oldLine.geometry.verticesNeedUpdate = true;
    oldLine.geometry.uvsNeedUpdate = true;
    oldLine.geometry.normalsNeedUpdate = true;
    oldLine.geometry.colorsNeedUpdate = true;
    oldLine.geometry.elementsNeedUpdate = true;
    // oldLine.geometry.computeFaceNormals();
    // 必须删掉这个属性，否则修改后不生效
    delete oldLine.geometry.__directGeometry;
    oldLine.rotation.copy(newLine.rotation);
    oldLine.position.copy(newLine.position);
  }

  changeLine({ start, end }) {
    this.creatParam.start = start;
    this.creatParam.end = end;

    let s = new THREE.Vector3(start.x, start.y, start.z);
    let e = new THREE.Vector3(end.x, end.y, end.z);
    let { width, color } = this.creatParam;

    // lineMesh
    let lineMesh = this._creatLine(s, e, width, color);
    this._cloneLine(this.lineMesh, lineMesh);
    this.lineMesh.material = lineMesh.material;
  }

  _creatLine(s, e, width, color) {
    let len = e.clone().sub(s.clone()).length();
    var geometry = new THREE.CylinderGeometry(width, width, len, 32);
    var material = new THREE.MeshBasicMaterial({
      color: color,
      side: THREE.FrontSide,
      transparent: true,
    });
    material.needsUpdate = true;
    var line = new THREE.Mesh(geometry, material);
    line.name = this.root.name;
    line.userData.appId = this.id;
    line.userData.type = this.type;

    // 设置角度
    let dir = new THREE.Vector3();
    dir.copy(e).sub(s).normalize();
    let up = new THREE.Vector3(0, 1, 0);
    let quat = new THREE.Quaternion();
    quat.setFromUnitVectors(up, dir);
    line.applyQuaternion(quat);

    let { xOff, yOff, zOff } = this._getOff(len / 2, dir, s, e);
    line.position.x += xOff;
    line.position.y += yOff;
    line.position.z += zOff;

    return line;
  }

  _getOff(len, dir, start, end) {
    let xAxis = new THREE.Vector3(1, 0, 0);
    let xAngle = dir.angleTo(xAxis);
    let xOff = len * Math.cos(xAngle);
    xOff += start.x;

    let yAxis = new THREE.Vector3(0, 1, 0);
    let yAngle = dir.angleTo(yAxis);
    let yOff = len * Math.cos(yAngle);
    yOff += start.y;

    let zAxis = new THREE.Vector3(0, 0, 1);
    let zAngle = dir.angleTo(zAxis);
    let zOff = len * Math.cos(zAngle);
    zOff += start.z;

    return { xOff, yOff, zOff };
  }
}
