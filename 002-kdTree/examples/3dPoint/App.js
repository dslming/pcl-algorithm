import Stage from "./Stage.js";
import TreeApp from "./TreeApp.js";

window.THREE = THREE;

class App {
  constructor() {
    this.root = new THREE.Group();
    this.root.name = "draw";
    window.lm = this;
    this.stage = new Stage("#app");
    this.stage.run();
    this.stage.scene.add(this.root);

    this.setCamera();
    this.treeApp = new TreeApp(this);
  }

  removeMeshByName(name) {
    let old = this.root.getChildByName(name)
    old && this.root.remove(old)
  }

  addMesh(mesh) {
    this.root.add(mesh)
  }

  setCamera() {
    let cam = {
      x: 4.822139751357829,
      y: 4.044927434060573,
      z: 260.6408009313641,
    };
    this.stage.camera.position.set(cam.x, cam.y, cam.z);

    let t = {
      x: 4.8611421646449315,
      y: 4.6050743051786,
      z: -0.2603816797969634,
    };
    this.stage.control.target.set(t.x, t.y, t.z);
  }



}

window.onload = () => {
  let app = new App();
};
