import Geometry from "./Geometry/index.js"

export default class TreeApp {
  constructor(draw) {
    this.draw = draw
    this.loadData();
  }

  loadData() {
    var distance = function(a, b) {
      let dq =  Math.pow(a.x - b.x, 2) +  Math.pow(a.y - b.y, 2)  +  Math.pow(a.z - b.z, 2) 
      return Math.sqrt(dq)
    }

    var dims = ['x', 'y', 'z'];
    let points = []

    let pointCount = 5000
    let hash = new HashMap()

    let point = Geometry.getPoint({pos:{x:0,y:0,z:0},size:0.5})

    for(let i=0;i<pointCount;i++) {
      let x = Math.random()*100 - 50
      let y = Math.random()*100 - 50
      let z = Math.random()*100 - 50

      x = Number.parseInt(x)
      y = Number.parseInt(y)
      z = Number.parseInt(z)

      const pos = {
        x,
        y,
        z,
        index: i
      }
      let tempPoint = point.clone()
      tempPoint.position.copy(pos)
      hash.set(i, tempPoint)
      points.push(pos)
      this.draw.addMesh(tempPoint)
    }
    this.tree = new kdTree(points, distance, dims)
    this.hash = hash
  }

  search({ point = { x: 0, y: 0, z: 0 }, radius = 1 }) {
    this.hash.forEach(item => {
      Geometry.setColor(item, 0x000000)
      Geometry.setScale(item, 1)
    })

    const count = 1000
    console.time("c")
    let ret = this.tree.nearest(point, count,radius )
    console.timeEnd("c")
    console.error(ret);

    ret.forEach(item => {
      let {index} = item[0]
      let mesh = this.hash.get(index)
      Geometry.setColor(mesh, 0xff0000)
      Geometry.setScale(mesh, 2)
    });

    let sphere = Geometry.getSphere({ pos:point, radius })
    sphere.name = "sphere"
    this.draw.removeMeshByName(sphere.name)
    this.draw.addMesh(sphere)
  }
}
