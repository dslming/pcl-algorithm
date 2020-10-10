export default class Geometry {
  static getCircle(center, radius){
    var segments = 64,
    material = new THREE.LineBasicMaterial({ color: 0x0000ff }),
    geometry = new THREE.CircleGeometry(radius, segments);
    let mesh = new THREE.Line(geometry, material)
    mesh.position.set(center.x, center.y, 0)
    mesh.name = "circle_" + new Date().getTime();
    return mesh
  }

  static getLine(s, e, color = 0x0000ff) {
    let line = new Line({
      start: { x: s.x, y: s.y, z: 0 },
      end: { x: e.x, y: e.y, z: 0 },
      color,
    });
    line.getRoot().name = "line_" + new Date().getTime();
    return line
  }

  static setColor(mesh, color=0x0000ff) {
    let mat = mesh.material
    mat.color = new THREE.Color(color)
    mat.needsUpdate = true
  }

  static setScale(mesh, scale=1.5) {
    mesh.scale.set(scale,scale,scale)
  }

  static getPoint({pos, size=0.1}) {
    var geometry = new THREE.SphereGeometry(size, 64, 64);
    var material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.DoubleSide,
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(pos);
    mesh.name = "point_" + new Date().getTime();
    return mesh
  }

  static getSphere({pos, radius}) {
    var geometry = new THREE.SphereGeometry(radius, 16, 16);
    var material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.DoubleSide,
      color: 0xff0000,
      transparent: true,
      opacity: 0.2,
      wireframe: true
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(pos);
    mesh.name = "sphere" + new Date().getTime();
    return mesh
  }
}
