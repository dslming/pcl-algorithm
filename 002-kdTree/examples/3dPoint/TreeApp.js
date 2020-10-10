import Geometry from "./Geometry/index.js"

export default class TreeApp {
  constructor(draw) {
    this.pointsIns = {}
    this.draw = draw
    this.loadData();
  }

  loadData() {
    var distance = function(a, b) {
			return Math.pow( a[ 0 ] - b[ 0 ], 2 ) + Math.pow( a[ 1 ] - b[ 1 ], 2 ) + Math.pow( a[ 2 ] - b[ 2 ], 2 );
    }

    var dims = ['x', 'y', 'z'];
    let points = []

    let pointCount = 10
    let hash = new HashMap()
		var positions = new Float32Array( pointCount * 3 );
    for(let i=0;i<pointCount;i++) {
      let x = Math.random()*100 - 50
      let y = Math.random()*100 - 50
      let z = Math.random() * 100 - 50

      x = Number.parseInt(x)
      y = Number.parseInt(y)
      z = Number.parseInt(z)
       positions[i * 3 + 0] = x
      positions[i*3+1] = y
      positions[i*3+2] = z
      const pos = {x,y,z}

      let point = Geometry.getPoint({pos,size:0.5})
      this.draw.addMesh(point)
      const id = parseInt(Math.random() * 100000);
      hash.set(i, point)
      point.name = id
      points.push(x,y,z)
    }
    this.tree = new THREE.TypedArrayUtils.Kdtree(positions, distance, 3);
    this.hash = hash
  }

  search({ point = { x: 0, y: 0, z: 0 }, radius = 1 }) {
    this.hash.forEach(item => {
      Geometry.setColor(item, 0x000000)
      Geometry.setScale(item, 1)
    })

    var ret = this.tree.nearest([point.x, point.y, point.z], 100, radius);
    ret.forEach(item => {
      let index = item[0].pos
      let mesh = this.hash.get(index)
      Geometry.setColor(mesh, 0xff0000)
      Geometry.setScale(mesh, 2)
    });
    console.error(ret);


    let sphere = Geometry.getSphere({ pos:point, radius })
    sphere.name = "sphere"
    this.draw.removeMeshByName(sphere.name)
    this.draw.addMesh(sphere)
  }
}
