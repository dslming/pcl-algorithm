import Geometry from "./Geometry/index.js"

export default class TreeApp {
  constructor(draw) {
    this.pointsIns = {}
    this.draw = draw
    this.loadData();
  }

  loadData() {
    var distance = function(a, b) {
      let posA = a
      let posB = b
      var dx = posA.x - posB.x
      var dy = posA.y - posB.y
      var dz = posA.z - posB.z
      return dx * dx + dy * dy + dz*dz;
    }
    var dims = ['x', 'y', 'z'];
    let points = []

    let pointCount = 10
    let hash = new HashMap()
    for(let i=0;i<pointCount;i++) {
      let x = Math.random()*100 - 50
      let y = Math.random()*100 - 50
      let z = Math.random()*100 - 50
      x = Number.parseInt(x)
      y = Number.parseInt(y)
      z = Number.parseInt(z)
      const pos = {x,y,z}

      let point = Geometry.getPoint({pos,size:0.5})
      this.draw.addMesh(point)
      const id = parseInt(Math.random() * 100000);
      hash.set(id, point)
      point.name = id
      // this.pointsIns[id] = {
      //   mesh
      // }

      points.push(point)

    }
    this.tree = new kdTree(points, distance, dims)
  }

  search({point={x:0,y:0,z:0}, radius=1}) {
    const count = Object.keys(this.pointsIns).length
    let rets = this.tree.nearest(point, count, radius)
    console.error(rets)
  }
}
