// import * as THREE from './lib/three.module.js'
import Stage from "./Stage.js";
import Line from "./Line.js";
import { loadTexture } from "./utils.js";
import TreeApp from "./TreeApp.js";

window.THREE = THREE;

class App {
  constructor() {
    window.lm = this;
    this.stage = new Stage("#app");
    this.stage.run();
    this.addPoint();
    this.addLine({ x: 10, y: 0 }, { x: 10, y: 10 });
    this.addLine({ x: 0, y: 10 }, { x: 10, y: 10 });
    this.addKeduX();
    this.addKeduY();
    this.setCamera();
    let treeApp = new TreeApp();
  }

  setCamera() {
    let cam = {
      x: 4.835792643236271,
      y: 4.24100824093595,
      z: 17.223974980396214,
    };
    this.stage.camera.position.set(cam.x, cam.y, cam.z);

    let t = {
      x: 4.8611421646449315,
      y: 4.6050743051786,
      z: -0.2603816797969634,
    };
    this.stage.control.target.set(t.x, t.y, t.z);
  }

  async addKeduX() {
    // 生成坐标轴图片 https://www.tutorialsteacher.com/codeeditor?cid=d3-46
    let box = new THREE.BoxGeometry(10, 1, 1);
    let texture = await loadTexture("./axis.png");
    let mat = new THREE.MeshBasicMaterial({
      map: texture,
      color: 0xff3333,
    });
    var cube = new THREE.Mesh(box, mat);
    cube.name = "x";
    cube.position.set(5.08, -0.6, 0);
    cube.rotation.set(-0.3, 0, 0);
    cube.scale.set(1.038, 1, 1);
    this.stage.scene.add(cube);
  }

  async addKeduY() {
    // 生成坐标轴图片 https://www.tutorialsteacher.com/codeeditor?cid=d3-46
    let box = new THREE.BoxGeometry(10, 1, 1);
    let texture = await loadTexture("./axis.png");
    let mat = new THREE.MeshBasicMaterial({
      map: texture,
      color: 0x00ff00,
    });
    var cube = new THREE.Mesh(box, mat);
    cube.name = "y";
    cube.position.set(-0.7, 5, 0);
    cube.rotation.set(0, 0.3, Math.PI / 2);
    cube.scale.set(1.03, 1, 1);
    this.stage.scene.add(cube);
  }

  addLine(s, e) {
    let l = new Line({
      start: { x: s.x, y: s.y, z: 0 },
      end: { x: e.x, y: e.y, z: 0 },
    });
    this.stage.scene.add(l.getRoot());
  }

  addBox(pos) {
    var geometry = new THREE.SphereGeometry(0.1, 64, 64);
    var material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      side: THREE.DoubleSide,
    });
    var cube = new THREE.Mesh(geometry, material);
    cube.position.copy(pos);
    cube.name = "test_cube";
    this.stage.scene.add(cube);
  }

  addPoint() {
    let arr = [
      { x: 2, y: 3 },
      { x: 5, y: 4 },
      { x: 9, y: 6 },
      { x: 4, y: 7 },
      { x: 8, y: 1 },
      { x: 7, y: 2 },
    ];
    arr.forEach((item) => {
      this.addBox(new THREE.Vector3(item.x, item.y, item.z));
    });
  }
}

window.onload = () => {
  let app = new App();
};
